import { useState } from "react";
import { ChevronDown, Shield, MapPin, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingModal from "./BookingModal";

const Hero = () => {
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const goToCars = () => {
    navigate("/cars");
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Lighter Overlay for better video visibility */}
        <div className="absolute inset-0 bg-charcoal/40" />
        
        {/* Gradient Overlay for depth - lighter */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/20" />

        <div className="container relative z-10 py-12 md:py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium Badge */}
            <div data-aos="fade-down" data-aos-delay="100" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-purple/20 border border-primary/40 backdrop-blur-md rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-semibold tracking-wide uppercase">Premium Self-Drive Rentals</span>
            </div>

            {/* Main Headline */}
            <h1 data-aos="fade-up" data-aos-delay="200" className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-purple to-pink bg-clip-text text-transparent">Luxury on Demand.</span>
              <br />
              <span className="text-primary-foreground">Keys to Bangalore's</span>
              <br />
              <span className="bg-gradient-to-r from-gold via-orange to-gold-light bg-clip-text text-transparent">Finest Cars.</span>
            </h1>

            {/* Subheadline */}
            <p data-aos="fade-up" data-aos-delay="300" className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Experience freedom with our premium self-drive cars. Starting at{" "}
              <span className="text-gold font-bold">₹2500/day</span> with{" "}
              <span className="text-gold font-semibold">300km included</span>. 
              <br className="hidden sm:block" />
              Transparent pricing. No hidden charges.
            </p>

            {/* CTA Buttons */}
            <div data-aos="fade-up" data-aos-delay="400" className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowBookingModal(true)}
                className="group bg-gradient-to-r from-primary via-purple to-pink text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold shadow-button hover:scale-105 transition-all duration-300"
              >
                Check Availability
                <ChevronDown className="inline-block ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
              <button
                onClick={goToCars}
                className="group bg-gradient-to-r from-gold/20 to-orange/20 backdrop-blur-md border-2 border-gold text-gold px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gold hover:text-charcoal transition-all duration-300"
              >
                Explore Our Cars
              </button>
            </div>

            {/* Trust Badges */}
            <div data-aos="fade-up" data-aos-delay="500" className="flex flex-wrap justify-center gap-4 md:gap-8 mt-14">
              <div className="flex items-center gap-2.5 text-primary-foreground/90 backdrop-blur-md bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/30 px-4 py-2.5 rounded-full">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2.5 text-primary-foreground/90 backdrop-blur-md bg-gradient-to-r from-gold/10 to-orange/10 border border-gold/30 px-4 py-2.5 rounded-full">
                <Clock className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <button
                onClick={() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2.5 text-primary-foreground/90 backdrop-blur-md bg-gradient-to-r from-whatsapp/10 to-cyan/10 border border-whatsapp/30 px-4 py-2.5 rounded-full hover:bg-whatsapp/20 transition-colors cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-whatsapp" />
                <span className="text-sm font-medium">Many Locations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown className="w-8 h-8 text-gold opacity-80" />
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />
    </>
  );
};

export default Hero;