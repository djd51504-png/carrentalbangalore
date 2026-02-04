import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Search, AlertCircle, Loader2, Settings2, User, Phone, ArrowRight, Fuel, Cog, Gauge, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBooking } from "@/contexts/BookingContext";
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
  brand: string;
  price: number;
  image: string;
  categoryLabel: string;
  transmission: string;
  fuel: string;
  kmLimit: number;
  price3Days: number | null;
  price7Days: number | null;
  price15Days: number | null;
  price30Days: number | null;
}

const locations = [
  "Hebbal", "Thanisandra", "KR Puram", "Bellandur", 
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateBookingData } = useBooking();
  const [pickupDate, setPickupDate] = useState(initialPickupDate);
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [dropDate, setDropDate] = useState(initialDropDate);
  const [dropTime, setDropTime] = useState(initialDropTime);
  const [pickupLocation, setPickupLocation] = useState(initialLocation);
  const [showCars, setShowCars] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transmissionFilter, setTransmissionFilter] = useState<TransmissionFilter>("all");
  
  // Customer details for enquiry
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSelectingCar, setIsSelectingCar] = useState<string | null>(null);
  
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
          brand: car.brand,
          price: car.price,
          image: car.image || fallbackImages[car.name] || swiftImg,
          categoryLabel: car.category_label || 'Hatchback',
          transmission: car.transmission,
          fuel: car.fuel,
          kmLimit: car.km_limit,
          price3Days: car.price_3_days,
          price7Days: car.price_7_days,
          price15Days: car.price_15_days,
          price30Days: car.price_30_days,
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
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
      const days = calculation.fullDays;
      let perDayRate: number;
      
      // Tiered per-day pricing: 1-2 days, 3-7 days, 8-15 days, 16+ days
      if (days >= 16 && car.price15Days) {
        perDayRate = car.price15Days;
      } else if (days >= 8 && car.price7Days) {
        perDayRate = car.price7Days;
      } else if (days >= 3 && car.price3Days) {
        perDayRate = car.price3Days;
      } else {
        perDayRate = car.price;
      }
      
      // Calculate total: (days * per day rate) + (extra hours * hourly rate)
      const hourlyRate = perDayRate / 24;
      const daysPrice = days * perDayRate;
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

  const handleCheckAvailability = async () => {
    if (!calculation || calculation.error) return;
    
    // Validate customer details before showing cars
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "Contact Details Required",
        description: "Please enter your name and phone number to check availability.",
        variant: "destructive",
      });
      return;
    }

    if (customerPhone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send notification to admin via edge function (silent - no WhatsApp popup)
      const formatDateForNotification = (date: string, time: string) => {
        const d = new Date(`${date}T${time}`);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + time;
      };

      // Send email notification to admin about availability check
      await supabase.functions.invoke('send-availability-notification', {
        body: {
          customerName,
          customerPhone,
          pickupDate: `${pickupDate}T${pickupTime}`,
          dropDate: `${dropDate}T${dropTime}`,
          pickupLocation: pickupLocation || "Not selected",
          totalDays: calculation.fullDays,
          totalHours: calculation.extraHours,
          transmission: transmissionFilter === "all" ? "Any" : transmissionFilter,
        },
      });
    } catch (error) {
      console.error('Notification error:', error);
      // Don't block the user flow if notification fails
    }
    
    setTimeout(() => {
      setIsLoading(false);
      setShowCars(true);
    }, 500);
  };

  const handleBookCar = (car: CarWithCalculatedPrice) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "Missing Details",
        description: "Please enter your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (customerPhone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSelectingCar(car.id);

    // Store booking data in context
    updateBookingData({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      pickupLocation: pickupLocation || "",
      carId: car.id,
      carName: car.name,
      carBrand: car.brand,
      carImage: car.image,
      totalDays: car.fullDays,
      extraHours: car.extraHours,
      basePrice: car.totalPrice,
      totalAmount: car.totalPrice,
    });

    // Navigate to terms page
    navigate("/booking/terms");
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

              {/* Customer Name */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-electric-light" />
                  Your Name
                </Label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
                />
              </div>

              {/* Customer Phone */}
              <div className="space-y-2">
                <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-electric-light" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit phone number"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
                />
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

            {/* Customer Details Form */}
            <div className="max-w-2xl mx-auto mb-8 bg-primary-foreground/5 backdrop-blur-xl border border-primary-foreground/10 rounded-2xl p-4 md:p-6">
              <h4 className="text-primary-foreground font-semibold mb-4 text-center">Enter your details to book</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-electric-light" />
                    Your Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-primary-foreground font-medium flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-electric-light" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-sm"
                  />
                </div>
              </div>
              {/* Booking Confirmation Info */}
              <div className="mt-4 p-3 bg-gold/10 border border-gold/30 rounded-lg text-center">
                <p className="text-gold font-semibold text-sm">₹1000 Advance for Confirmation</p>
                <p className="text-primary-foreground/70 text-xs mt-1">Balance trip amount at pickup • ₹10,000 refundable deposit OR 2-wheeler with RC card</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {carsWithPrices.map((car, index) => (
                <div 
                  key={car.id} 
                  className="group bg-gradient-to-br from-card to-card/80 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border/50 hover:border-primary/30"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {/* Image Container */}
                  <div className="relative bg-gradient-to-br from-secondary/30 to-secondary/60 p-3 md:p-6">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-32 md:h-48 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <span className="absolute top-2 left-2 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full bg-primary/90 text-primary-foreground">
                      {car.categoryLabel}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-heading font-bold text-base md:text-xl text-foreground leading-tight">{car.name}</h3>
                      <div className="text-right flex-shrink-0">
                        <p className="font-heading font-bold text-lg md:text-2xl text-primary">₹{car.totalPrice.toLocaleString()}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {car.fullDays}d{car.extraHours > 0 ? ` + ${car.extraHours}h` : ""}
                        </p>
                      </div>
                    </div>
                    
                    {/* Features Grid */}
                    <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-2">
                      <span className={`flex flex-col items-center gap-0.5 text-[9px] md:text-xs font-semibold px-1 py-1.5 md:py-2 rounded-lg ${
                        car.fuel === "Diesel" 
                          ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300" 
                          : "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300"
                      }`}>
                        <Fuel className="w-3 h-3 md:w-4 md:h-4" />
                        {car.fuel}
                      </span>
                      <span className="flex flex-col items-center gap-0.5 text-[9px] md:text-xs font-semibold px-1 py-1.5 md:py-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300">
                        <Cog className="w-3 h-3 md:w-4 md:h-4" />
                        {car.transmission.length > 6 ? car.transmission.split(' ')[0] : car.transmission}
                      </span>
                      <span className="flex flex-col items-center gap-0.5 text-[9px] md:text-xs font-semibold px-1 py-1.5 md:py-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900 dark:from-purple-900/40 dark:to-purple-900/20 dark:text-purple-300">
                        <Gauge className="w-3 h-3 md:w-4 md:h-4" />
                        {car.fullDays * 300}km
                      </span>
                    </div>

                    {/* KM Limit Info */}
                    <p className="text-[9px] md:text-xs text-muted-foreground text-center mb-3 md:mb-4">
                      Total KM limit: {car.fullDays * 300}km • Extra: ₹10/km
                    </p>

                    {/* Book Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleBookCar(car)}
                        disabled={isSelectingCar === car.id}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary via-purple to-pink hover:from-primary/90 hover:via-purple/90 hover:to-pink/90 text-primary-foreground py-2.5 md:py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm md:text-base"
                      >
                        {isSelectingCar === car.id ? (
                          <>
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                            Book Now
                          </>
                        )}
                      </Button>

                      {/* WhatsApp Booking Option */}
                      <a
                        href={`https://wa.me/919448277091?text=${encodeURIComponent(
                          `Hi Vikas, I want to book the ${car.brand} ${car.name}.\n\n` +
                          `📅 Pickup: ${pickupDate} ${pickupTime}\n` +
                          `📅 Drop: ${dropDate} ${dropTime}\n` +
                          `📍 Location: ${pickupLocation || "To be decided"}\n\n` +
                          `👤 Name: ${customerName}\n` +
                          `📞 Phone: ${customerPhone}\n\n` +
                          `💰 Price: ₹${car.totalPrice.toLocaleString()}\n` +
                          `🛣️ KM Limit: ${car.fullDays * 300}km (₹10/extra km)\n\n` +
                          `Please confirm availability.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-white py-2.5 md:py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm md:text-base"
                      >
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        Book on WhatsApp
                      </a>
                    </div>
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
