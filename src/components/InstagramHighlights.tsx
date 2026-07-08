import { Instagram, CheckCircle2, Heart } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/car_rental_bengaluru?igsh=MWFwbzc4dGE4dnk3eQ==";
const FACEBOOK_URL = "https://www.facebook.com/share/1Cuc1ZLNbT/";

const HIGHLIGHTS = [
  {
    label: "Bookings Confirmed",
    href: "https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MTEzNjU3NTI0ODU1MTA5?story_media_id=3920865463764870515_14186606284&igsh=MWI3dXhzdG0zNHRzYg==",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    label: "Happy Customers",
    href: "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODg2MTU4NDQ4NDEwNzcy?story_media_id=3920864845121722045_14186606284&igsh=MXRvZjYxdndxb29udA==",
    icon: Heart,
    gradient: "from-[#EC4899] to-rose-500",
  },
];

const InstagramHighlights = () => {
  return (
    <section className="py-10 md:py-14 bg-background border-y border-border">
      <div className="container">
        <div className="text-center mb-6" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <Instagram className="w-4 h-4" />
            Follow Us On Social Media
          </div>
          <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
            Stay Connected With Car Rental Bengaluru
          </h2>
          <p className="text-muted-foreground text-xs mt-1">
            Real bookings & happy customers — straight from our Instagram
          </p>
        </div>

        {/* Instagram Highlights Tiles */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto mb-6" data-aos="fade-up">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <a
                key={h.label}
                href={h.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${h.gradient}`} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3 text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 ring-2 ring-white/40 group-hover:ring-white/80 transition-all">
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="font-heading font-bold text-sm md:text-base leading-tight">
                    {h.label}
                  </div>
                  <div className="inline-flex items-center gap-1 mt-2 text-[10px] md:text-xs opacity-90">
                    <Instagram className="w-3 h-3" />
                    View Highlight
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Follow Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4" data-aos="fade-up">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Instagram className="w-4 h-4" />
            Follow on Instagram
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Follow on Facebook
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramHighlights;
