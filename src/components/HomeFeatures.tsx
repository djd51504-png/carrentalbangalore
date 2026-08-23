import { ShieldCheck, Wallet, Sparkles, Headphones, CalendarCheck, KeyRound, Car } from "lucide-react";

const FEATURES = [
  { icon: Wallet, title: "Zero Hidden Charges", text: "Transparent per-day pricing. What you see is what you pay." },
  { icon: ShieldCheck, title: "Fully Insured Cars", text: "Every car is insured and inspected before each trip." },
  { icon: Sparkles, title: "Sanitised & Serviced", text: "Deep-cleaned interiors and on-time servicing, always." },
  { icon: Headphones, title: "24/7 Human Support", text: "Real people on WhatsApp and call, any hour of the day." },
];

const STEPS = [
  { icon: CalendarCheck, title: "Pick your dates", text: "Choose pickup & drop time in the availability form." },
  { icon: Car, title: "Choose your car", text: "Compare live prices, KM limits and pickup areas." },
  { icon: KeyRound, title: "Confirm on WhatsApp", text: "Share documents, pay advance, and drive away." },
];

const HomeFeatures = () => {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container">
        {/* Why us */}
        <div className="text-center mb-8 md:mb-12" data-aos="fade-down">
          <span className="eyebrow mb-3">Why Car Rental Bengaluru</span>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-foreground leading-tight">
            Built on <span className="text-gradient">trust</span>, not fine print
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-4 md:p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="font-heading text-sm md:text-lg font-extrabold text-foreground mb-1 leading-tight">
                  {f.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-14 md:mt-20">
          <div className="text-center mb-8 md:mb-12" data-aos="fade-down">
            <span className="eyebrow mb-3">How it works</span>
            <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-foreground leading-tight">
              On the road in <span className="text-gradient">3 simple steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="relative rounded-3xl border border-border bg-card p-5 md:p-7 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <span className="absolute top-4 right-5 font-heading text-4xl md:text-5xl font-extrabold text-primary/10 leading-none select-none">
                  0{i + 1}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-gradient-button flex items-center justify-center mb-4 shadow-button">
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-base md:text-xl font-extrabold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
