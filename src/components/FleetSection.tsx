import { useState } from "react";
import CarCard from "./CarCard";

// Import all car images
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

type Category = "all" | "5-seater" | "7-seater";

interface Car {
  name: string;
  price: number;
  image: string;
  category: "5-seater" | "7-seater";
  categoryLabel: string;
  transmission: "Manual" | "Automatic" | "Manual & Automatic";
  fuel: "Petrol" | "Diesel";
}

const cars: Car[] = [
  // 5-Seaters
  { name: "Swift", price: 2500, image: swiftImg, category: "5-seater", categoryLabel: "Hatchback", transmission: "Manual & Automatic", fuel: "Petrol" },
  { name: "Baleno", price: 3000, image: balenoImg, category: "5-seater", categoryLabel: "Hatchback", transmission: "Manual & Automatic", fuel: "Petrol" },
  { name: "Glanza", price: 3000, image: glanzaImg, category: "5-seater", categoryLabel: "Hatchback", transmission: "Manual", fuel: "Petrol" },
  { name: "Punch", price: 3000, image: punchImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "i20", price: 3000, image: i20Img, category: "5-seater", categoryLabel: "Hatchback", transmission: "Manual & Automatic", fuel: "Petrol" },
  { name: "Polo", price: 3000, image: poloImg, category: "5-seater", categoryLabel: "Hatchback", transmission: "Manual", fuel: "Petrol" },
  { name: "Brezza", price: 3500, image: brezzaImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Fronx", price: 3500, image: fronxImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Sonet", price: 3500, image: sonetImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Creta", price: 4000, image: cretaImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Seltos", price: 4500, image: seltosImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Thar", price: 6500, image: tharImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual & Automatic", fuel: "Diesel" },
  { name: "Thar Roxx", price: 8000, image: tharRoxxImg, category: "5-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  // 7-Seaters
  { name: "Ertiga", price: 4000, image: ertigaImg, category: "7-seater", categoryLabel: "MUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Innova", price: 4000, image: innovaImg, category: "7-seater", categoryLabel: "MUV", transmission: "Manual", fuel: "Diesel" },
  { name: "XUV500", price: 4000, image: xuv500Img, category: "7-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Rumion", price: 4500, image: rumionImg, category: "7-seater", categoryLabel: "MUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Innova Crysta", price: 6500, image: innovaCrystaImg, category: "7-seater", categoryLabel: "MUV", transmission: "Manual & Automatic", fuel: "Diesel" },
  { name: "XUV700", price: 6500, image: xuv700Img, category: "7-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
  { name: "Hycross", price: 7500, image: hycrossImg, category: "7-seater", categoryLabel: "MUV", transmission: "Automatic", fuel: "Petrol" },
  { name: "Fortuner", price: 9000, image: fortunerImg, category: "7-seater", categoryLabel: "SUV", transmission: "Manual", fuel: "Petrol" },
];

const FleetSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredCars = activeCategory === "all" 
    ? cars 
    : cars.filter(car => car.category === activeCategory);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All Cars" },
    { key: "5-seater", label: "5-Seater Hatchbacks/SUVs" },
    { key: "7-seater", label: "7-Seater MUVs" },
  ];

  return (
    <section id="fleet" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Our Fleet
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From budget-friendly hatchbacks to premium SUVs – we've got the perfect car for every journey.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.name}
              name={car.name}
              price={car.price}
              image={car.image}
              category={car.categoryLabel}
              transmission={car.transmission}
              fuel={car.fuel}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
