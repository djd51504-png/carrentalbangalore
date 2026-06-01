import { useState } from "react";
import { Instagram, Car, Heart, Calendar, MapPin, Star, Award, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const INSTAGRAM_URL = "https://www.instagram.com/car._.rental._.bengaluru?igsh=MTFpZXBjdGE0am5tbg==";

const highlights = [
  { label: "Bookings", icon: Calendar, gradient: "from-pink-500 via-red-500 to-yellow-500", description: "Latest bookings and confirmed trips by our happy renters across Bangalore." },
  { label: "Happy Customers", icon: Heart, gradient: "from-purple-500 via-pink-500 to-orange-400", description: "Real stories and smiles from customers who enjoyed our self-drive cars." },
  { label: "Our Fleet", icon: Car, gradient: "from-blue-500 via-purple-500 to-pink-500", description: "Showcase of our well-maintained hatchbacks, sedans, and SUVs." },
  { label: "Reviews", icon: Star, gradient: "from-yellow-400 via-orange-500 to-red-500", description: "Glowing reviews and testimonials shared by our community." },
  { label: "Trips", icon: MapPin, gradient: "from-green-400 via-teal-500 to-blue-500", description: "Memorable road trips and getaways with Car Rental Bangalore." },
  { label: "Awards", icon: Award, gradient: "from-amber-400 via-orange-500 to-pink-500", description: "Recognition and milestones we've achieved as a trusted rental partner." },
];

const InstagramHighlights = () => {
  const [active, setActive] = useState<typeof highlights[number] | null>(null);

  return (
    <section className="py-12 md:py-16 bg-background border-y border-border">
      <div className="container">
        <div className="text-center mb-8" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <Instagram className="w-4 h-4" />
            Follow Us On Instagram
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-1">
            @car._.rental._.bengaluru
          </h2>
          <p className="text-muted-foreground text-xs">
            Tap a highlight to view our stories
          </p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-5 md:gap-7">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <button
                key={h.label}
                type="button"
                onClick={() => setActive(h)}
                className="group flex flex-col items-center gap-2 w-20 md:w-24 focus:outline-none"
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
                <span className="text-[11px] md:text-xs font-medium text-foreground text-center truncate w-full">
                  {h.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8" data-aos="fade-up">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Instagram className="w-4 h-4" />
            Follow @car._.rental._.bengaluru
          </a>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-sm">
          {active && (
            <>
              <div className={`mx-auto p-[3px] rounded-full bg-gradient-to-tr ${active.gradient}`}>
                <div className="bg-background p-[2px] rounded-full">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                    <active.icon className="w-10 h-10 text-foreground" />
                  </div>
                </div>
              </div>
              <DialogHeader className="text-center sm:text-center">
                <DialogTitle className="text-center text-xl">{active.label}</DialogTitle>
                <DialogDescription className="text-center">
                  {active.description}
                </DialogDescription>
              </DialogHeader>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all"
              >
                <Instagram className="w-4 h-4" />
                View on Instagram
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InstagramHighlights;
