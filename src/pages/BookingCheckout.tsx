import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, ChevronLeft, Shield, Calendar, User, Phone, MapPin, AlertCircle, Loader2, Car, Clock, Edit2, Check, X, Gauge, IndianRupee, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBooking } from "@/contexts/BookingContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookingCheckout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookingData, updateBookingData, termsAccepted } = useBooking();
  const [depositType, setDepositType] = useState<"cash" | "bike">("cash");
  const [isProcessing, setIsProcessing] = useState(false);

  // Editable fields
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [editName, setEditName] = useState(bookingData.customerName);
  const [editPhone, setEditPhone] = useState(bookingData.customerPhone);
  const [editPickupDate, setEditPickupDate] = useState(bookingData.pickupDate);
  const [editPickupTime, setEditPickupTime] = useState(bookingData.pickupTime);
  const [editDropDate, setEditDropDate] = useState(bookingData.dropDate);
  const [editDropTime, setEditDropTime] = useState(bookingData.dropTime);

  const depositAmount = depositType === "cash" ? 10000 : 0;
  const estimatedBasePrice = bookingData.basePrice || (bookingData.totalDays * 2500);
  const kmLimit = bookingData.totalDays * 300;
  const extraKmCharge = 10;

  useEffect(() => {
    if (!bookingData.customerName || !bookingData.pickupDate) {
      navigate("/");
      return;
    }
    if (!termsAccepted) {
      navigate("/booking/terms");
      return;
    }
    window.scrollTo(0, 0);

    setEditName(bookingData.customerName);
    setEditPhone(bookingData.customerPhone);
    setEditPickupDate(bookingData.pickupDate);
    setEditPickupTime(bookingData.pickupTime);
    setEditDropDate(bookingData.dropDate);
    setEditDropTime(bookingData.dropTime);
  }, [bookingData, termsAccepted, navigate]);

  const formatDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateBookingId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK${timestamp}${random}`;
  };

  const handleSaveCustomer = () => {
    if (!editName.trim() || !editPhone.trim()) {
      toast({ title: "Missing Details", description: "Please enter name and phone number.", variant: "destructive" });
      return;
    }
    if (editPhone.length < 10) {
      toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }
    updateBookingData({ customerName: editName.trim(), customerPhone: editPhone.trim() });
    setIsEditingCustomer(false);
  };

  const handleSaveTrip = () => {
    if (!editPickupDate || !editDropDate) {
      toast({ title: "Missing Dates", description: "Please select pickup and drop dates.", variant: "destructive" });
      return;
    }
    const pickup = new Date(`${editPickupDate}T${editPickupTime}`);
    const drop = new Date(`${editDropDate}T${editDropTime}`);
    const diffMs = drop.getTime() - pickup.getTime();
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (totalHours < 48) {
      toast({ title: "Minimum 2 Days", description: "Minimum rental period is 2 days (48 hours).", variant: "destructive" });
      return;
    }
    const fullDays = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;
    updateBookingData({
      pickupDate: editPickupDate, pickupTime: editPickupTime,
      dropDate: editDropDate, dropTime: editDropTime,
      totalDays: fullDays, extraHours: extraHours,
    });
    setIsEditingTrip(false);
  };

  const handleConfirmOnWhatsApp = async () => {
    setIsProcessing(true);
    const bookingId = generateBookingId();

    try {
      // Save enquiry to database
      const { error: insertError } = await supabase.from('booking_enquiries').insert({
        customer_name: bookingData.customerName,
        customer_phone: bookingData.customerPhone,
        pickup_date: `${bookingData.pickupDate}T${bookingData.pickupTime}:00`,
        drop_date: `${bookingData.dropDate}T${bookingData.dropTime}:00`,
        pickup_location: bookingData.pickupLocation || null,
        car_name: `${bookingData.carBrand} ${bookingData.carName}`.trim(),
        total_days: bookingData.totalDays,
        total_hours: bookingData.extraHours,
        estimated_price: Math.round(estimatedBasePrice),
        status: 'Pending',
        booking_id: bookingId,
        deposit_type: depositType,
      });

      if (insertError) {
        console.error('Error saving enquiry:', insertError);
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-availability-notification', {
          body: {
            customerName: bookingData.customerName,
            customerPhone: bookingData.customerPhone,
            pickupDate: `${bookingData.pickupDate}T${bookingData.pickupTime}`,
            dropDate: `${bookingData.dropDate}T${bookingData.dropTime}`,
            pickupLocation: bookingData.pickupLocation || "Not selected",
            totalDays: bookingData.totalDays,
            totalHours: bookingData.extraHours,
            carName: `${bookingData.carBrand} ${bookingData.carName}`,
            estimatedPrice: estimatedBasePrice,
            bookingId,
          },
        });
      } catch (emailErr) {
        console.error('Email notification error:', emailErr);
      }
    } catch (err) {
      console.error('Error saving enquiry:', err);
    }

    // Update booking context and navigate to confirmation
    updateBookingData({
      depositType,
      depositAmount,
      totalAmount: estimatedBasePrice,
      bookingId,
    });

    setIsProcessing(false);
    navigate("/booking/confirmation");
  };

  const today = new Date().toISOString().split("T")[0];

  // WhatsApp message
  const whatsappMessage = `Hi Vikas, I want to book a car from Key2Go.

🚗 Car: ${bookingData.carBrand} ${bookingData.carName}
💰 Estimated Price: ₹${estimatedBasePrice.toLocaleString()} (${bookingData.totalDays} days)
🛣️ KM Limit: ${kmLimit}km (₹${extraKmCharge}/extra km)

📅 Pickup: ${formatDateShort(bookingData.pickupDate, bookingData.pickupTime)}
📅 Drop: ${formatDateShort(bookingData.dropDate, bookingData.dropTime)}
📍 Location: ${bookingData.pickupLocation || "To be decided"}

👤 Name: ${bookingData.customerName}
📞 Phone: ${bookingData.customerPhone}

🔒 Deposit: ${depositType === "cash" ? "₹10,000 Refundable" : "Bike with RC"}

Please confirm availability and exact pickup location.`;

  const whatsappLink = `https://wa.me/919448277091?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Terms
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Step 3 of 4</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Review & Confirm Booking
            </h1>
            <p className="text-muted-foreground">
              Review your booking details and confirm on WhatsApp
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Booking Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Details */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Selected Car
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {bookingData.carImage && (
                    <img 
                      src={bookingData.carImage} 
                      alt={bookingData.carName}
                      className="w-full sm:w-40 h-28 object-contain bg-secondary/30 rounded-xl"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-xl text-foreground">
                      {bookingData.carBrand} {bookingData.carName}
                    </h4>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Gauge className="w-4 h-4 text-primary" />
                        {kmLimit}km total limit
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-amber-500" />
                        ₹{extraKmCharge}/extra km
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-bold text-primary">
                      ₹{estimatedBasePrice.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">for {bookingData.totalDays} days</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Customer Details
                  </h3>
                  {!isEditingCustomer && (
                    <button onClick={() => setIsEditingCustomer(true)} className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  )}
                </div>
                
                {isEditingCustomer ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Full Name</Label>
                        <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Mobile Number</Label>
                        <Input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveCustomer} className="gap-1"><Check className="w-4 h-4" /> Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsEditingCustomer(false); setEditName(bookingData.customerName); setEditPhone(bookingData.customerPhone); }} className="gap-1"><X className="w-4 h-4" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground text-sm">Full Name</span>
                      <p className="font-medium text-foreground">{bookingData.customerName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Mobile Number</span>
                      <p className="font-medium text-foreground">{bookingData.customerPhone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Trip Details */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Trip Details
                  </h3>
                  {!isEditingTrip && (
                    <button onClick={() => setIsEditingTrip(true)} className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  )}
                </div>
                
                {isEditingTrip ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Pickup Date & Time</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="date" value={editPickupDate} onChange={(e) => setEditPickupDate(e.target.value)} min={today} className="flex-1" />
                          <Input type="time" value={editPickupTime} onChange={(e) => setEditPickupTime(e.target.value)} className="w-24" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Drop Date & Time</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="date" value={editDropDate} onChange={(e) => setEditDropDate(e.target.value)} min={editPickupDate || today} className="flex-1" />
                          <Input type="time" value={editDropTime} onChange={(e) => setEditDropTime(e.target.value)} className="w-24" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveTrip} className="gap-1"><Check className="w-4 h-4" /> Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsEditingTrip(false); setEditPickupDate(bookingData.pickupDate); setEditPickupTime(bookingData.pickupTime); setEditDropDate(bookingData.dropDate); setEditDropTime(bookingData.dropTime); }} className="gap-1"><X className="w-4 h-4" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground text-sm">Pick-up</span>
                      <p className="font-medium text-foreground">{formatDate(bookingData.pickupDate, bookingData.pickupTime)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Drop-off</span>
                      <p className="font-medium text-foreground">{formatDate(bookingData.dropDate, bookingData.dropTime)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Duration</span>
                      <p className="font-semibold text-primary">{bookingData.totalDays} days {bookingData.extraHours > 0 ? `+ ${bookingData.extraHours} hours` : ""}</p>
                    </div>
                    {bookingData.pickupLocation && (
                      <div>
                        <span className="text-muted-foreground text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
                        <p className="font-medium text-foreground">{bookingData.pickupLocation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Security Deposit Selection */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Deposit Option
                </h3>
                
                <RadioGroup 
                  value={depositType} 
                  onValueChange={(val) => setDepositType(val as "cash" | "bike")}
                  className="space-y-3"
                >
                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${depositType === "cash" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value="cash" id="cash" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cash" className="font-semibold text-foreground cursor-pointer">Pay ₹10,000 Refundable Deposit</Label>
                        <span className="text-primary font-bold">₹10,000</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">Cash or UPI at pickup. Fully refundable upon vehicle return.</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${depositType === "bike" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value="bike" id="bike" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bike" className="font-semibold text-foreground cursor-pointer flex items-center gap-2">
                          <Bike className="w-4 h-4" /> Leave Bike with Original RC
                        </Label>
                        <span className="text-green-500 font-bold">₹0</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">Leave your 2-wheeler with original RC card at our hub.</p>
                      <div className="flex items-center gap-2 mt-2 text-amber-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Physical verification required at hub
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>

            {/* Right: Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-charcoal to-charcoal/90 border border-primary/20 rounded-2xl p-5 sticky top-24">
                <h3 className="font-semibold text-primary-foreground mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-primary-foreground/70">
                    <span>Car</span>
                    <span className="text-right">{bookingData.carBrand} {bookingData.carName}</span>
                  </div>
                  <div className="flex justify-between text-primary-foreground/70">
                    <span>Estimated Trip Cost</span>
                    <span>₹{estimatedBasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-primary-foreground/70">
                    <span>Duration</span>
                    <span>{bookingData.totalDays} days{bookingData.extraHours > 0 ? ` + ${bookingData.extraHours}h` : ""}</span>
                  </div>
                  <div className="flex justify-between text-primary-foreground/70">
                    <span>KM Limit</span>
                    <span>{kmLimit}km</span>
                  </div>
                  <div className="flex justify-between text-primary-foreground/70">
                    <span>Security Deposit</span>
                    <span>{depositType === "cash" ? "₹10,000" : "Bike + RC"}</span>
                  </div>
                  
                  <div className="border-t border-primary-foreground/10 pt-3 mt-3">
                    <div className="bg-gold/10 border border-gold/30 rounded-lg p-3">
                      <p className="text-gold font-semibold text-sm text-center">
                        Full trip amount payable at pickup
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirm on WhatsApp - Primary CTA */}
                <Button
                  onClick={handleConfirmOnWhatsApp}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-whatsapp hover:bg-whatsapp/90 text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Confirm on WhatsApp
                    </>
                  )}
                </Button>

                <p className="text-primary-foreground/50 text-xs text-center mt-4">
                  Your booking details will be sent via WhatsApp for confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingCheckout;