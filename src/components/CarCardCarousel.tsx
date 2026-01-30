import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, Users, Shield, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface CarCardCarouselProps {
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  transmission: string;
  fuel: string;
  kmLimit?: number;
  extraKmCharge?: number;
  isAvailable?: boolean;
}

const CarCardCarousel = ({ 
  name, 
  price, 
  image, 
  images = [],
  category, 
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

  // Extract seating number from category
  const seatCount = category.includes("7") ? "7" : "5";

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
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-charcoal/30 backdrop-blur-sm rounded-full px-2 py-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  emblaApi?.scrollTo(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? 'bg-primary w-5' 
                    : 'bg-primary-foreground/60 hover:bg-primary-foreground/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
          {/* Seating Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-primary-foreground shadow-lg">
            <Users className="w-3.5 h-3.5" />
            {seatCount} Seater
          </span>
          
          {/* Verified Badge */}
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground shadow-md">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Verified
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Car Name & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground leading-tight tracking-tight">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg shrink-0">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-sm font-semibold text-foreground">4.8</span>
          </div>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
            fuel === "Diesel" 
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" 
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          }`}>
            <Fuel className="w-3.5 h-3.5" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Cog className="w-3.5 h-3.5" />
            {transmission}
          </span>
        </div>

        {/* Pricing Section */}
        <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-2xl md:text-3xl text-primary">₹{price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/day</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{kmLimit}km</span>/day
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              Extra: <span className="font-medium text-foreground">₹{extraKmCharge}/km</span>
            </span>
          </div>
        </div>

        {/* Book Now Button */}
        <a
          href={isAvailable ? whatsappLink : undefined}
          target={isAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all duration-300 text-sm group/btn ${
            isAvailable 
              ? 'bg-gradient-to-r from-whatsapp to-emerald-500 hover:from-whatsapp/90 hover:to-emerald-500/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          <MessageCircle className={`w-5 h-5 transition-transform duration-300 ${isAvailable ? 'group-hover/btn:rotate-12' : ''}`} />
          {isAvailable ? 'Book on WhatsApp' : 'Unavailable'}
        </a>
      </div>
    </div>
  );
};

export default CarCardCarousel;
