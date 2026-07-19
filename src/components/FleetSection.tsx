import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CarCardCarousel from "./CarCardCarousel";
import { supabase } from "@/integrations/supabase/client";

// Import all fallback car images
import swiftImg from "@/assets/cars/swift.png";
import balenoImg from "@/assets/cars/baleno.png";
import glanzaImg from "@/assets/cars/glanza.png";
import punchImg from "@/assets/cars/punch.png";
import i20Img from "@/assets/cars/i20.png";
import poloImg from "@/assets/cars/polo.png";
import brezzaImg from "@/assets/cars/brezza.png";
import fronxImg from "@/assets/cars/fronx.png";
import sonetImg from "@/assets/cars/sonet.png";
import cretaImg from "@/assets/cars/creta.png";
import seltosImg from "@/assets/cars/seltos.png";
import tharImg from "@/assets/cars/thar.png";
import tharRoxxImg from "@/assets/cars/thar-roxx.png";
import ertigaImg from "@/assets/cars/ertiga.png";
import innovaImg from "@/assets/cars/innova.png";
import xuv500Img from "@/assets/cars/xuv500.png";
import rumionImg from "@/assets/cars/rumion.png";
import innovaCrystaImg from "@/assets/cars/innova-crysta.png";
import xuv700Img from "@/assets/cars/xuv700.png";
import hycrossImg from "@/assets/cars/hycross.png";
import fortunerImg from "@/assets/cars/fortuner.png";

// Fallback image mapping
const fallbackImages: Record<string, string> = {
  "Swift": swiftImg,
  "Baleno": balenoImg,
  "Glanza": glanzaImg,
  "Punch": punchImg,
  "i20": i20Img,
  "Polo": poloImg,
  "Brezza": brezzaImg,
  "Fronx": fronxImg,
  "Sonet": sonetImg,
  "Creta": cretaImg,
  "Seltos": seltosImg,
  "Thar": tharImg,
  "Thar Roxx": tharRoxxImg,
  "Ertiga": ertigaImg,
  "Innova": innovaImg,
  "XUV500": xuv500Img,
  "Rumion": rumionImg,
  "Innova Crysta": innovaCrystaImg,
  "XUV700": xuv700Img,
  "Hycross": hycrossImg,
  "Fortuner": fortunerImg,
};

type Category = "all" | "5-Seater" | "7-Seater";

interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  categoryLabel: string;
  transmission: string;
  fuel: string;
  kmLimit: number;
  extraKmCharge: number;
  isAvailable: boolean;
  locations: string[];
}

const FleetSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('price', { ascending: true });
        
        if (error) throw error;
        
        setCars(data.map(car => ({
          id: car.id,
          name: car.name,
          brand: car.brand,
          price: car.price,
          image: car.image || fallbackImages[car.name] || swiftImg,
          images: (car as any).images || [],
          category: car.category,
          categoryLabel: car.category_label || 'Hatchback',
          transmission: car.transmission,
          fuel: car.fuel,
          kmLimit: car.km_limit,
          extraKmCharge: car.extra_km_charge,
          isAvailable: (car as any).is_available ?? true,
          locations: (car as any).locations || [],
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Only show available cars
  const availableCars = cars.filter(car => car.isAvailable);

  const filteredCars = activeCategory === "all" 
    ? availableCars 
    : availableCars.filter(car => car.category === activeCategory);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All Cars" },
    { key: "5-Seater", label: "5-Seater" },
    { key: "7-Seater", label: "7-Seater" },
  ];

  return (
    <section id="cars" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold" />
            <span className="text-[11px] font-semibold text-gold uppercase tracking-[0.3em]">
              The Collection
            </span>
            <div className="h-px w-8 bg-gold" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-[1]">
            Choose your <span className="italic text-gold-gradient">perfect ride</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mb-5" />
          <p className="text-foreground/70 max-w-2xl mx-auto font-light">
            From city hatchbacks to weekend SUVs — every car is hand-inspected, fully insured,
            and ready for the road.
          </p>
        </div>


        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === key
                  ? "bg-gold text-charcoal border-gold shadow-button"
                  : "bg-transparent text-foreground/70 border-gold/25 hover:border-gold hover:text-gold"
              }`}
              style={{ borderRadius: "2px" }}
            >
              {label}
            </button>

          ))}
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading cars...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-5 max-w-2xl mx-auto">
            {filteredCars.slice(0, 9).map((car, index) => (
              <div key={car.id} data-aos="fade-up" data-aos-delay={index * 40}>
                <CarCardCarousel
                  name={car.name}
                  brand={car.brand}
                  price={car.price}
                  image={car.image}
                  images={car.images}
                  transmission={car.transmission}
                  fuel={car.fuel}
                  kmLimit={car.kmLimit}
                  extraKmCharge={car.extraKmCharge}
                  isAvailable={car.isAvailable}
                  locations={car.locations}
                />
              </div>
            ))}
          </div>

        )}

        {/* View All Cars Link */}
        <div className="text-center mt-12">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-charcoal font-semibold text-xs uppercase tracking-widest transition-all duration-300"
            style={{ borderRadius: "2px" }}
          >
            View Entire Collection →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FleetSection;