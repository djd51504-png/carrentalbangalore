import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, Shield, Star } from "lucide-react";
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
  const whatsappLink = `https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20book%20the%20${encodeURIComponent(name)}%20from%20Key2Go.`;

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

      {/* Card Content */}
      <div className="p-3 space-y-2">
        {/* Car Name & Specs Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-base text-foreground leading-tight tracking-tight truncate">
              {brand && <span className="text-muted-foreground font-medium">{brand} </span>}
              {name}
            </h3>
            {/* Compact Specs */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded ${
                fuel === "Diesel" 
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" 
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}>
                <Fuel className="w-2 h-2" />
                {fuel === "Petrol" ? "P" : "D"}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <Cog className="w-2 h-2" />
                {transmission === "Manual" ? "M" : "A"}
              </span>
              <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                <Star className="w-2 h-2 fill-gold text-gold" />
                4.8
              </span>
              <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                <Gauge className="w-2 h-2" />
                {kmLimit}km • ₹{extraKmCharge}/km
              </span>
            </div>
          </div>
          
          {/* Price & Book Button */}
          <div className="flex flex-col items-end gap-1">
            <div className="text-right">
              <span className="font-heading font-bold text-lg text-primary">₹{price.toLocaleString()}</span>
              <span className="text-muted-foreground text-[10px]">/day</span>
            </div>
            <a
              href={isAvailable ? whatsappLink : undefined}
              target={isAvailable ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-md font-semibold transition-all duration-300 text-[10px] whitespace-nowrap ${
                isAvailable 
                  ? 'bg-whatsapp hover:bg-whatsapp/90 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={(e) => !isAvailable && e.preventDefault()}
            >
              <MessageCircle className="w-3 h-3" />
              Book
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardCarousel;
