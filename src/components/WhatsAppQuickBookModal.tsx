import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Loader2, Briefcase, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppLink, type WhatsAppApp, isAndroid } from "@/lib/whatsapp";

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

const WhatsAppQuickBookModal = ({ open, onOpenChange }: Props) => {
  const [cars, setCars] = useState<QuickCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [carId, setCarId] = useState<string>("");
  const [area, setArea] = useState<string>("");

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

  const message = useMemo(() => {
    const lines = ["Hi, I want to book a self drive car from Car Rental Bengaluru."];
    if (selectedCar) {
      lines.push("");
      lines.push(`🚗 Car: ${selectedCar.label}`);
      lines.push(`💰 Price: ₹${selectedCar.price.toLocaleString()}/day`);
      lines.push(`🛣️ KM Limit: ${selectedCar.kmLimit}km/day (₹${selectedCar.extraKmCharge}/extra km)`);
    }
    lines.push(`📍 Pickup Area: ${area || "All over Bangalore"}`);
    lines.push("");
    lines.push("Please confirm availability.");
    return lines.join("\n");
  }, [selectedCar, area]);

  const send = (app: WhatsAppApp) => {
    window.open(buildWhatsAppLink(message, undefined, app), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Book on WhatsApp</DialogTitle>
          <DialogDescription>
            Pick a car and your pickup area — we'll prefill the message for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
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

          <div className="rounded-2xl bg-muted/50 border border-border p-3 text-xs whitespace-pre-wrap text-muted-foreground max-h-32 overflow-y-auto">
            {message}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Which app should we open?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                onClick={() => send("business")}
                className="rounded-xl bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold"
              >
                <Briefcase className="w-4 h-4 mr-2" /> WhatsApp Business
              </Button>
              <Button
                onClick={() => send("messenger")}
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
