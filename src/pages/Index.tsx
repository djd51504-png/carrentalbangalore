import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationsSection from "@/components/LocationsSection";
import PriceCalculator from "@/components/PriceCalculator";
import SocialProofMap from "@/components/SocialProofMap";
import FleetSection from "@/components/FleetSection";
import GoogleReviews from "@/components/GoogleReviews";
import TermsSection from "@/components/TermsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LocationsSection />
      <PriceCalculator />
      <SocialProofMap />
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