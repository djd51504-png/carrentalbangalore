import { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, MapPin, Search, MessageCircle, AlertCircle, Loader2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Import fallback car images
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

// Fallback image mapping
const fallbackImages: Record<string, string> = {
  "Swift": swiftImg,
  "Baleno": balenoImg,
  "Glanza": glanzaImg,
  "Punch": punchImg,
  "i20": i20Img,
  "Polo": poloImg,
  "Brezza": brezzaImg,
  "Fronx": fronxImg,
  "Sonet": sonetImg,
  "Creta": cretaImg,
  "Seltos": seltosImg,
  "Thar": tharImg,
  "Thar Roxx": tharRoxxImg,
  "Ertiga": ertigaImg,
  "Innova": innovaImg,
  "XUV500": xuv500Img,
  "Rumion": rumionImg,
  "Innova Crysta": innovaCrystaImg,
  "XUV700": xuv700Img,
  "Hycross": hycrossImg,
  "Fortuner": fortunerImg,
};

interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryLabel: string;
  transmission: string;
  fuel: string;
  kmLimit: number;
}

const locations = [
  "Hebbal", "Thanisandra", "KR Puram", "Bellandur", "Haralur", 
  "Hongasandra", "Kengeri", "Nagarabhavi", "Kadugodi"
];

type TransmissionFilter = "all" | "Manual" | "Automatic";

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
  const [transmissionFilter, setTransmissionFilter] = useState<TransmissionFilter>("all");
  
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  // Fetch cars from database
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('price', { ascending: true });
        
        if (error) throw error;
        
        setCars(data.map(car => ({
          id: car.id,
          name: car.name,
          price: car.price,
          image: car.image || fallbackImages[car.name] || swiftImg,
          categoryLabel: car.category_label || 'Hatchback',
          transmission: car.transmission,
          fuel: car.fuel,
          kmLimit: car.km_limit,
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
        // Use empty array on error - will show no cars available
      } finally {
        setIsLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

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
    
    let filteredCars = cars;
    
    // Filter by transmission
    if (transmissionFilter !== "all") {
      filteredCars = cars.filter(car => 
        car.transmission === transmissionFilter || car.transmission === "Manual & Automatic"
      );
    }
    
    return filteredCars.map(car => {
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
  }, [calculation, transmissionFilter, cars]);

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
    <section id="calculator" className="py-12 md:py-24 bg-charcoal">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12" data-aos="fade-down">
          <span className="inline-block text-xs md:text-sm font-semibold text-electric-light uppercase tracking-wider mb-2 md:mb-3">
            Transparent Pricing
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground mb-3 md:mb-4">
            Check Availability & Price
          </h2>
          <p className="text-primary-foreground/70 text-sm md:text-base max-w-2xl mx-auto">
            Calculate your rental cost instantly. No hidden charges.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-primary-foreground/5 backdrop-blur-xl border border-primary-foreground/10 rounded-2xl p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Pickup Date & Time */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-electric-light" />
                  Pickup Date & Time
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => { setPickupDate(e.target.value); setShowCars(false); }}
                    min={today}
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm"
                  />
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => { setPickupTime(e.target.value); setShowCars(false); }}
                    className="w-24 md:w-28 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm"
                  />
                </div>
              </div>

              {/* Drop Date & Time */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-electric-light" />
                  Drop Date & Time
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dropDate}
                    onChange={(e) => { setDropDate(e.target.value); setShowCars(false); }}
                    min={pickupDate || today}
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm"
                  />
                  <Input
                    type="time"
                    value={dropTime}
                    onChange={(e) => { setDropTime(e.target.value); setShowCars(false); }}
                    className="w-24 md:w-28 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-electric-light" />
                  Pickup Location
                </Label>
                <Select value={pickupLocation} onValueChange={(val) => { setPickupLocation(val); setShowCars(false); }}>
                  <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm">
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

              {/* Transmission Preference */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                  <Settings2 className="w-4 h-4 text-electric-light" />
                  Transmission Preferred
                </Label>
                <div className="flex gap-2">
                  {(["all", "Manual", "Automatic"] as TransmissionFilter[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTransmissionFilter(type)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                        transmissionFilter === type
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20"
                      }`}
                    >
                      {type === "all" ? "All" : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {calculation?.error && (
              <div className="mt-4 md:mt-6 flex items-center gap-3 text-amber-400 bg-amber-500/10 rounded-xl p-3 md:p-4 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{calculation.error}</span>
              </div>
            )}

            {/* Check Availability Button */}
            {calculation && !calculation.error && !showCars && (
              <div className="mt-6 md:mt-8 text-center">
                <Button
                  onClick={handleCheckAvailability}
                  disabled={isLoading || isLoadingCars}
                  className="w-full md:w-auto bg-gradient-button text-primary-foreground px-8 md:px-10 py-5 md:py-6 text-base md:text-lg font-bold shadow-button hover:scale-105 transition-all duration-300"
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
                <p className="text-primary-foreground/50 text-xs md:text-sm mt-3">
                  Duration: {calculation.fullDays} days {calculation.extraHours > 0 ? `+ ${calculation.extraHours} hours` : ""}
                </p>
              </div>
            )}

            {/* Empty State */}
            {!calculation && (
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-primary-foreground/10 text-center text-primary-foreground/50">
                <Calendar className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select pickup and drop dates to check availability</p>
              </div>
            )}
          </div>
        </div>

        {/* Cars Grid */}
        {showCars && carsWithPrices.length > 0 && (
          <div className="mt-8 md:mt-12" data-aos="fade-up">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="font-heading text-xl md:text-3xl font-bold text-primary-foreground mb-2">
                Available Cars for Your Trip
              </h3>
              <p className="text-primary-foreground/70 text-sm md:text-base">
                {calculation?.fullDays} days {calculation?.extraHours && calculation.extraHours > 0 ? `+ ${calculation.extraHours} hours` : ""} • {carsWithPrices.length} cars found
              </p>
              <p className="text-gold font-semibold mt-2 text-sm md:text-base">
                Price is negotiable for long-term rentals. Call us for the best quote.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {carsWithPrices.map((car, index) => (
                <div 
                  key={car.id} 
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 border border-border"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {/* Image Container */}
                  <div className="relative bg-secondary/50 p-3 md:p-6">
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-electric text-primary-foreground text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full">
                      {car.kmLimit}KM Limit
                    </div>
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-28 md:h-44 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-heading font-bold text-base md:text-lg text-foreground">{car.name}</h3>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{car.categoryLabel}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold text-lg md:text-xl text-primary">₹{car.totalPrice.toLocaleString()}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {car.fullDays}d{car.extraHours > 0 ? ` + ${car.extraHours}h` : ""}
                        </p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                      <span className="text-[10px] md:text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {car.fuel}
                      </span>
                      <span className="text-[10px] md:text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {car.transmission}
                      </span>
                    </div>

                    {/* Book Now Button */}
                    <a
                      href={`https://wa.me/919448277091?text=${generateWhatsAppMessage(car)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground py-2.5 md:py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] text-sm md:text-base"
                    >
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No cars found */}
        {showCars && carsWithPrices.length === 0 && (
          <div className="mt-8 md:mt-12 text-center" data-aos="fade-up">
            <div className="bg-card rounded-2xl p-8 md:p-12 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                No Cars Available
              </h3>
              <p className="text-muted-foreground text-sm">
                No cars match your transmission preference. Try selecting "All" to see all available cars.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PriceCalculator;
