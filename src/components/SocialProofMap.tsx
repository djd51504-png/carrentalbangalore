import { useState, useEffect } from "react";
import { Car, CheckCircle, MapPin } from "lucide-react";

interface CarLocation {
  id: string;
  x: number;
  y: number;
  label: string;
  testimonial?: string;
}

const locations: CarLocation[] = [
  { id: "1", x: 25, y: 35, label: "Whitefield", testimonial: "Swift picked up at Whitefield!" },
  { id: "2", x: 45, y: 25, label: "Mysore", testimonial: "Innova reached Mysore – 5/5 Service!" },
  { id: "3", x: 15, y: 55, label: "Electronic City", testimonial: "i20 headed to Ooty" },
  { id: "4", x: 70, y: 40, label: "Hebbal" },
  { id: "5", x: 55, y: 60, label: "Koramangala", testimonial: "Creta on the way to Coorg!" },
  { id: "6", x: 30, y: 70, label: "Rameshwaram", testimonial: "Fortuner reached Rameshwaram!" },
  { id: "7", x: 80, y: 20, label: "Chikmagalur", testimonial: "Thar exploring Chikmagalur!" },
  { id: "8", x: 65, y: 75, label: "Coorg" },
  { id: "9", x: 40, y: 45, label: "Indiranagar", testimonial: "XUV700 picked up for Pondicherry trip!" },
  { id: "10", x: 20, y: 20, label: "Ooty", testimonial: "Baleno just reached Ooty!" },
];

const SocialProofMap = () => {
  const [activePopups, setActivePopups] = useState<string[]>([]);
  const [carsOnTrip, setCarsOnTrip] = useState(22);
  const [carsAvailable, setCarsAvailable] = useState(6);

  // Rotate testimonial popups
  useEffect(() => {
    const locationsWithTestimonials = locations.filter(l => l.testimonial);
    let currentIndex = 0;

    const interval = setInterval(() => {
      const location = locationsWithTestimonials[currentIndex];
      setActivePopups([location.id]);
      
      currentIndex = (currentIndex + 1) % locationsWithTestimonials.length;
    }, 3000);

    // Show first popup immediately
    if (locationsWithTestimonials.length > 0) {
      setActivePopups([locationsWithTestimonials[0].id]);
    }

    return () => clearInterval(interval);
  }, []);

  // Simulate real-time counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCarsOnTrip(prev => Math.max(18, Math.min(26, prev + (Math.random() > 0.5 ? 1 : -1))));
      setCarsAvailable(prev => Math.max(5, Math.min(7, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[hsl(220,20%,8%)] relative overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(210,100%,50%,0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(210,100%,50%,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(220,20%,8%,0.5)] to-[hsl(220,20%,8%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 font-[Montserrat]">
            Bangalore is Driving with{" "}
            <span className="text-gradient">Active!</span>
          </h2>
          
          {/* Live Counter */}
          <div className="inline-flex items-center gap-4 bg-[hsl(220,20%,12%)] border border-primary/30 rounded-full px-6 py-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-primary-foreground font-semibold">
                <span className="text-primary text-xl font-bold">{carsOnTrip}</span> Cars currently on trips
              </span>
            </div>
            <div className="w-px h-6 bg-primary/30" />
            <div className="flex items-center gap-2">
              <span className="text-primary-foreground font-semibold">
                <span className="text-[hsl(142,76%,50%)] text-xl font-bold">{carsAvailable}</span> Cars available today
              </span>
              <CheckCircle className="h-5 w-5 text-[hsl(142,76%,50%)]" />
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div data-aos="zoom-in" data-aos-delay="200" className="relative max-w-4xl mx-auto aspect-[16/10] bg-[hsl(220,20%,10%)] rounded-2xl border border-primary/20 overflow-hidden">
          {/* Stylized map lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Road network - stylized lines */}
            <path
              d="M10,50 Q30,30 50,50 T90,50"
              stroke="hsl(210,100%,50%,0.2)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M20,20 Q50,40 80,20"
              stroke="hsl(210,100%,50%,0.2)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M30,80 Q50,60 70,80"
              stroke="hsl(210,100%,50%,0.2)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M50,10 L50,90"
              stroke="hsl(210,100%,50%,0.15)"
              strokeWidth="0.3"
              fill="none"
            />
            <path
              d="M10,30 L90,70"
              stroke="hsl(210,100%,50%,0.15)"
              strokeWidth="0.3"
              fill="none"
            />
            
            {/* Bangalore city marker */}
            <circle
              cx="45"
              cy="45"
              r="8"
              fill="none"
              stroke="hsl(210,100%,50%,0.3)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <text
              x="45"
              y="47"
              textAnchor="middle"
              fontSize="3"
              fill="hsl(210,100%,60%,0.6)"
              fontWeight="500"
            >
              BANGALORE
            </text>
          </svg>

          {/* Car markers */}
          {locations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
            >
              {/* Ping animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/30 rounded-full animate-ping" />
              </div>
              
              {/* Car icon */}
              <div className="relative z-10 w-10 h-10 bg-[hsl(220,20%,15%)] border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_20px_hsl(210,100%,50%,0.4)]">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>

              {/* Location label */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-primary/80 font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location.label}
                </span>
              </div>

              {/* Testimonial popup */}
              {location.testimonial && activePopups.includes(location.id) && (
                <div 
                  className="absolute -top-16 left-1/2 -translate-x-1/2 bg-primary-foreground text-[hsl(220,20%,15%)] px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in z-20"
                >
                  <p className="text-sm font-medium">{location.testimonial}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-primary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust caption */}
        <p className="text-center text-primary/60 text-sm mt-6 flex items-center justify-center gap-2">
          <CheckCircle className="h-4 w-4 text-[hsl(142,76%,50%)]" />
          Real-time fleet activity. We keep Bangalore moving.
        </p>
      </div>
    </section>
  );
};

export default SocialProofMap;
