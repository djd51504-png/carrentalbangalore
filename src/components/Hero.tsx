import { useState } from "react";
import { ChevronDown, Star, ArrowRight, Shield, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [videoFailed, setVideoFailed] = useState(false);
  const scrollToCalculator = () =>
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  const goToCars = () => navigate("/cars");

  return (
    <section className="relative min-h-[92vh] flex items-center pt-20 overflow-hidden bg-charcoal">
      {/* Video Background (with poster + image fallback) */}
      {videoFailed ? (
        <img
          src="/hero-poster.jpg"
          alt="Self drive rental car on a Bengaluru street at sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.jpg"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
        </video>
      )}

      {/* Overlays for readability */}
      <div className="absolute inset-0 bg-charcoal/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/25 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-[380px] h-[380px] rounded-full bg-gold/20 blur-[130px] pointer-events-none" />

      <div className="container relative z-10 py-10 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 mb-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-white">
              4.9 Rated · 5000+ Happy Drivers
            </span>
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-[1.05] tracking-tight"
          >
            Self Drive Cars in{" "}
            <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
              Bengaluru
            </span>
            <br />
            <span className="text-white/90 text-2xl sm:text-3xl md:text-4xl font-bold">
              from ₹2,500/day
            </span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-sm md:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Hand-picked fleet · 300km/day free · Zero hidden charges · Doorstep delivery all over Bengaluru
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <button
              onClick={scrollToCalculator}
              className="group w-full sm:w-auto bg-gradient-button text-primary-foreground px-9 py-4 rounded-2xl text-sm font-bold shadow-button ring-1 ring-white/20 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Check Availability
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={goToCars}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-white hover:text-charcoal transition-all duration-300"
            >
              Explore Fleet
            </button>
          </div>

          {/* Trust Row */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            {[
              { icon: Shield, label: "Fully Insured", sub: "Every Trip" },
              { icon: Clock, label: "24/7 Support", sub: "Always On" },
              { icon: MapPin, label: "All Bengaluru", sub: "Pickup & Drop" },
              { icon: Star, label: "4.9 / 5", sub: "5000+ Drivers" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl px-3 py-3.5 text-center hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <item.icon className="w-5 h-5 mx-auto mb-1 text-primary-glow" />
                <div className="text-sm font-bold text-white">{item.label}</div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-6 h-6 text-white/70" />
      </div>
    </section>
  );
};

export default Hero;
