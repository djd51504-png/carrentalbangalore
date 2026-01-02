import { ChevronDown, Shield, MapPin, Clock, Sparkles } from "lucide-react";

const Hero = () => {
  const scrollToFleet = () => {
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-[2px]" />
      
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-electric-light" />
            <span className="text-sm text-electric-light font-semibold tracking-wide uppercase">Premium Self-Drive Rentals</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Luxury on Demand.
            <br />
            <span className="text-gradient">Keys to Bangalore's</span>
            <br />
            <span className="text-electric-light">Finest Fleet.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Experience freedom with our premium self-drive cars. Starting at{" "}
            <span className="text-electric-light font-bold">₹2500/day</span> with{" "}
            <span className="text-electric-light font-semibold">300km included</span>. 
            <br className="hidden sm:block" />
            Transparent pricing. No hidden charges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={scrollToCalculator}
              className="group bg-gradient-button text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold shadow-button hover:scale-105 transition-all duration-300"
            >
              Check Availability
              <ChevronDown className="inline-block ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
            <button
              onClick={scrollToFleet}
              className="group bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-foreground/20 transition-all duration-300"
            >
              Explore Fleet
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2.5 text-primary-foreground/80 backdrop-blur-md bg-primary-foreground/5 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-electric-light" />
              <span className="text-sm font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2.5 text-primary-foreground/80 backdrop-blur-md bg-primary-foreground/5 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-electric-light" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2.5 text-primary-foreground/80 backdrop-blur-md bg-primary-foreground/5 px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5 text-electric-light" />
              <span className="text-sm font-medium">9 Locations</span>
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