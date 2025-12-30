import { useState } from "react";
import CarCard from "./CarCard";

type Category = "all" | "5-seater" | "7-seater";

interface Car {
  name: string;
  price: number;
  image: string;
  category: "5-seater" | "7-seater";
  categoryLabel: string;
}

const cars: Car[] = [
  // 5-Seaters
  { name: "Swift", price: 2500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter-64.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "Hatchback" },
  { name: "Baleno", price: 3000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/baleno-exterior-right-front-three-quarter-9.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "Hatchback" },
  { name: "Glanza", price: 3000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/143865/glanza-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "Hatchback" },
  { name: "Punch", price: 3000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/138895/punch-exterior-right-front-three-quarter-39.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  { name: "i20", price: 3000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/150587/i20-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "Hatchback" },
  { name: "Polo", price: 3000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/36498/polo-exterior-right-front-three-quarter.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "Hatchback" },
  { name: "Brezza", price: 3500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/145973/brezza-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  { name: "Fronx", price: 3500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/143153/fronx-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  { name: "Sonet", price: 3500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/sonet-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  { name: "Creta", price: 4000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  { name: "Seltos", price: 4500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/174323/seltos-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  { name: "Thar", price: 6500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/163651/thar-exterior-right-front-three-quarter-61.jpeg?isig=0&q=80", category: "5-seater", categoryLabel: "SUV" },
  // 7-Seaters
  { name: "Triber", price: 3500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/141875/triber-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "MUV" },
  { name: "Ertiga", price: 4000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/ertiga-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "MUV" },
  { name: "Innova", price: 4000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "MUV" },
  { name: "XUV500", price: 4000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/xuv500-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "SUV" },
  { name: "Rumion", price: 4500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/148263/rumion-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "MUV" },
  { name: "Innova Crysta", price: 6500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "MUV" },
  { name: "XUV700", price: 6500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/133383/xuv700-exterior-right-front-three-quarter-60.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "SUV" },
  { name: "Hycross", price: 7500, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/145553/innova-hycross-exterior-right-front-three-quarter-63.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "MUV" },
  { name: "Fortuner", price: 9000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-16.jpeg?isig=0&q=80", category: "7-seater", categoryLabel: "SUV" },
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
