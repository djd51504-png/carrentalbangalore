import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, MapPin, Shield } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface CarCardCarouselProps {
  name: string;
  brand?: string;
  price: number;
  image: string;
  images?: string[];
  transmission: string;
  fuel: string;
  kmLimit?: number;
  extraKmCharge?: number;
  isAvailable?: boolean;
  locations?: string[];
}

const CarCardCarousel = ({
  name,
  brand,
  price,
  image,
  images = [],
  transmission,
  fuel,
  kmLimit = 300,
  extraKmCharge = 10,
  isAvailable = true,
  locations = [],
}: CarCardCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carFullName = brand ? `${brand} ${name}` : name;
  const locationText = locations.length > 0 ? locations.join(", ") : "Bommanahalli";
  const waMessage = `Hi Vikas, I want to book the ${carFullName} from Car Rental Bengaluru.\n\n🚗 Car: ${carFullName}\n💰 Price: ₹${price}/day\n🛣️ KM Limit: ${kmLimit}km/day (₹${extraKmCharge}/extra km)\n📍 Location: ${locationText}\n\nPlease confirm availability.`;
  const whatsappLink = `https://wa.me/919448277091?text=${encodeURIComponent(waMessage)}`;

  const allImages = images.length > 0 ? images : image ? [image] : [];
  const hasMultipleImages = allImages.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className={`group relative overflow-hidden bg-card border border-gold/15 hover:border-gold/50 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 animate-fade-in ${
        !isAvailable ? "opacity-60 grayscale" : ""
      }`}
      style={{ borderRadius: "2px" }}
    >
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold z-10 pointer-events-none" />

      {/* Unavailable Overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-widest">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-charcoal-light to-background">
        {allImages.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {allImages.map((img, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${name} - View ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-muted/40 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

        {/* Price tag on image */}
        <div className="absolute top-3 right-3 z-20 bg-background/90 backdrop-blur-md border border-gold/40 px-3 py-1.5" style={{ borderRadius: "2px" }}>
          <div className="font-heading text-gold text-base md:text-lg leading-none">
            ₹{price.toLocaleString()}
            <span className="text-[10px] text-foreground/60 font-sans font-normal">/day</span>
          </div>
        </div>

        {/* Trust chip */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-md border border-gold/30 px-2 py-1" style={{ borderRadius: "2px" }}>
          <Shield className="w-3 h-3 text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-foreground/80 font-semibold">Verified</span>
        </div>

        {/* Carousel Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/70 backdrop-blur-md border border-gold/30 flex items-center justify-center text-gold md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-charcoal"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/70 backdrop-blur-md border border-gold/30 flex items-center justify-center text-gold md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-charcoal"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    emblaApi?.scrollTo(index);
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === selectedIndex ? "bg-gold w-6" : "bg-foreground/40 w-1.5 hover:bg-foreground/60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="relative p-4 md:p-5 space-y-3">
        {/* Car Name */}
        <div>
          <h3 className="font-heading text-lg md:text-xl text-foreground leading-tight tracking-tight truncate">
            {brand} <span className="italic text-gold">{name}</span>
          </h3>
          {locations.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-foreground/60 mt-1">
              <MapPin className="w-3 h-3 text-gold flex-shrink-0" />
              <span className="truncate uppercase tracking-wider">{locations.join(" · ")}</span>
            </div>
          )}
        </div>

        {/* Gold divider */}
        <div className="gold-divider" />

        {/* Specs Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-background/60 border border-gold/15 px-2.5 py-2" style={{ borderRadius: "2px" }}>
            <Fuel className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-widest text-foreground/50">Fuel</div>
              <div className="text-xs font-semibold text-foreground truncate">{fuel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background/60 border border-gold/15 px-2.5 py-2" style={{ borderRadius: "2px" }}>
            <Cog className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-widest text-foreground/50">Trans</div>
              <div className="text-xs font-semibold text-foreground truncate">
                {transmission.length > 8 ? transmission.split(" ")[0] : transmission}
              </div>
            </div>
          </div>
        </div>

        {/* KM Limit */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-foreground/70">
          <Gauge className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>
            <span className="font-semibold text-foreground">{kmLimit}km</span>/day ·{" "}
            <span className="font-semibold text-foreground">₹{extraKmCharge}</span>/extra km
          </span>
        </div>

        {/* WhatsApp Button */}
        <a
          href={isAvailable ? whatsappLink : undefined}
          target={isAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold text-xs uppercase tracking-widest transition-all duration-300 ${
            isAvailable
              ? "bg-gradient-button text-primary-foreground hover:shadow-button hover:-translate-y-0.5"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          style={{ borderRadius: "2px" }}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          <MessageCircle className="w-4 h-4" />
          Book on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CarCardCarousel;
