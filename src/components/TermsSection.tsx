import { FileText, Wallet, CreditCard, Fuel } from "lucide-react";

const terms = [
  {
    icon: FileText,
    title: "Documents Required",
    description: "Aadhaar, Driving License, Voter ID, PAN Card",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Wallet,
    title: "Security Deposit",
    description: "2-wheeler with RC OR ₹10,000 refundable deposit",
    color: "bg-electric/10 text-electric",
  },
  {
    icon: CreditCard,
    title: "Advance Payment",
    description: "₹2000 (Non-refundable, deducted from trip)",
    color: "bg-whatsapp/10 text-whatsapp",
  },
  {
    icon: Fuel,
    title: "Fuel & Toll",
    description: "Excluded from rental charges – paid by customer",
    color: "bg-destructive/10 text-destructive",
  },
];

const TermsSection = () => {
  return (
    <section id="terms" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Good to Know
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Terms & Conditions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent policies with no hidden surprises. What you see is what you get.
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {terms.map((term) => (
            <div
              key={term.title}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${term.color}`}>
                <term.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                {term.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {term.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            * All prices are for 24 hours with a 300km limit. Extra km charged at ₹10/km.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
