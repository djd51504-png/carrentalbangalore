import { Star, ExternalLink } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const GoogleReviews = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8" data-aos="fade-down">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Customer Reviews
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by 5000+ Happy Customers
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">5.0</span>
            <span className="text-muted-foreground">on Google Maps</span>
          </div>
          <a
            href="https://maps.app.goo.gl/fw68cvMAG3RHGGYR8?g_st=ac"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View all reviews on Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* CTA */}
        <div className="text-center mt-6" data-aos="fade-up">
          <a
            href={buildWhatsAppLink("Hi, I want to book a car from Car Rental Bengaluru")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-whatsapp to-emerald-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Join Our Happy Customers
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
