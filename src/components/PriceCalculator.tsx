import { useState, useMemo } from "react";
import { Calendar, Clock, Car, Calculator, Phone, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Car categories with base prices
const carCategories = [
  { id: "hatchback", name: "Hatchback", basePrice: 2500, examples: "Swift, Baleno, i20" },
  { id: "sedan", name: "Sedan", basePrice: 3000, examples: "Glanza, Punch" },
  { id: "compact-suv", name: "Compact SUV", basePrice: 3500, examples: "Brezza, Fronx, Sonet" },
  { id: "suv", name: "SUV", basePrice: 4500, examples: "Creta, Seltos, Thar" },
  { id: "mpv", name: "MPV", basePrice: 5000, examples: "Ertiga, Rumion, Innova" },
  { id: "premium-suv", name: "Premium SUV", basePrice: 7500, examples: "XUV700, Fortuner, Hycross" },
];

const locations = [
  "Hebbal", "Thanisandra", "KR Puram", "Bellandur", "Haralur", 
  "Hongasandra", "Kengeri", "Nagarabhavi", "Kadugodi"
];

const PriceCalculator = () => {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("10:00");
  const [carCategory, setCarCategory] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  const calculation = useMemo(() => {
    if (!pickupDate || !dropDate || !carCategory) {
      return null;
    }

    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const drop = new Date(`${dropDate}T${dropTime}`);
    const diffMs = drop.getTime() - pickup.getTime();
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Minimum 48 hours (2 days)
    if (totalHours < 48) {
      return { error: "Minimum rental period is 2 days (48 hours). Please adjust your dates." };
    }

    const selectedCar = carCategories.find(c => c.id === carCategory);
    if (!selectedCar) return null;

    const fullDays = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;
    const hourlyRate = selectedCar.basePrice / 24;

    const daysPrice = fullDays * selectedCar.basePrice;
    const hoursPrice = Math.round(extraHours * hourlyRate);
    const totalPrice = daysPrice + hoursPrice;

    return {
      totalHours,
      fullDays,
      extraHours,
      daysPrice,
      hoursPrice,
      totalPrice,
      dailyRate: selectedCar.basePrice,
      carName: selectedCar.name,
    };
  }, [pickupDate, pickupTime, dropDate, dropTime, carCategory]);

  const generateWhatsAppMessage = () => {
    if (!calculation || calculation.error) return "";
    const selectedCar = carCategories.find(c => c.id === carCategory);
    const message = `Hi Vikas, I want to book a ${selectedCar?.name} from Key2Go.

📅 Pickup: ${pickupDate} at ${pickupTime}
📅 Drop: ${dropDate} at ${dropTime}
📍 Location: ${pickupLocation || "To be decided"}
💰 Estimated: ₹${calculation.totalPrice.toLocaleString()}

Please confirm availability.`;
    return encodeURIComponent(message);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="calculator" className="py-16 md:py-24 bg-charcoal">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-electric-light uppercase tracking-wider mb-3">
            Transparent Pricing
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Check Availability & Price
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Calculate your rental cost instantly. No hidden charges. Pro-rata pricing for extra hours.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary-foreground/5 backdrop-blur-xl border border-primary-foreground/10 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Date & Time */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-electric-light" />
                  Pickup Date & Time
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={today}
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-28 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                </div>
              </div>

              {/* Drop Date & Time */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-electric-light" />
                  Drop Date & Time
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dropDate}
                    onChange={(e) => setDropDate(e.target.value)}
                    min={pickupDate || today}
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                  <Input
                    type="time"
                    value={dropTime}
                    onChange={(e) => setDropTime(e.target.value)}
                    className="w-28 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                </div>
              </div>

              {/* Car Category */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2">
                  <Car className="w-4 h-4 text-electric-light" />
                  Car Category
                </Label>
                <Select value={carCategory} onValueChange={setCarCategory}>
                  <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {carCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          (₹{cat.basePrice}/day) - {cat.examples}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-electric-light" />
                  Pickup Location
                </Label>
                <Select value={pickupLocation} onValueChange={setPickupLocation}>
                  <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Result */}
            {calculation && (
              <div className="mt-8 pt-6 border-t border-primary-foreground/10">
                {calculation.error ? (
                  <div className="flex items-center gap-3 text-amber-400 bg-amber-500/10 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{calculation.error}</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Price Breakdown */}
                    <div className="bg-primary-foreground/5 rounded-xl p-5">
                      <h4 className="font-heading font-semibold text-primary-foreground mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-electric-light" />
                        Price Breakdown - {calculation.carName}
                      </h4>
                      <div className="space-y-2 text-primary-foreground/80">
                        <div className="flex justify-between">
                          <span>{calculation.fullDays} Days × ₹{calculation.dailyRate}</span>
                          <span>₹{calculation.daysPrice.toLocaleString()}</span>
                        </div>
                        {calculation.extraHours > 0 && (
                          <div className="flex justify-between">
                            <span>{calculation.extraHours} Hours (pro-rata)</span>
                            <span>₹{calculation.hoursPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-3 border-t border-primary-foreground/10 text-lg font-bold text-primary-foreground">
                          <span>Total Estimated</span>
                          <span className="text-electric-light">₹{calculation.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-primary-foreground/50 mt-3">
                        * 300km/day included. Extra km charged at ₹8-12/km depending on car.
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`https://wa.me/919448277091?text=${generateWhatsAppMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground py-6 text-lg font-semibold">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Book on WhatsApp
                        </Button>
                      </a>
                      <a href="tel:+919448277091" className="flex-1">
                        <Button variant="outline" className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 py-6 text-lg font-semibold">
                          <Phone className="w-5 h-5 mr-2" />
                          Request a Quote
                        </Button>
                      </a>
                    </div>

                    <p className="text-center text-sm text-primary-foreground/60">
                      💡 Price is negotiable for longer rentals. Call us for VIP rates!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!calculation && (
              <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-primary-foreground/50">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select dates and car category to see pricing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;