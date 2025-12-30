import { MessageCircle, Fuel, Cog } from "lucide-react";

interface CarCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  transmission: "Manual" | "Automatic" | "Manual & Automatic";
  fuel: "Petrol" | "Diesel";
}

const CarCard = ({ name, price, image, category, transmission, fuel }: CarCardProps) => {
  const whatsappLink = `https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20book%20the%20${encodeURIComponent(name)}%20from%20Key2Go.`;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border">
      {/* Image Container */}
      <div className="relative bg-secondary/50 p-4 md:p-6">
        <div className="absolute top-3 right-3 bg-electric text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          300KM Limit
        </div>
        <img
          src={image}
          alt={name}
          className="w-full h-36 md:h-44 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-xl text-primary">₹{price}</p>
            <p className="text-xs text-muted-foreground">/24hrs</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            fuel === "Diesel" 
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          }`}>
            <Fuel className="w-3 h-3" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Cog className="w-3 h-3" />
            {transmission}
          </span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground py-3 rounded-xl font-semibold transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Book Now
        </a>
      </div>
    </div>
  );
};

export default CarCard;
