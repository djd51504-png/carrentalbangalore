import { useState } from "react";
import { Instagram, Heart, Calendar, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const INSTAGRAM_URL = "https://www.instagram.com/car._.rental._.bengaluru?igsh=MTFpZXBjdGE0am5tbg==";

const highlights = [
  {
    label: "Bookings & Advance",
    icon: Calendar,
    gradient: "from-pink-500 via-red-500 to-yellow-500",
    description: "See our latest confirmed bookings and advance receipts from happy customers.",
    url: "https://www.instagram.com/stories/highlights/18112622392858085/",
  },
  {
    label: "Happy Customers",
    icon: Heart,
    gradient: "from-purple-500 via-pink-500 to-orange-400",
    description: "Real stories and smiles from customers who enjoyed our self-drive cars.",
    url: "https://www.instagram.com/stories/highlights/17885886852507526/",
  },
];

const InstagramHighlights = () => {
  const [active, setActive] = useState<typeof highlights[number] | null>(null);

  return (
    <section className="py-10 md:py-14 bg-background border-y border-border">
      <div className="container">
        <div className="text-center mb-6" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <Instagram className="w-4 h-4" />
            Follow Us On Instagram
          </div>
          <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
            @car._.rental._.bengaluru
          </h2>
          <p className="text-muted-foreground text-xs mt-1">
            Tap a highlight to view our stories
          </p>
        </div>

        <div className="flex items-start justify-center gap-8">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <a
                key={h.label}
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 w-24 focus:outline-none"
                data-aos="zoom-in"
                data-aos-delay={i * 80}
              >
                <div className={`p-[3px] rounded-full bg-gradient-to-tr ${h.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="bg-background p-[2px] rounded-full">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                      <Icon className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {h.label}
                </span>
              </a>
            );
          })}
        </div>

        <div className="text-center mt-7" data-aos="fade-up">
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
                href={active.url}
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
