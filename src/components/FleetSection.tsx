import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CarCard from "./CarCard";
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
  price: number;
  image: string;
  category: string;
  categoryLabel: string;
  transmission: string;
  fuel: string;
  price3Days: number | null;
  price7Days: number | null;
  price15Days: number | null;
  price30Days: number | null;
  extraKmCharge: number;
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
          price: car.price,
          image: car.image || fallbackImages[car.name] || swiftImg,
          category: car.category,
          categoryLabel: car.category_label || 'Hatchback',
          transmission: car.transmission,
          fuel: car.fuel,
          price3Days: car.price_3_days,
          price7Days: car.price_7_days,
          price15Days: car.price_15_days,
          price30Days: car.price_30_days,
          extraKmCharge: car.extra_km_charge,
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = activeCategory === "all" 
    ? cars 
    : cars.filter(car => car.category === activeCategory);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All Cars" },
    { key: "5-Seater", label: "5-Seater" },
    { key: "7-Seater", label: "7-Seater" },
  ];

  return (
    <section id="cars" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14" data-aos="fade-down">
          <span className="inline-block text-sm font-semibold text-gold uppercase tracking-wider mb-2">
            Our Cars
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
            From budget-friendly hatchbacks to premium SUVs – we've got the perfect car for every journey.
          </p>
          <p className="text-gold font-semibold">
            Price is negotiable for long-term rentals. Call us for the best quote.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === key
                  ? "bg-primary text-primary-foreground shadow-button"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {filteredCars.slice(0, 8).map((car, index) => (
              <div key={car.id} data-aos="fade-up" data-aos-delay={index * 50}>
                <CarCard
                  name={car.name}
                  price={car.price}
                  image={car.image}
                  category={car.categoryLabel}
                  transmission={car.transmission}
                  fuel={car.fuel}
                  price3Days={car.price3Days}
                  price7Days={car.price7Days}
                  price15Days={car.price15Days}
                  price30Days={car.price30Days}
                  extraKmCharge={car.extraKmCharge}
                />
              </div>
            ))}
          </div>
        )}

        {/* View All Cars Link */}
        <div className="text-center mt-10">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-charcoal font-semibold rounded-xl transition-all duration-300"
          >
            View All Cars
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
