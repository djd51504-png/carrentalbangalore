import { Car, Sparkles } from "lucide-react";

/**
 * Lightweight CSS 3D rotating brand badge for "Car Rental Bangalore".
 * No external 3D libraries required — uses CSS transforms with perspective.
 */
const Brand3D = () => {
  return (
    <section className="relative py-10 md:py-14 bg-gradient-to-b from-background via-muted/40 to-background overflow-hidden">
      <div className="container">
        <div
          className="mx-auto"
          style={{ perspective: "1200px" }}
          data-aos="zoom-in"
        >
          <div className="brand3d-stage mx-auto" style={{ width: 260, height: 260, transformStyle: "preserve-3d" }}>
            <div className="brand3d-cube" style={{ transformStyle: "preserve-3d" }}>
              {/* Front */}
              <div className="brand3d-face brand3d-front">
                <Car className="w-10 h-10 mb-2 text-gold" />
                <span className="font-heading text-base font-bold leading-tight">Car Rental</span>
                <span className="font-heading text-2xl font-extrabold tracking-wide bg-gradient-to-r from-gold via-orange-400 to-gold bg-clip-text text-transparent">
                  Bengaluru
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/70">
                  <Sparkles className="w-3 h-3 text-gold" /> Nimma Trip Namma Car
                </span>
              </div>
              {/* Back */}
              <div className="brand3d-face brand3d-back">
                <span className="font-heading text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Self Drive
                </span>
                <span className="text-white/80 text-xs mt-2">Premium Cars · Transparent Pricing</span>
                <span className="text-gold font-bold mt-2 text-sm">Starting ₹2,500/day</span>
              </div>
              {/* Right */}
              <div className="brand3d-face brand3d-right">
                <span className="font-heading text-xl font-bold">Bengaluru</span>
                <span className="text-white/70 text-xs mt-1">8 Pickup Locations</span>
              </div>
              {/* Left */}
              <div className="brand3d-face brand3d-left">
                <span className="font-heading text-xl font-bold">300 km / day</span>
                <span className="text-white/70 text-xs mt-1">Generous Limit</span>
              </div>
              {/* Top */}
              <div className="brand3d-face brand3d-top">
                <span className="text-gold font-bold">★ ★ ★ ★ ★</span>
              </div>
              {/* Bottom */}
              <div className="brand3d-face brand3d-bottom">
                <span className="text-white/70 text-xs">+91 9448277091</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-muted-foreground text-xs md:text-sm mt-6" data-aos="fade-up">
          A rotating glimpse of what makes us your trusted self-drive partner.
        </p>
      </div>

      <style>{`
        .brand3d-cube {
          position: relative;
          width: 260px;
          height: 260px;
          animation: brand3d-spin 14s linear infinite;
        }
        .brand3d-face {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(135deg, hsl(var(--charcoal, 222 47% 11%)) 0%, hsl(var(--background)) 100%);
          color: hsl(var(--primary-foreground));
          box-shadow: 0 20px 60px -20px rgba(0,0,0,0.5);
          backface-visibility: hidden;
        }
        .brand3d-front  { transform: translateZ(130px); }
        .brand3d-back   { transform: rotateY(180deg) translateZ(130px); }
        .brand3d-right  { transform: rotateY(90deg) translateZ(130px); }
        .brand3d-left   { transform: rotateY(-90deg) translateZ(130px); }
        .brand3d-top    { transform: rotateX(90deg) translateZ(130px); }
        .brand3d-bottom { transform: rotateX(-90deg) translateZ(130px); }
        @keyframes brand3d-spin {
          0%   { transform: rotateX(-10deg) rotateY(0deg); }
          100% { transform: rotateX(-10deg) rotateY(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .brand3d-cube { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default Brand3D;
