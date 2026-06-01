import { Instagram, Car, Heart, Calendar, MapPin, Star, Award } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/car._.rental._.bengaluru?igsh=MTFpZXBjdGE0am5tbg==";

const highlights = [
  { label: "Bookings", icon: Calendar, gradient: "from-pink-500 via-red-500 to-yellow-500" },
  { label: "Happy Customers", icon: Heart, gradient: "from-purple-500 via-pink-500 to-orange-400" },
  { label: "Our Fleet", icon: Car, gradient: "from-blue-500 via-purple-500 to-pink-500" },
  { label: "Reviews", icon: Star, gradient: "from-yellow-400 via-orange-500 to-red-500" },
  { label: "Trips", icon: MapPin, gradient: "from-green-400 via-teal-500 to-blue-500" },
  { label: "Awards", icon: Award, gradient: "from-amber-400 via-orange-500 to-pink-500" },
];

const InstagramHighlights = () => {
  return (
    <section className="py-12 md:py-16 bg-background border-y border-border">
      <div className="container">
        <div className="text-center mb-8" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            <Instagram className="w-4 h-4" />
            Follow Us On Instagram
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            @car._.rental._.bengaluru
          </h2>
          <p className="text-muted-foreground text-sm">
            Tap a highlight to view our stories
          </p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-6 md:gap-8">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <a
                key={h.label}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 w-20 md:w-24"
                data-aos="zoom-in"
                data-aos-delay={i * 80}
              >
                <div className={`p-[3px] rounded-full bg-gradient-to-tr ${h.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="bg-background p-[2px] rounded-full">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-foreground" />
                    </div>
                  </div>
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground text-center truncate w-full">
                  {h.label}
                </span>
              </a>
            );
          })}
        </div>

        <div className="text-center mt-8" data-aos="fade-up">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Instagram className="w-5 h-5" />
            Follow @car._.rental._.bengaluru
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramHighlights;
