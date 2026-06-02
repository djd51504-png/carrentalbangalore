import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/car._.rental._.bengaluru?igsh=MTFpZXBjdGE0am5tbg==";

const InstagramHighlights = () => {
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
            Stay updated with our latest cars, offers & happy customers
          </p>
        </div>

        <div className="text-center" data-aos="fade-up">
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
    </section>
  );
};

export default InstagramHighlights;
