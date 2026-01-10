import { MapPin } from "lucide-react";

const locations = [
  { name: "Hebbal", landmark: "Near Hebbal Flyover" },
  { name: "Thanisandra", landmark: "Thanisandra Main Road" },
  { name: "KR Puram", landmark: "Krishnarajapuram Station" },
  { name: "Bellandur", landmark: "Bellandur Junction" },
  { name: "Haralur", landmark: "Haralur Main Road" },
  { name: "Hongasandra", landmark: "Near Bommanahalli" },
  { name: "Kengeri", landmark: "Kengeri Satellite Town" },
  { name: "Nagarabhavi", landmark: "Nagarabhavi Circle" },
  { name: "Kadugodi", landmark: "Near ITPL" },
];

const LocationsSection = () => {
  return (
    <section id="locations" className="py-16 md:py-20 bg-secondary/50">
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
            Pick up your car from any of our 9 convenient locations across Bangalore. 
            Free pickup and drop available at all locations.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {location.landmark}
                  </p>
                </div>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          <MapPin className="w-4 h-4 inline-block mr-1 text-primary" />
          Doorstep delivery available across Bangalore at nominal charges
        </p>
      </div>
    </section>
  );
};

export default LocationsSection;