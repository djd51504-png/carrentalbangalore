import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CreditCard, Smartphone, Banknote, Phone } from "lucide-react";

const cars = [
  { name: "Swift", category: "Hatchback", seats: 5, price: 2500, fuel: "Petrol" },
  { name: "Baleno", category: "Hatchback", seats: 5, price: 3000, fuel: "Petrol" },
  { name: "Glanza", category: "Hatchback", seats: 5, price: 3000, fuel: "Petrol" },
  { name: "Punch", category: "SUV", seats: 5, price: 3000, fuel: "Petrol" },
  { name: "i20", category: "Hatchback", seats: 5, price: 3000, fuel: "Petrol" },
  { name: "Polo", category: "Hatchback", seats: 5, price: 3000, fuel: "Petrol" },
  { name: "Brezza", category: "SUV", seats: 5, price: 3500, fuel: "Petrol" },
  { name: "Fronx", category: "SUV", seats: 5, price: 3500, fuel: "Petrol" },
  { name: "Sonet", category: "SUV", seats: 5, price: 3500, fuel: "Petrol" },
  { name: "Creta", category: "SUV", seats: 5, price: 4000, fuel: "Petrol" },
  { name: "Seltos", category: "SUV", seats: 5, price: 4500, fuel: "Petrol" },
  { name: "Thar", category: "SUV", seats: 5, price: 6500, fuel: "Diesel" },
  { name: "Thar Roxx", category: "SUV", seats: 5, price: 8000, fuel: "Petrol" },
  { name: "Ertiga", category: "MUV", seats: 7, price: 4000, fuel: "Petrol" },
  { name: "Innova", category: "MUV", seats: 7, price: 4000, fuel: "Diesel" },
  { name: "XUV500", category: "SUV", seats: 7, price: 4000, fuel: "Petrol" },
  { name: "Rumion", category: "MUV", seats: 7, price: 4500, fuel: "Petrol" },
  { name: "Innova Crysta", category: "MUV", seats: 7, price: 6500, fuel: "Diesel" },
  { name: "XUV700", category: "SUV", seats: 7, price: 6500, fuel: "Petrol" },
  { name: "Hycross", category: "MUV", seats: 7, price: 7500, fuel: "Petrol" },
  { name: "Fortuner", category: "SUV", seats: 7, price: 9000, fuel: "Petrol" },
];

const Pricing = () => {
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
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card mb-10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left py-4 px-6 font-heading font-semibold text-foreground">Car Model</th>
                    <th className="text-left py-4 px-6 font-heading font-semibold text-foreground">Type</th>
                    <th className="text-center py-4 px-6 font-heading font-semibold text-foreground">Seats</th>
                    <th className="text-center py-4 px-6 font-heading font-semibold text-foreground">Fuel</th>
                    <th className="text-right py-4 px-6 font-heading font-semibold text-foreground">Price/Day</th>
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
                      <td className="py-4 px-6">
                        <span className="font-semibold text-foreground">{car.name}</span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{car.category}</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">{car.seats}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          car.fuel === "Diesel" 
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {car.fuel}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-heading font-bold text-lg text-primary">₹{car.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
