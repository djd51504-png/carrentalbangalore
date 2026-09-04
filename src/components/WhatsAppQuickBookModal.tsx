import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Briefcase, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppLink, type WhatsAppApp, isAndroid } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";

const DEFAULT_AREAS = [
  "Hebbal", "Thanisandra", "KR Puram", "Bellandur",
  "Bommanahalli", "Kengeri", "Chikabanavara", "Kadugodi",
];

interface QuickCar {
  id: string;
  label: string;
  price: number;
  kmLimit: number;
  extraKmCharge: number;
  areas: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateBookingId = () =>
  `CRB${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

const todayStr = () => new Date().toISOString().slice(0, 10);

const WhatsAppQuickBookModal = ({ open, onOpenChange }: Props) => {
  const [cars, setCars] = useState<QuickCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [carId, setCarId] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(todayStr());
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropDate, setDropDate] = useState(todayStr());
  const [dropTime, setDropTime] = useState("10:00");

  useEffect(() => {
    if (!open || cars.length > 0) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("price", { ascending: true });
      if (!cancelled) {
        if (!error && data) {
          setCars(
            data
              .filter((c: any) => c.is_available !== false)
              .map((c: any) => ({
                id: c.id,
                label: `${c.brand ? c.brand + " " : ""}${c.name}`,
                price: c.price,
                kmLimit: c.km_limit ?? 300,
                extraKmCharge: c.extra_km_charge ?? 10,
                areas: [...(c.locations || []), ...(c.custom_location ? [c.custom_location] : [])],
              })),
          );
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, cars.length]);

  const selectedCar = useMemo(() => cars.find((c) => c.id === carId) || null, [cars, carId]);

  const areaOptions = useMemo(() => {
    const list = selectedCar && selectedCar.areas.length > 0 ? selectedCar.areas : DEFAULT_AREAS;
    return Array.from(new Set(list));
  }, [selectedCar]);

  useEffect(() => {
    if (area && !areaOptions.includes(area)) setArea("");
  }, [areaOptions, area]);

  const pickupAt = useMemo(() => new Date(`${pickupDate}T${pickupTime}:00`), [pickupDate, pickupTime]);
  const dropAt = useMemo(() => new Date(`${dropDate}T${dropTime}:00`), [dropDate, dropTime]);

  const { totalDays, extraHours, validTrip } = useMemo(() => {
    const ms = dropAt.getTime() - pickupAt.getTime();
    if (!Number.isFinite(ms) || ms <= 0) return { totalDays: 0, extraHours: 0, validTrip: false };
    const hours = Math.ceil(ms / 3600000);
    return { totalDays: Math.max(1, Math.floor(hours / 24)), extraHours: hours % 24, validTrip: true };
  }, [pickupAt, dropAt]);

  const estimatedPrice = useMemo(
    () => (selectedCar ? Math.round(selectedCar.price * totalDays) : 0),
    [selectedCar, totalDays],
  );

  const fmt = (d: string, t: string) => {
    const dt = new Date(`${d}T${t}:00`);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  const buildMessage = (bookingId: string) => {
    const lines = [
      "Hi, I want to book a self drive car from Car Rental Bengaluru.",
      "",
      `📋 Booking ID: ${bookingId}`,
    ];
    if (selectedCar) {
      lines.push(`🚗 Car: ${selectedCar.label}`);
      lines.push(`💰 Estimated Price: ₹${estimatedPrice.toLocaleString()} (${totalDays} day${totalDays > 1 ? "s" : ""}${extraHours ? ` ${extraHours} hr` : ""})`);
      lines.push(`🛣️ KM Limit: ${selectedCar.kmLimit}km/day (₹${selectedCar.extraKmCharge}/extra km)`);
    }
    lines.push(`📅 Pickup: ${fmt(pickupDate, pickupTime)}`);
    lines.push(`📅 Drop: ${fmt(dropDate, dropTime)}`);
    lines.push(`📍 Pickup Area: ${area || "All over Bangalore"}`);
    lines.push("");
    lines.push(`👤 Name: ${name}`);
    lines.push(`📞 Phone: ${phone}`);
    lines.push("");
    lines.push("Please confirm availability.");
    return lines.join("\n");
  };

  const previewMessage = useMemo(() => buildMessage("CRB-XXXXXX"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCar, area, name, phone, pickupDate, pickupTime, dropDate, dropTime, estimatedPrice, totalDays, extraHours]);

  const errors = useMemo(() => {
    if (name.trim().length < 2) return "Please enter your name.";
    if (!/^[0-9]{10}$/.test(phone.trim())) return "Please enter a valid 10-digit phone number.";
    if (!validTrip) return "Drop date & time must be after pickup.";
    return null;
  }, [name, phone, validTrip]);

  const send = async (app: WhatsAppApp) => {
    if (errors) {
      toast({ title: "Check your details", description: errors, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const bookingId = generateBookingId();
    const message = buildMessage(bookingId);

    try {
      const payload = {
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        pickup_date: `${pickupDate}T${pickupTime}:00`,
        drop_date: `${dropDate}T${dropTime}:00`,
        pickup_location: area || "All over Bangalore",
        car_name: selectedCar ? selectedCar.label : "Any car",
        car_id: selectedCar ? selectedCar.id : null,
        total_days: totalDays,
        total_hours: extraHours,
        estimated_price: estimatedPrice,
        status: "pending",
        booking_id: bookingId,
        notes: "Quick booking via WhatsApp modal",
      };
      const { error } = await supabase.from("booking_enquiries").insert(payload);
      if (error) throw error;

      try {
        await supabase.functions.invoke("send-availability-notification", {
          body: {
            customerName: payload.customer_name,
            customerPhone: payload.customer_phone,
            pickupDate: payload.pickup_date,
            dropDate: payload.drop_date,
            pickupLocation: payload.pickup_location,
            totalDays,
            totalHours: extraHours,
            carName: payload.car_name,
            estimatedPrice,
            bookingId,
          },
        });
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }

      toast({ title: "Booking request saved", description: `Booking ID ${bookingId}` });
    } catch (err) {
      console.error("Error saving booking:", err);
      toast({
        title: "Couldn't save the booking",
        description: "Opening WhatsApp so you can still send your request.",
        variant: "destructive",
      });
    }

    setSubmitting(false);
    window.open(buildWhatsAppLink(message, undefined, app), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Book on WhatsApp</DialogTitle>
          <DialogDescription>
            Fill your trip details — we save your booking request and open WhatsApp with it prefilled.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Your name</Label>
              <Input className="rounded-xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Phone number</Label>
              <Input
                className="rounded-xl"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Car (optional)</Label>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading cars…
              </div>
            ) : (
              <Select value={carId} onValueChange={setCarId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Not sure yet / Any car" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {cars.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label} — ₹{c.price.toLocaleString()}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Pickup date</Label>
              <Input type="date" className="rounded-xl" min={todayStr()} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Pickup time</Label>
              <Input type="time" className="rounded-xl" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Drop date</Label>
              <Input type="date" className="rounded-xl" min={pickupDate} value={dropDate} onChange={(e) => setDropDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Drop time</Label>
              <Input type="time" className="rounded-xl" value={dropTime} onChange={(e) => setDropTime(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Pickup area</Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="All over Bangalore" />
              </SelectTrigger>
              <SelectContent>
                {areaOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCar && validTrip && (
            <div className="rounded-2xl border border-border p-3 flex items-center justify-between">
              <span className="text-sm font-semibold">
                {totalDays} day{totalDays > 1 ? "s" : ""}{extraHours ? ` + ${extraHours} hr` : ""}
              </span>
              <span className="text-base font-bold">≈ ₹{estimatedPrice.toLocaleString()}</span>
            </div>
          )}

          <div className="rounded-2xl bg-muted/50 border border-border p-3 text-xs whitespace-pre-wrap text-muted-foreground max-h-32 overflow-y-auto">
            {previewMessage}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Which app should we open?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                onClick={() => send("business")}
                disabled={submitting}
                className="rounded-xl bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold"
              >
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Briefcase className="w-4 h-4 mr-2" />}
                WhatsApp Business
              </Button>
              <Button
                onClick={() => send("messenger")}
                disabled={submitting}
                variant="outline"
                className="rounded-xl font-semibold"
              >
                <Smartphone className="w-4 h-4 mr-2" /> WhatsApp Messenger
              </Button>
            </div>
            {!isAndroid() && (
              <p className="text-[11px] text-muted-foreground">
                On iPhone and desktop both options open your installed WhatsApp app.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppQuickBookModal;
