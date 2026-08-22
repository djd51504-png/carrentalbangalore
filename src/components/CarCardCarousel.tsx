import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Fuel, Cog, ChevronLeft, ChevronRight, Gauge, MapPin } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

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
  const locationText = "All over Bangalore";
  const waMessage = `Hi, I want to book the ${carFullName} from Car Rental Bengaluru.\n\n🚗 Car: ${carFullName}\n💰 Price: ₹${price}/day\n🛣️ KM Limit: ${kmLimit}km/day (₹${extraKmCharge}/extra km)\n📍 Location: ${locationText}\n\nPlease confirm availability.`;
  const whatsappLink = buildWhatsAppLink(waMessage);

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
      className={`group relative overflow-hidden bg-card rounded-3xl border border-border shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 animate-fade-in ${
        !isAvailable ? "opacity-60 grayscale" : ""
      }`}
    >
      {!isAvailable && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {allImages.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {allImages.map((img, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={img}
                    alt={`${carFullName} - View ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        {/* Price tag on image */}
        <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
          <div className="text-base md:text-lg font-extrabold text-primary leading-none">
            ₹{price.toLocaleString()}
            <span className="text-[10px] text-muted-foreground font-medium">/day</span>
          </div>
        </div>

        {/* Carousel Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === selectedIndex ? "bg-primary w-6" : "bg-white/70 w-1.5"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 md:p-5 space-y-3">
        <div>
          <h3 className="font-heading text-lg md:text-xl font-extrabold text-foreground leading-tight truncate">
            {brand ? `${brand} ${name}` : name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">Available all over Bangalore</span>
          </div>

        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs font-semibold text-foreground">
            <Fuel className="w-3.5 h-3.5 text-primary" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs font-semibold text-foreground">
            <Cog className="w-3.5 h-3.5 text-primary" />
            {transmission.length > 10 ? transmission.split(" ")[0] : transmission}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Gauge className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span>
            <span className="font-bold text-foreground">{kmLimit}km</span>/day ·{" "}
            <span className="font-bold text-foreground">₹{extraKmCharge}</span>/extra km
          </span>
        </div>

        <a
          href={isAvailable ? whatsappLink : undefined}
          target={isAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
            isAvailable
              ? "bg-gradient-button text-primary-foreground shadow-button hover:-translate-y-0.5"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
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
