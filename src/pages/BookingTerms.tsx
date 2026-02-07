import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileCheck, ArrowRight, ChevronLeft, AlertTriangle, Fuel, Gauge, Ban, CreditCard, CreditCardIcon, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const termsItems = [
  {
    icon: FileCheck,
    title: "Valid Government ID Required",
    description: "A valid government-issued photo ID matching your Aadhaar is required for verification purposes.",
  },
  {
    icon: Ban,
    title: "No Smoking / No Alcohol",
    description: "Smoking and consumption of alcohol inside the vehicle is strictly prohibited. Violations will incur cleaning charges of ₹2000.",
  },
  {
    icon: Gauge,
    title: "Speed Limit: 100 km/hr",
    description: "For safety, the maximum speed limit is 100 km/hr. Any traffic violations, challans, or fines during the rental period are the customer's responsibility.",
  },
  {
    icon: Fuel,
    title: "Fuel Policy: Same-to-Same",
    description: "The vehicle will be provided with a certain fuel level. Please return it with the same fuel level to avoid additional charges.",
  },
  {
    icon: AlertTriangle,
    title: "Damage & Insurance",
    description: "Basic insurance is included. However, damages due to reckless driving, drunk driving, accidents, or negligence are the customer's full responsibility.",
  },
  {
    icon: CreditCardIcon,
    title: "Security Deposit Required",
    description: "A security deposit of ₹10,000 (fully refundable) OR leaving your 2-wheeler with original RC card is required at pickup.",
  },
];

const BookingTerms = () => {
  const navigate = useNavigate();
  const { bookingData, termsAccepted, setTermsAccepted } = useBooking();

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingData.customerName || !bookingData.pickupDate) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, [bookingData, navigate]);

  const handleProceed = () => {
    if (termsAccepted) {
      navigate("/booking/checkout");
    }
  };

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
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Step 2 of 3</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Rental Terms & Conditions
            </h1>
            <p className="text-muted-foreground">
              Please read and accept our terms before proceeding
            </p>
          </div>

          {/* Booking Summary */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Your Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 text-foreground font-medium">{bookingData.customerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2 text-foreground font-medium">{bookingData.customerPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Car:</span>
                <span className="ml-2 text-foreground font-medium">{bookingData.carBrand} {bookingData.carName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pick-up:</span>
                <span className="ml-2 text-foreground font-medium">
                  {formatDate(bookingData.pickupDate, bookingData.pickupTime)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Drop-off:</span>
                <span className="ml-2 text-foreground font-medium">
                  {formatDate(bookingData.dropDate, bookingData.dropTime)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2 text-primary font-semibold">
                  {bookingData.totalDays} days {bookingData.extraHours > 0 ? `+ ${bookingData.extraHours} hours` : ""}
                </span>
              </div>
              {bookingData.pickupLocation && (
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 text-foreground font-medium">{bookingData.pickupLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <IdCard className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Important: Documents Required at Pickup
                </h4>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                  Please carry your <strong>ORIGINAL Aadhaar Card</strong> and <strong>ORIGINAL Driving License</strong>. 
                  Without these documents, we cannot hand over the vehicle.
                </p>
              </div>
            </div>
          </div>

          {/* Terms List */}
          <div className="space-y-4 mb-8">
            {termsItems.map((item, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-4 md:p-5 flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox Agreement */}
          <div className="bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/30 rounded-2xl p-5 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <span className="text-foreground text-sm leading-relaxed">
                I have read and agree to the <strong>Terms & Conditions</strong> mentioned above. 
                I understand that I am responsible for any damages, fines, or violations during the rental period.
              </span>
            </label>
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleProceed}
            disabled={!termsAccepted}
            className="w-full bg-gradient-to-r from-primary via-purple to-pink text-primary-foreground py-6 text-lg font-bold shadow-button hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingTerms;
