import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, Shield, CreditCard } from "lucide-react";
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
  isAvailable = true
}: CarCardCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const whatsappLink = `https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20book%20the%20${encodeURIComponent(brand ? brand + ' ' + name : name)}%20from%20Key2Go.%0A%0A🚗%20Car:%20${encodeURIComponent(brand ? brand + ' ' + name : name)}%0A💰%20Price:%20₹${price}/day%0A🛣️%20KM%20Limit:%20${kmLimit}km/day%20(₹${extraKmCharge}/extra%20km)%0A%0APlease%20confirm%20availability.`;

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
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {allImages.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {allImages.map((img, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={img}
                    alt={`${name} - View ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-md"
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

        {/* Verified Badge Only */}
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground shadow-sm">
            <Shield className="w-3 h-3 text-primary" />
            Verified
          </span>
        </div>
      </div>

      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-accent/10 rounded-full blur-xl" />
        <div className="absolute right-1/4 top-1/2 w-2 h-2 bg-primary/20 rounded-full" />
        <div className="absolute left-1/3 bottom-1/4 w-1.5 h-1.5 bg-accent/30 rounded-full" />
      </div>

      {/* Card Content */}
      <div className="relative p-4 space-y-3">
        {/* Car Name */}
        <h3 className="font-heading font-bold text-lg text-foreground leading-tight tracking-tight">
          {brand} {name}
        </h3>
        
        {/* Specs Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            fuel === "Diesel" 
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20" 
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          }`}>
            <Fuel className="w-3 h-3" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Cog className="w-3 h-3" />
            {transmission}
          </span>
        </div>

        {/* KM Limit & Extra Charge */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <Gauge className="w-3.5 h-3.5 text-primary" />
            {kmLimit}km/day
          </span>
          <span className="text-border">•</span>
          <span className="font-medium">Extra: ₹{extraKmCharge}/km</span>
        </div>

        {/* Price & Book Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <span className="font-heading font-bold text-xl text-primary">₹{price.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs">/day</span>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="/#calculator"
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs whitespace-nowrap ${
                isAvailable 
                  ? 'bg-gradient-to-r from-primary to-purple text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={(e) => !isAvailable && e.preventDefault()}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Book Now
            </a>
            <a
              href={isAvailable ? whatsappLink : undefined}
              target={isAvailable ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs whitespace-nowrap ${
                isAvailable 
                  ? 'bg-whatsapp hover:bg-whatsapp/90 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={(e) => !isAvailable && e.preventDefault()}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Book on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardCarousel;
