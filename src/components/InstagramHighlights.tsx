import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/car._.rental._.bengaluru?igsh=MTFpZXBjdGE0am5tbg==";
const FACEBOOK_URL = "https://www.facebook.com/share/17suAiWW35/";

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
            Follow us for latest cars, offers & happy customers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4" data-aos="fade-up">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
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
