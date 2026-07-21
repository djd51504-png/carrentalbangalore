import { MessageCircle, Fuel, Cog, Gauge } from "lucide-react";

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
  const waMessage = `Hi, I want to book the ${name} from Car Rental Bengaluru.\n\n🚗 Car: ${name}\n💰 Price: ₹${price}/day\n\nPlease confirm availability.`;
  const whatsappLink = `https://wa.me/919448277091?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 border border-border">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
          <div className="text-base font-extrabold text-primary leading-none">
            ₹{price}
            <span className="text-[10px] text-muted-foreground font-medium">/day</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-3">
        <h3 className="font-heading text-lg md:text-xl font-extrabold text-foreground leading-tight">
          {name}
        </h3>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs font-semibold text-foreground">
            <Fuel className="w-3.5 h-3.5 text-primary" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs font-semibold text-foreground">
            <Cog className="w-3.5 h-3.5 text-primary" />
            {transmission}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Gauge className="w-3.5 h-3.5 text-primary" />
          <span>
            <span className="font-bold text-foreground">300km</span>/day ·{" "}
            <span className="font-bold text-foreground">₹{extraKmCharge}</span>/extra km
          </span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-button text-primary-foreground rounded-2xl font-bold text-sm shadow-button hover:-translate-y-0.5 transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4" />
          Book on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CarCard;
