import { ChevronDown, Shield, MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToCars = () => navigate("/cars");

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Deep noir overlays */}
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      <div className="absolute inset-0 noise-overlay opacity-40" />

      {/* Gold accent glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gold-light/10 rounded-full blur-3xl" />

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <div
            data-aos="fade-down"
            data-aos-delay="100"
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-gold" />
            <span className="text-[11px] md:text-xs text-gold font-semibold tracking-[0.3em] uppercase">
              Est. Bengaluru · Since 2019
            </span>
            <div className="h-px w-8 bg-gold" />
          </div>

          {/* Main Headline — Serif */}
          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-[0.95] tracking-tight"
          >
            Drive the{" "}
            <span className="italic text-gold-gradient">extraordinary.</span>
            <br />
            <span className="text-foreground/95">Own the road,</span>
            <br />
            <span className="italic text-foreground/80">not the car.</span>
          </h1>

          {/* Gold divider */}
          <div className="gold-divider w-32 mx-auto mb-6" />

          {/* Subheadline */}
          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-sm md:text-lg text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Bengaluru's most trusted self-drive fleet. Hand-picked cars,
            transparent pricing from{" "}
            <span className="text-gold font-semibold">₹2,500/day</span>,
            <br className="hidden sm:block" /> zero hidden charges — ever.
          </p>

          {/* CTA Buttons */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          >
            <button
              onClick={scrollToCalculator}
              className="group relative bg-gradient-button text-primary-foreground px-8 py-4 rounded-sm text-sm font-bold uppercase tracking-widest shadow-button hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 min-w-[220px]"
            >
              <span className="flex items-center justify-center gap-2">
                Check Availability
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={goToCars}
              className="group border border-gold/60 text-gold px-8 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-300 min-w-[220px]"
            >
              <span className="flex items-center justify-center gap-2">
                Explore Fleet
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Trust Row */}
          <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto pt-8 border-t border-gold/20"
          >
            <div className="text-center">
              <div className="font-heading text-2xl md:text-3xl text-gold mb-1">5000+</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/60">Happy Drivers</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl md:text-3xl text-gold mb-1 flex items-center justify-center gap-1">
                4.9<Star className="w-4 h-4 fill-gold" />
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/60">Google Rated</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl md:text-3xl text-gold mb-1">24/7</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/60">On Support</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl md:text-3xl text-gold mb-1">7+</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/60">Years Trusted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-6 h-6 text-gold/70" />
      </div>
    </section>
  );
};

export default Hero;
