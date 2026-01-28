import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Loader2, 
  Search, 
  SlidersHorizontal, 
  Car, 
  Users, 
  Fuel, 
  ArrowUpDown,
  Grid3X3,
  LayoutGrid,
  X,
  ChevronDown
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CarCardCarousel from "@/components/CarCardCarousel";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

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
type FuelType = "all" | "Petrol" | "Diesel";
type TransmissionType = "all" | "Manual" | "Automatic" | "Manual & Automatic";
type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";
type GridView = "compact" | "comfortable";

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
  price3Days: number | null;
  price7Days: number | null;
  price15Days: number | null;
  price30Days: number | null;
  extraKmCharge: number;
  isAvailable: boolean;
}

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [fuelType, setFuelType] = useState<FuelType>("all");
  const [transmissionType, setTransmissionType] = useState<TransmissionType>("all");
  const [sortOption, setSortOption] = useState<SortOption>("price-asc");
  const [gridView, setGridView] = useState<GridView>("comfortable");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
          price3Days: car.price_3_days,
          price7Days: car.price_7_days,
          price15Days: car.price_15_days,
          price30Days: car.price_30_days,
          extraKmCharge: car.extra_km_charge,
          isAvailable: (car as any).is_available ?? true,
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Get unique brands for stats
  const uniqueBrands = useMemo(() => {
    return [...new Set(cars.map(car => car.brand))];
  }, [cars]);

  // Filter and sort cars (only show available cars by default)
  const filteredCars = useMemo(() => {
    let result = cars.filter(car => car.isAvailable);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(car => 
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.categoryLabel.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter(car => car.category === activeCategory);
    }

    // Fuel filter
    if (fuelType !== "all") {
      result = result.filter(car => car.fuel === fuelType);
    }

    // Transmission filter
    if (transmissionType !== "all") {
      result = result.filter(car => 
        car.transmission.includes(transmissionType.replace(" & Automatic", "")) ||
        car.transmission === transmissionType
      );
    }

    // Sort
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [cars, searchQuery, activeCategory, fuelType, transmissionType, sortOption]);

  const activeFiltersCount = [
    activeCategory !== "all",
    fuelType !== "all",
    transmissionType !== "all"
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setActiveCategory("all");
    setFuelType("all");
    setTransmissionType("all");
    setSearchQuery("");
  };

  const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Cars", icon: <Car className="w-4 h-4" /> },
    { key: "5-Seater", label: "5-Seater", icon: <Users className="w-4 h-4" /> },
    { key: "7-Seater", label: "7-Seater", icon: <Users className="w-4 h-4" /> },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Seating Capacity</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Fuel Type</h4>
        <div className="flex flex-wrap gap-2">
          {(["all", "Petrol", "Diesel"] as FuelType[]).map((fuel) => (
            <button
              key={fuel}
              onClick={() => setFuelType(fuel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                fuelType === fuel
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              <Fuel className="w-4 h-4" />
              {fuel === "all" ? "All Fuels" : fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Transmission</h4>
        <div className="flex flex-wrap gap-2">
          {(["all", "Manual", "Automatic"] as TransmissionType[]).map((trans) => (
            <button
              key={trans}
              onClick={() => setTransmissionType(trans)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                transmissionType === trans
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {trans === "all" ? "All Types" : trans}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full mt-4"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-gold/5 py-12 md:py-16 border-b border-border/50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Car className="w-3 h-3 mr-1" />
                {cars.length} Cars Available
              </Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Find Your Perfect Ride
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Premium self-drive cars from {uniqueBrands.length}+ trusted brands. 
                Starting at just ₹{Math.min(...cars.map(c => c.price)) || 2500}/day.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by car name, brand, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-xl border-2 border-border focus:border-primary bg-card shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls Bar */}
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-4">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Quick Filters (Desktop) */}
              <div className="hidden lg:flex items-center gap-2">
                {categories.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === key
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden relative">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle>Filter Cars</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-2">
                <Select value={fuelType} onValueChange={(v) => setFuelType(v as FuelType)}>
                  <SelectTrigger className="w-[130px] bg-secondary/50">
                    <Fuel className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Fuel" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    <SelectItem value="all">All Fuels</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={transmissionType} onValueChange={(v) => setTransmissionType(v as TransmissionType)}>
                  <SelectTrigger className="w-[150px] bg-secondary/50">
                    <SelectValue placeholder="Transmission" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Right: Sort & View */}
              <div className="flex items-center gap-2 ml-auto">
                <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                  <SelectTrigger className="w-[160px] bg-secondary/50">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setGridView("compact")}
                    className={`p-2 transition-colors ${
                      gridView === "compact" ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"
                    }`}
                    title="Compact view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridView("comfortable")}
                    className={`p-2 transition-colors ${
                      gridView === "comfortable" ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"
                    }`}
                    title="Comfortable view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCars.length}</span> of {cars.length} cars
            </p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Results for "<span className="font-semibold text-foreground">{searchQuery}</span>"
              </p>
            )}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="container pb-16 md:pb-24">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading our fleet...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Car className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find any cars matching your criteria. Try adjusting your filters or search query.
              </p>
              <Button onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div 
              className={`grid gap-4 md:gap-6 ${
                gridView === "compact" 
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                  : "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {filteredCars.map((car, index) => (
                <div 
                  key={car.id} 
                  data-aos="fade-up" 
                  data-aos-delay={Math.min(index * 50, 300)}
                >
                  <CarCardCarousel
                    name={car.name}
                    price={car.price}
                    image={car.image}
                    images={car.images}
                    category={car.categoryLabel}
                    transmission={car.transmission}
                    fuel={car.fuel}
                    isAvailable={car.isAvailable}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          {!isLoading && filteredCars.length > 0 && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 via-gold/5 to-primary/5 rounded-2xl border border-border/50">
              <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
                Need Help Choosing?
              </h3>
              <p className="text-muted-foreground mb-6">
                Call us for personalized recommendations and the best deals on long-term rentals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+919448277091"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg"
                >
                  Call Now: +91 94482 77091
                </a>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-charcoal font-semibold rounded-xl transition-all"
                >
                  View Full Price List
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cars;
