import { MapPin } from "lucide-react";

const locations = [
  { name: "Hebbal", landmark: "Near Hebbal Flyover" },
  { name: "Thanisandra", landmark: "Thanisandra Main Road" },
  { name: "KR Puram", landmark: "Krishnarajapuram Station" },
  { name: "Bellandur", landmark: "Bellandur Junction" },
  { name: "Hongasandra", landmark: "Near Bommanahalli" },
  { name: "Kengeri", landmark: "Kengeri Satellite Town" },
  { name: "Nagarabhavi", landmark: "Nagarabhavi Circle" },
  { name: "Kadugodi", landmark: "Near ITPL" },
];

const LocationsSection = () => {
  return (
    <section id="locations" className="py-16 md:py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Convenient Pickup Points
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Available Locations in Bangalore
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pick up your car from any of our 8 convenient locations across Bangalore. 
            Free pickup and drop available at all locations.
          </p>
        </div>

        {/* Locations Grid - 4 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className="group relative bg-card border border-border rounded-2xl p-5 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300 shadow-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors text-base md:text-lg">
                    {location.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {location.landmark}
                  </p>
                </div>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center mt-10">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
            Doorstep delivery available across Bangalore at nominal charges
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;