import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, User, Phone, MapPin, Clock, Download, Home, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import confetti from "canvas-confetti";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();

  useEffect(() => {
    // Redirect if no booking ID
    if (!bookingData.bookingId) {
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#D946EF', '#F97316', '#FFD700'],
    });
  }, [bookingData, navigate]);

  const formatDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGoHome = () => {
    resetBooking();
    navigate("/");
  };

  const handleShare = () => {
    const shareText = `🚗 Booking Confirmed!\n\nBooking ID: ${bookingData.bookingId}\nPickup: ${formatDate(bookingData.pickupDate, bookingData.pickupTime)}\nDrop: ${formatDate(bookingData.dropDate, bookingData.dropTime)}\n\nCar Rental Bangalore`;
    
    if (navigator.share) {
      navigator.share({
        title: "Booking Confirmed!",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Header */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your booking. We'll contact you shortly with further details.
          </p>

          {/* Booking ID Card */}
          <div className="bg-gradient-to-r from-primary via-purple to-pink rounded-2xl p-1 mb-8">
            <div className="bg-card rounded-xl p-6">
              <span className="text-muted-foreground text-sm">Booking ID</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mt-1">
                {bookingData.bookingId}
              </h2>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8">
            <h3 className="font-semibold text-foreground mb-4 text-center">Booking Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="text-muted-foreground text-sm">Name</span>
                  <p className="font-medium text-foreground">{bookingData.customerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="text-muted-foreground text-sm">Mobile</span>
                  <p className="font-medium text-foreground">{bookingData.customerPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <span className="text-muted-foreground text-sm">Pick-up</span>
                  <p className="font-medium text-foreground">
                    {formatDate(bookingData.pickupDate, bookingData.pickupTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <span className="text-muted-foreground text-sm">Drop-off</span>
                  <p className="font-medium text-foreground">
                    {formatDate(bookingData.dropDate, bookingData.dropTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <span className="text-muted-foreground text-sm">Duration</span>
                  <p className="font-medium text-foreground">
                    {bookingData.totalDays} days {bookingData.extraHours > 0 ? `+ ${bookingData.extraHours} hours` : ""}
                  </p>
                </div>
              </div>

              {bookingData.pickupLocation && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-sm">Location</span>
                    <p className="font-medium text-foreground">{bookingData.pickupLocation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Deposit Note */}
            <div className="mt-6 p-4 bg-primary/10 rounded-xl">
              <p className="text-sm text-foreground">
                <strong>Security Deposit:</strong>{" "}
                {bookingData.depositType === "cash" 
                  ? "₹10,000 refundable deposit at pickup" 
                  : "Leave bike with original RC at hub"}
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-gold/10 to-orange/10 border border-gold/30 rounded-2xl p-5 mb-8 text-left">
            <h4 className="font-semibold text-foreground mb-3">What's Next?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Our team will contact you within 30 minutes</li>
              <li>✅ Bring valid DL + Govt ID at pickup</li>
              <li>✅ Arrive at the hub 15 mins before pickup time</li>
              <li>✅ Complete security deposit formalities</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Booking
            </Button>
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-primary via-purple to-pink text-primary-foreground flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Contact */}
          <p className="text-muted-foreground text-sm mt-8">
            Questions? Call us at{" "}
            <a href="tel:+919448277091" className="text-primary font-semibold hover:underline">
              +91 9448277091
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
