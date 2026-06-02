import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MessageCircle, Phone, Mail, FileText } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationsSection from "@/components/LocationsSection";
import PriceCalculator from "@/components/PriceCalculator";
import FleetSection from "@/components/FleetSection";
import GoogleReviews from "@/components/GoogleReviews";
import InstagramHighlights from "@/components/InstagramHighlights";
import TermsSection from "@/components/TermsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";

const Index = () => {
  const location = useLocation();
  const [resultsShowing, setResultsShowing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('scroll') === 'calculator') {
      setTimeout(() => {
        document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LocationsSection />
      <PriceCalculator onResultsToggle={setResultsShowing} />
      {resultsShowing ? (
        <section className="py-10 md:py-14 bg-muted/30">
          <div className="container max-w-3xl">
            <div className="text-center mb-6">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
                Next Steps
              </h2>
              <p className="text-muted-foreground text-sm">
                Review our terms or reach out to confirm your booking.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <a
                href="https://wa.me/919448277091"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-whatsapp text-white py-3 px-4 rounded-xl font-semibold text-sm shadow hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="tel:+919448277091"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-xl font-semibold text-sm shadow hover:shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" /> Call Us
              </a>
              <a
                href="mailto:selfdrivecars2500@gmail.com"
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 px-4 rounded-xl font-semibold text-sm shadow hover:shadow-lg transition-all"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
            <div className="mt-5 text-center">
              <Link
                to="/terms"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
              >
                <FileText className="w-4 h-4" /> Read Full Terms & Conditions
              </Link>
            </div>
          </div>
          <TermsSection />
        </section>
      ) : (
        <FleetSection />
      )}
      <InstagramHighlights />
      <GoogleReviews />
      {!resultsShowing && <TermsSection />}
      <Footer />
      <WhatsAppButton />
      <CallButton />
    </div>
  );
};

export default Index;
