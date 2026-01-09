import { MessageCircle, Fuel, Cog, Users } from "lucide-react";

interface CarCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  transmission: string;
  fuel: string;
}

const CarCard = ({ name, price, image, category, transmission, fuel }: CarCardProps) => {
  const whatsappLink = `https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20book%20the%20${encodeURIComponent(name)}%20from%20Key2Go.`;

  return (
    <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border/50 hover:border-primary/30">
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-secondary/30 to-secondary/60 p-4 md:p-8">
        <img
          src={image}
          alt={name}
          className="w-full h-40 md:h-52 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground shadow-lg">
          <Users className="w-3 h-3" />
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 md:p-6">
        {/* Title and Price */}
        <div className="flex flex-col gap-1 mb-2">
          <h3 className="font-heading font-bold text-base md:text-xl text-foreground leading-tight truncate">{name}</h3>
          <div className="flex items-baseline gap-1">
            <p className="font-heading font-bold text-xl md:text-2xl text-primary">₹{price}</p>
            <p className="text-xs text-muted-foreground font-medium">/day</p>
          </div>
          <p className="text-xs text-muted-foreground">300km per day limit</p>
        </div>

        {/* Badges Grid - 2 columns only */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <span className={`flex flex-col items-center justify-center gap-1 text-xs font-semibold px-2 py-2 rounded-xl ${
            fuel === "Diesel" 
              ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300" 
              : "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300"
          }`}>
            <Fuel className="w-4 h-4" />
            {fuel}
          </span>
          <span className="flex flex-col items-center justify-center gap-1 text-xs font-semibold px-2 py-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300">
            <Cog className="w-4 h-4" />
            {transmission.length > 8 ? transmission.split(' ')[0] : transmission}
          </span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-whatsapp to-emerald-500 hover:from-whatsapp/90 hover:to-emerald-500/90 text-white py-3 md:py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm md:text-base"
        >
          <MessageCircle className="w-5 h-5" />
          Book Now
        </a>
      </div>
    </div>
  );
};

export default CarCard;
