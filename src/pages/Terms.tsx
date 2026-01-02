import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FileText, Shield, User, Car, AlertTriangle, Phone } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-28 pb-16 md:pb-24">
        <div className="container max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-sm font-semibold text-gold uppercase tracking-wider mb-2">
              Legal Information
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Terms and Conditions of Car Rental Bengaluru
            </h1>
            <p className="text-muted-foreground">
              Please read these terms carefully before booking your vehicle.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1: Booking & Payment */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                    1. Booking & Payment
                  </h2>
                  <p className="text-sm text-muted-foreground">Payment terms and booking requirements</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Booking is confirmed only after a <strong className="text-gold">₹1000 advance payment</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>We accept Credit Cards, Debit Cards, UPI, and Cash.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Valid driving license and government ID proof are mandatory.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>The customer must be at least <strong>20 years old</strong> to rent a car.</span>
                </li>
              </ul>
            </section>

            {/* Section 2: Security Deposit */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                    2. Security Deposit
                  </h2>
                  <p className="text-sm text-muted-foreground">Deposit requirements and refund policy</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>A <strong>refundable security deposit</strong> must be paid at the time of booking.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>The deposit will be refunded after vehicle inspection, provided there is no damage, traffic fine, or pending payment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Security deposit options: 2-wheeler with RC or ₹10,000 cash deposit.</span>
                </li>
              </ul>
            </section>

            {/* Section 3: Customer Responsibility */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                    3. Responsibility of the Customer
                  </h2>
                  <p className="text-sm text-muted-foreground">Your obligations during the rental period</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>The customer is responsible for <strong>fuel, tolls, parking, and traffic fines</strong> during the rental period.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>The customer must return the car at the agreed time and location. <strong>Late returns may attract extra charges.</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>The customer is responsible for any damage, accident, or loss caused during the rental period due to careless driving or violation of rules.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Daily limit: <strong>300 km</strong>. Extra kilometers will be charged at ₹10/km.</span>
                </li>
              </ul>
            </section>

            {/* Section 4: Insurance & Accidents */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                    4. Insurance & Accidents
                  </h2>
                  <p className="text-sm text-muted-foreground">Coverage and incident reporting</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>All cars are covered with <strong>basic insurance</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>In case of an accident, the customer must <strong>inform the company immediately</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Insurance will <strong>not cover damages</strong> caused due to drunk driving or reckless behavior.</span>
                </li>
              </ul>
            </section>

            {/* Section 5: Important Notice */}
            <section className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                    5. Important Notice
                  </h2>
                  <p className="text-sm text-muted-foreground">Please be aware of these restrictions</p>
                </div>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span><strong>No smoking</strong> inside the vehicle.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span><strong>No pets</strong> allowed inside the vehicle.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span>Vehicle should not be used for any <strong>illegal activities</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span>Subletting the vehicle to third parties is <strong>strictly prohibited</strong>.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Have questions about our terms? We're happy to help.
            </p>
            <a
              href="tel:+919448277091"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-button text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;
