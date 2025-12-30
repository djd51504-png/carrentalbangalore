import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FleetSection from "@/components/FleetSection";
import TermsSection from "@/components/TermsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FleetSection />
      <TermsSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
