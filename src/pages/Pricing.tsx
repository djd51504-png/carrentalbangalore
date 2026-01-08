import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CreditCard, Smartphone, Banknote, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Car {
  name: string;
  category: string;
  seats: number;
  fuel: string;
  transmission: string;
  price: number;
  price3Days: number | null;
  price7Days: number | null;
  price15Days: number | null;
  price30Days: number | null;
}

const Pricing = () => {
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
          name: car.name,
          category: car.category_label || 'Hatchback',
          seats: car.category === '7-Seater' ? 7 : 5,
          fuel: car.fuel,
          transmission: car.transmission,
          price: car.price,
          price3Days: car.price_3_days,
          price7Days: car.price_7_days,
          price15Days: car.price_15_days,
          price30Days: car.price_30_days,
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-28 pb-16 md:pb-24">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block text-sm font-semibold text-gold uppercase tracking-wider mb-2">
              Transparent Pricing
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Full Price List
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All prices are per 24 hours with a 300km daily limit. Extra kilometers charged at ₹10/km.
            </p>
          </div>

          {/* Advance Payment Badge */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border-2 border-gold rounded-xl p-6 text-center">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                Confirm Your Booking
              </h3>
              <p className="text-2xl font-bold text-gold mb-2">
                Just ₹1000 Advance Payment
              </p>
              <p className="text-sm text-muted-foreground">
                Secure your ride with a minimal advance. Balance payable at pickup.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Refundable deposit: ₹10,000 or 2-wheeler with RC card required at pickup
              </p>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card mb-10">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading prices...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left py-4 px-4 font-heading font-semibold text-foreground text-sm">Car Model</th>
                      <th className="text-center py-4 px-2 font-heading font-semibold text-foreground text-sm">Fuel</th>
                      <th className="text-center py-4 px-2 font-heading font-semibold text-foreground text-sm">Transmission</th>
                      <th className="text-right py-4 px-2 font-heading font-semibold text-foreground text-sm">1-2 Days</th>
                      <th className="text-right py-4 px-2 font-heading font-semibold text-foreground text-sm">3-7 Days</th>
                      <th className="text-right py-4 px-2 font-heading font-semibold text-foreground text-sm">8-15 Days</th>
                      <th className="text-right py-4 px-4 font-heading font-semibold text-foreground text-sm">16+ Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car, index) => (
                      <tr 
                        key={car.name} 
                        className={`border-t border-border hover:bg-secondary/30 transition-colors ${
                          index % 2 === 0 ? "" : "bg-secondary/10"
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="font-semibold text-foreground">{car.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({car.seats}-seater)</span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            car.fuel === "Diesel" 
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}>
                            {car.fuel}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {car.transmission}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="font-heading font-bold text-primary">₹{car.price}</span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="font-heading font-bold text-primary">
                            {car.price3Days ? `₹${car.price3Days}` : '-'}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="font-heading font-bold text-primary">
                            {car.price7Days ? `₹${car.price7Days}` : '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-heading font-bold text-gold">
                            {car.price15Days ? `₹${car.price15Days}` : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pricing Notes */}
          <div className="text-center mb-8 text-sm text-muted-foreground">
            <p>* All prices are per day. Prices shown are applied for the entire duration.</p>
            <p>* 300km limit per day. Extra km charged at ₹10/km.</p>
          </div>

          {/* Negotiation Note */}
          <div className="text-center mb-12">
            <p className="text-gold font-semibold text-lg mb-4">
              Prices are negotiable for long-term rentals. Call us for VIP rates!
            </p>
            <a
              href="tel:+919448277091"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-button text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              Call for Best Quote
            </a>
          </div>

          {/* Payment Methods */}
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">
              Accepted Payment Methods
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Credit/Debit</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">UPI (GPay/PhonePe)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Banknote className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Cash</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Pricing;