import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge } from "lucide-react";
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
      className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
    >
      {/* Unavailable Badge */}
      {!isAvailable && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm">
          <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image Container with Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/60">
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

        {/* Gradient Overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />

        {/* Carousel Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots - positioned on the gradient */}
        {hasMultipleImages && (
          <div className="absolute bottom-20 left-4 z-20 flex gap-1.5">
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
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Car Info Overlay on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-heading font-bold text-lg md:text-xl text-white leading-tight mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>{transmission}</span>
            <span className="text-white/40">•</span>
            <span>{fuel}</span>
          </div>
        </div>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-primary-foreground shadow-lg z-10">
          {category}
        </span>
      </div>

      {/* Content Below Image */}
      <div className="bg-card p-4">
        {/* Price and KM Limit Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">{kmLimit}km per day</span>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-xl md:text-2xl text-primary">₹{price}</span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
          </div>
        </div>

        {/* Fuel and Transmission Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
            fuel === "Diesel" 
              ? "bg-amber-500/20 text-amber-400" 
              : "bg-emerald-500/20 text-emerald-400"
          }`}>
            <Fuel className="w-3.5 h-3.5" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400">
            <Cog className="w-3.5 h-3.5" />
            {transmission}
          </span>
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