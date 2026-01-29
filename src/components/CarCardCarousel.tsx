import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, Users } from "lucide-react";
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

  return (
    <div 
      className={`group relative rounded-[20px] overflow-hidden bg-card shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 animate-fade-in font-sans ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
    >
      {/* Unavailable Badge */}
      {!isAvailable && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm">
          <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image Container - Clean, no text overlay */}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
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
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-primary-foreground shadow-lg z-10">
          {category}
        </span>
      </div>

      {/* Card Content - Below Image */}
      <div className="p-5 space-y-4">
        {/* Car Name */}
        <h3 className="font-sans font-bold text-xl md:text-2xl text-foreground leading-tight tracking-tight">
          {name}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            fuel === "Diesel" 
              ? "bg-amber-500/15 text-amber-500" 
              : "bg-emerald-500/15 text-emerald-500"
          }`}>
            <Fuel className="w-3.5 h-3.5" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-500">
            <Cog className="w-3.5 h-3.5" />
            {transmission}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-500">
            <Users className="w-3.5 h-3.5" />
            5 Seats
          </span>
        </div>

        {/* Pricing & Details */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="font-sans font-bold text-2xl md:text-3xl text-primary">₹{price}</span>
              <span className="text-muted-foreground text-sm ml-1">/day</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-500" />
              {kmLimit}km/day included
            </span>
            <span className="text-xs">₹{extraKmCharge}/km extra</span>
          </div>
        </div>

        {/* Book Now Button */}
        <a
          href={isAvailable ? whatsappLink : undefined}
          target={isAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all duration-300 text-sm group/btn ${
            isAvailable 
              ? 'bg-gradient-to-r from-whatsapp to-emerald-500 hover:from-whatsapp/90 hover:to-emerald-500/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          <MessageCircle className={`w-5 h-5 transition-transform duration-300 ${isAvailable ? 'group-hover/btn:rotate-12' : ''}`} />
          {isAvailable ? 'Book Now' : 'Unavailable'}
        </a>
      </div>
    </div>
  );
};

export default CarCardCarousel;