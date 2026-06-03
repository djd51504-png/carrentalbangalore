import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, MapPin } from "lucide-react";
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
  const whatsappLink = `https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20book%20the%20${encodeURIComponent(brand ? brand + ' ' + name : name)}%20from%20Car%20Rental%20Bengaluru.%0A%0A🚗%20Car:%20${encodeURIComponent(brand ? brand + ' ' + name : name)}%0A💰%20Price:%20₹${price}/day%0A🛣️%20KM%20Limit:%20${kmLimit}km/day%20(₹${extraKmCharge}/extra%20km)%0A%0APlease%20confirm%20availability.`;

  // Use images array if available, otherwise fallback to single image
  const allImages = images.length > 0 ? images : (image ? [image] : []);
  const hasMultipleImages = allImages.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 animate-fade-in ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
    >
      {/* Unavailable Badge */}
      {!isAvailable && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm">
          <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-sm">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-secondary/40">
        {allImages.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {allImages.map((img, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${name} - View ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {/* Carousel Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-charcoal/30 backdrop-blur-sm rounded-full px-2 py-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  emblaApi?.scrollTo(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? 'bg-primary w-4' 
                    : 'bg-primary-foreground/60 hover:bg-primary-foreground/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>


      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      </div>

      {/* Card Content */}
      <div className="relative p-3 md:p-4 space-y-2 md:space-y-3">
        {/* Car Name + Price */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading font-bold text-sm md:text-base text-foreground leading-tight tracking-tight whitespace-nowrap truncate flex-1 min-w-0">
            {brand} {name}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="font-heading font-bold text-sm md:text-base text-primary leading-none whitespace-nowrap">₹{price.toLocaleString()}<span className="text-muted-foreground text-[10px] md:text-xs font-normal">/day</span></div>
          </div>
        </div>

        {/* Location */}
        {locations.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">{locations.join(" · ")}</span>
          </div>
        )}

        {/* Specs Row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full ${
            fuel === "Diesel"
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          }`}>
            <Fuel className="w-3 h-3" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Cog className="w-3 h-3" />
            {transmission.length > 8 ? transmission.split(' ')[0] : transmission}
          </span>
        </div>

        {/* KM Limit */}
        <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
          <Gauge className="w-3 h-3 text-primary" />
          <span>{kmLimit}km/day · ₹{extraKmCharge}/extra km</span>
        </div>

        {/* WhatsApp Book Button */}
        <a
          href={isAvailable ? whatsappLink : undefined}
          target={isAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 md:py-2.5 rounded-lg font-bold transition-all duration-300 text-xs md:text-sm whitespace-nowrap ${
            isAvailable
              ? 'bg-whatsapp hover:bg-whatsapp/90 text-white shadow-sm hover:shadow-md active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Book on WhatsApp
        </a>
      </div>

    </div>
  );
};

export default CarCardCarousel;
