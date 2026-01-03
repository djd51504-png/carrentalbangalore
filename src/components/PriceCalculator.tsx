import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Search, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CarCard from "./CarCard";

// Import all car images
import swiftImg from "@/assets/cars/swift.png";
import balenoImg from "@/assets/cars/baleno.png";
import glanzaImg from "@/assets/cars/glanza.png";
import punchImg from "@/assets/cars/punch.png";
import i20Img from "@/assets/cars/i20.png";
import poloImg from "@/assets/cars/polo.png";
import brezzaImg from "@/assets/cars/brezza.png";
import fronxImg from "@/assets/cars/fronx.png";
import sonetImg from "@/assets/cars/sonet.png";
import cretaImg from "@/assets/cars/creta.png";
import seltosImg from "@/assets/cars/seltos.png";
import tharImg from "@/assets/cars/thar.png";
import tharRoxxImg from "@/assets/cars/thar-roxx.png";
import ertigaImg from "@/assets/cars/ertiga.png";
import innovaImg from "@/assets/cars/innova.png";
import xuv500Img from "@/assets/cars/xuv500.png";
import rumionImg from "@/assets/cars/rumion.png";
import innovaCrystaImg from "@/assets/cars/innova-crysta.png";
import xuv700Img from "@/assets/cars/xuv700.png";
import hycrossImg from "@/assets/cars/hycross.png";
import fortunerImg from "@/assets/cars/fortuner.png";

interface Car {
  name: string;
  price: number;
  image: string;
  categoryLabel: string;
  transmission: "Manual" | "Automatic" | "Manual & Automatic";
  fuel: "Petrol" | "Diesel";
}

const cars: Car[] = [
  { name: "Swift", price: 2500, image: swiftImg, categoryLabel: "Hatchback", transmission: "Manual & Automatic", fuel: "Petrol" },
  { name: "Baleno", price: 3000, image: balenoImg, categoryLabel: "Hatchback", transmission: "Manual & Automatic", fuel: "Petrol" },
  { name: "Glanza", price: 3000, image: glanzaImg, categoryLabel: "Hatchback", transmission: "Manual", fuel: "Petrol" },
  { name: "Punch", price: 3000, image: punchImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "i20", price: 3000, image: i20Img, categoryLabel: "Hatchback", transmission: "Manual & Automatic", fuel: "Petrol" },
  { name: "Polo", price: 3000, image: poloImg, categoryLabel: "Hatchback", transmission: "Manual", fuel: "Petrol" },
  { name: "Brezza", price: 3500, image: brezzaImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Fronx", price: 3500, image: fronxImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Sonet", price: 3500, image: sonetImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Creta", price: 4000, image: cretaImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Seltos", price: 4500, image: seltosImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Thar", price: 6500, image: tharImg, categoryLabel: "SUV", transmission: "Manual & Automatic", fuel: "Diesel" },
  { name: "Thar Roxx", price: 8000, image: tharRoxxImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Ertiga", price: 4000, image: ertigaImg, categoryLabel: "MUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Innova", price: 4000, image: innovaImg, categoryLabel: "MUV", transmission: "Manual", fuel: "Diesel" },
  { name: "XUV500", price: 4000, image: xuv500Img, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Rumion", price: 4500, image: rumionImg, categoryLabel: "MUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Innova Crysta", price: 6500, image: innovaCrystaImg, categoryLabel: "MUV", transmission: "Manual & Automatic", fuel: "Diesel" },
  { name: "XUV700", price: 6500, image: xuv700Img, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Hycross", price: 7500, image: hycrossImg, categoryLabel: "MUV", transmission: "Automatic", fuel: "Petrol" },
  { name: "Fortuner", price: 9000, image: fortunerImg, categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
];

const locations = [
  "Hebbal", "Thanisandra", "KR Puram", "Bellandur", "Haralur", 
  "Hongasandra", "Kengeri", "Nagarabhavi", "Kadugodi"
];

interface CarWithCalculatedPrice extends Car {
  totalPrice: number;
  fullDays: number;
  extraHours: number;
}

interface PriceCalculatorProps {
  pickupDate?: string;
  pickupTime?: string;
  dropDate?: string;
  dropTime?: string;
  pickupLocation?: string;
}

const PriceCalculator = ({ 
  pickupDate: initialPickupDate = "",
  pickupTime: initialPickupTime = "10:00",
  dropDate: initialDropDate = "",
  dropTime: initialDropTime = "10:00",
  pickupLocation: initialLocation = ""
}: PriceCalculatorProps) => {
  const [pickupDate, setPickupDate] = useState(initialPickupDate);
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [dropDate, setDropDate] = useState(initialDropDate);
  const [dropTime, setDropTime] = useState(initialDropTime);
  const [pickupLocation, setPickupLocation] = useState(initialLocation);
  const [showCars, setShowCars] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculation = useMemo(() => {
    if (!pickupDate || !dropDate) {
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

    const fullDays = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;

    return {
      totalHours,
      fullDays,
      extraHours,
    };
  }, [pickupDate, pickupTime, dropDate, dropTime]);

  const carsWithPrices: CarWithCalculatedPrice[] = useMemo(() => {
    if (!calculation || calculation.error) return [];
    
    return cars.map(car => {
      const hourlyRate = car.price / 24;
      const daysPrice = calculation.fullDays * car.price;
      const hoursPrice = Math.round(calculation.extraHours * hourlyRate);
      const totalPrice = daysPrice + hoursPrice;
      
      return {
        ...car,
        totalPrice,
        fullDays: calculation.fullDays,
        extraHours: calculation.extraHours,
      };
    });
  }, [calculation]);

  const generateWhatsAppMessage = (car: CarWithCalculatedPrice) => {
    const formatDate = (date: string) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const message = `Hi Vikas, I need ${car.name} from ${formatDate(pickupDate)} ${pickupTime} to ${formatDate(dropDate)} ${dropTime}.

📍 Pickup Location: ${pickupLocation || "To be decided"}
💰 Estimated Total: ₹${car.totalPrice.toLocaleString()} (${car.fullDays} days${car.extraHours > 0 ? ` + ${car.extraHours} hours` : ""})

Please confirm availability.`;
    return encodeURIComponent(message);
  };

  const handleCheckAvailability = () => {
    if (!calculation || calculation.error) return;
    
    setIsLoading(true);
    // Simulate loading for effect
    setTimeout(() => {
      setIsLoading(false);
      setShowCars(true);
    }, 800);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="calculator" className="py-16 md:py-24 bg-charcoal">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-down">
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
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="100">
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
                    onChange={(e) => { setPickupDate(e.target.value); setShowCars(false); }}
                    min={today}
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => { setPickupTime(e.target.value); setShowCars(false); }}
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
                    onChange={(e) => { setDropDate(e.target.value); setShowCars(false); }}
                    min={pickupDate || today}
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                  <Input
                    type="time"
                    value={dropTime}
                    onChange={(e) => { setDropTime(e.target.value); setShowCars(false); }}
                    className="w-28 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-electric-light" />
                  Pickup Location
                </Label>
                <Select value={pickupLocation} onValueChange={(val) => { setPickupLocation(val); setShowCars(false); }}>
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

            {/* Error Message */}
            {calculation?.error && (
              <div className="mt-6 flex items-center gap-3 text-amber-400 bg-amber-500/10 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{calculation.error}</span>
              </div>
            )}

            {/* Check Availability Button */}
            {calculation && !calculation.error && !showCars && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleCheckAvailability}
                  disabled={isLoading}
                  className="bg-gradient-button text-primary-foreground px-10 py-6 text-lg font-bold shadow-button hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Check Availability
                    </>
                  )}
                </Button>
                <p className="text-primary-foreground/50 text-sm mt-3">
                  Duration: {calculation.fullDays} days {calculation.extraHours > 0 ? `+ ${calculation.extraHours} hours` : ""}
                </p>
              </div>
            )}

            {/* Empty State */}
            {!calculation && (
              <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-primary-foreground/50">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select pickup and drop dates to check availability</p>
              </div>
            )}
          </div>
        </div>

        {/* Cars Grid */}
        {showCars && carsWithPrices.length > 0 && (
          <div className="mt-12" data-aos="fade-up">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Available Cars for Your Trip
              </h3>
              <p className="text-primary-foreground/70">
                {calculation?.fullDays} days {calculation?.extraHours && calculation.extraHours > 0 ? `+ ${calculation.extraHours} hours` : ""} • Prices calculated for your duration
              </p>
              <p className="text-gold font-semibold mt-2">
                Price is negotiable for long-term rentals. Call us for the best quote.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {carsWithPrices.map((car, index) => (
                <div 
                  key={car.name} 
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {/* Image Container */}
                  <div className="relative bg-secondary/50 p-4 md:p-6">
                    <div className="absolute top-3 right-3 bg-electric text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      300KM Limit
                    </div>
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-36 md:h-44 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-foreground">{car.name}</h3>
                        <p className="text-xs text-muted-foreground">{car.categoryLabel}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold text-xl text-primary">₹{car.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>

                    {/* Per day price */}
                    <p className="text-sm text-muted-foreground mb-3">
                      ₹{car.price}/day × {car.fullDays} days{car.extraHours > 0 ? ` + ${car.extraHours}hrs` : ""}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        car.fuel === "Diesel" 
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {car.fuel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {car.transmission}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/919448277091?text=${generateWhatsAppMessage(car)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground py-3 rounded-xl font-semibold transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PriceCalculator;
