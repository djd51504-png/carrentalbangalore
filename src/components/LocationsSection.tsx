import { MapPin } from "lucide-react";

const locations = [
  "Hebbal",
  "Thanisandra",
  "KR Puram",
  "Bellandur",
  "Hongasandra",
  "Kengeri",
  "Chikabanavara",
  "Kadugodi",
];

const LocationsSection = () => {
  return (
    <section id="locations" className="py-10 md:py-14 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container">
        <div className="text-center mb-6" data-aos="fade-down">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Pickup Points
          </span>
          <h2 className="font-heading text-lg md:text-2xl font-bold text-foreground">
            8 Locations Across Bangalore
          </h2>
        </div>

        {/* Compact pill grid */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto" data-aos="fade-up">
          {locations.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-xs md:text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {name}
            </span>
          ))}
        </div>

        <p className="text-center mt-5 text-[11px] md:text-xs text-muted-foreground">
          Free pickup & drop at all locations · Doorstep delivery at nominal charges
        </p>
      </div>
    </section>
  );
};

export default LocationsSection;
