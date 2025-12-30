import { ChevronDown, Shield, MapPin, Clock } from "lucide-react";

const Hero = () => {
  const scrollToFleet = () => {
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-hero flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-electric-light rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-electric/20 border border-electric/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <MapPin className="w-4 h-4 text-electric-light" />
            <span className="text-sm text-electric-light font-medium">Serving All of Bengaluru</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Your Journey,{" "}
            <span className="text-gradient">Your Drive.</span>
            <br />
            <span className="text-electric-light">Key2Go.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Premium self-drive cars in Bangalore starting at{" "}
            <span className="text-electric-light font-bold">₹2500/day</span>.{" "}
            <span className="text-electric-light font-semibold">300km limit</span>. No hidden charges.
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToFleet}
            className="group bg-gradient-button text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold shadow-button hover:scale-105 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Explore Fleet
            <ChevronDown className="inline-block ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Shield className="w-5 h-5 text-electric-light" />
              <span className="text-sm font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Clock className="w-5 h-5 text-electric-light" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <MapPin className="w-5 h-5 text-electric-light" />
              <span className="text-sm font-medium">Pickup & Drop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-8 h-8 text-electric-light opacity-60" />
      </div>
    </section>
  );
};

export default Hero;
