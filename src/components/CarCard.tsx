import { MessageCircle, Fuel, Cog, Gauge, Shield } from "lucide-react";

interface CarCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  transmission: string;
  fuel: string;
  price3Days?: number | null;
  price7Days?: number | null;
  price15Days?: number | null;
  price30Days?: number | null;
  extraKmCharge?: number;
}

const CarCard = ({
  name,
  price,
  image,
  transmission,
  fuel,
  extraKmCharge = 10,
}: CarCardProps) => {
  const waMessage = `Hi Vikas, I want to book the ${name} from Car Rental Bengaluru.\n\n🚗 Car: ${name}\n💰 Price: ₹${price}/day\n📍 Location: Bommanahalli\n\nPlease confirm availability.`;
  const whatsappLink = `https://wa.me/919448277091?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="group relative bg-card border border-gold/15 hover:border-gold/50 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 animate-fade-in overflow-hidden"
      style={{ borderRadius: "2px" }}
    >
      {/* Gold corners */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gold z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-gold z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-gold z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gold z-10 pointer-events-none" />

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-charcoal-light to-background overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-md border border-gold/30 px-2 py-1" style={{ borderRadius: "2px" }}>
          <Shield className="w-3 h-3 text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-foreground/80 font-semibold">Verified</span>
        </div>

        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md border border-gold/40 px-3 py-1.5" style={{ borderRadius: "2px" }}>
          <div className="font-heading text-gold text-base leading-none">
            ₹{price}
            <span className="text-[10px] text-foreground/60 font-sans font-normal">/day</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 space-y-3">
        <h3 className="font-heading text-lg md:text-xl text-foreground leading-tight truncate">
          <span className="italic text-gold">{name}</span>
        </h3>
        <div className="gold-divider" />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-background/60 border border-gold/15 px-2.5 py-2" style={{ borderRadius: "2px" }}>
            <Fuel className="w-3.5 h-3.5 text-gold" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-foreground/50">Fuel</div>
              <div className="text-xs font-semibold text-foreground">{fuel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background/60 border border-gold/15 px-2.5 py-2" style={{ borderRadius: "2px" }}>
            <Cog className="w-3.5 h-3.5 text-gold" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-foreground/50">Trans</div>
              <div className="text-xs font-semibold text-foreground">
                {transmission.length > 8 ? transmission.split(" ")[0] : transmission}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/70">
          <Gauge className="w-3.5 h-3.5 text-gold" />
          <span>
            <span className="font-semibold text-foreground">300km</span>/day ·{" "}
            <span className="font-semibold text-foreground">₹{extraKmCharge}</span>/extra km
          </span>
        </div>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-button text-primary-foreground font-semibold text-xs uppercase tracking-widest hover:shadow-button hover:-translate-y-0.5 transition-all duration-300"
          style={{ borderRadius: "2px" }}
        >
          <MessageCircle className="w-4 h-4" />
          Book on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CarCard;
