import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationsSection from "@/components/LocationsSection";
import PriceCalculator from "@/components/PriceCalculator";
import FleetSection from "@/components/FleetSection";
import GoogleReviews from "@/components/GoogleReviews";
import TermsSection from "@/components/TermsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";

const Index = () => {
  const location = useLocation();

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
      <PriceCalculator />
      <FleetSection />
      <GoogleReviews />
      <TermsSection />
      <Footer />
      <WhatsAppButton />
      <CallButton />
    </div>
  );
};

export default Index;
