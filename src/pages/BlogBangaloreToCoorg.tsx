import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Route, MapPin, Clock, Fuel, Car, Coffee, Camera, AlertTriangle, MessageCircle, CheckCircle2 } from "lucide-react";

const BlogBangaloreToCoorg = () => {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bangalore to Coorg Road Trip Guide by Self Drive Car",
    description:
      "Plan the perfect Bangalore to Coorg road trip: best routes, distance, drive time, places to visit in Coorg, and tips for choosing the right self drive rental car.",
    author: { "@type": "Organization", name: "Car Rental Bengaluru" },
    publisher: { "@type": "Organization", name: "Car Rental Bengaluru" },
    mainEntityOfPage: "https://carrentalbangalore.lovable.app/blog/bangalore-to-coorg-road-trip",
    inLanguage: "en-IN",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://carrentalbangalore.lovable.app/" },
      { "@type": "ListItem", position: 2, name: "Bangalore to Coorg Road Trip", item: "https://carrentalbangalore.lovable.app/blog/bangalore-to-coorg-road-trip" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Bangalore to Coorg Road Trip Guide | Self Drive Car Rental Bengaluru"
        description="Bangalore to Coorg by self drive car: ~265 km via Mysore, best routes, drive time, top places like Abbey Falls & Raja's Seat, and the right rental car for the ghats."
        path="/blog/bangalore-to-coorg-road-trip"
        type="article"
        jsonLd={[articleLd, breadcrumbLd]}
      />
      <Header />

      <main className="pt-24 md:pt-28 pb-16 md:pb-24">
        <div className="container max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-sm font-semibold text-gold uppercase tracking-wider mb-2">
              Road Trip Guide
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Bangalore to Coorg by Self Drive Car
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Misty coffee estates, winding ghat roads and one of South India's best weekend drives.
              Here's everything you need to plan the perfect Bangalore to Coorg road trip.
            </p>
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Route, label: "Distance", value: "~265 km" },
              { icon: Clock, label: "Drive Time", value: "5.5 – 6.5 hrs" },
              { icon: Fuel, label: "Route", value: "Via Mysore (NH275)" },
              { icon: Car, label: "Ideal Days", value: "2 – 3 days" },
            ].map((f) => (
              <div key={f.label} className="bg-card rounded-2xl border border-border p-4 text-center">
                <f.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{f.label}</p>
                <p className="font-semibold text-foreground text-sm mt-1">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {/* Route options */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-3">
                <Route className="w-6 h-6 text-primary" /> Best Routes from Bangalore
              </h2>
              <div className="space-y-5 text-foreground">
                <div>
                  <h3 className="font-semibold mb-1">Route 1: Via Mysore (Recommended)</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Bangalore → Mysuru Expressway → Hunsur → Kushalnagar → Madikeri. Roughly 265 km and the
                    fastest option. The Bangalore–Mysuru expressway stretch is smooth and quick; after
                    Hunsur the road narrows but stays in good condition.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Route 2: Via Kanakapura & Malavalli (Scenic)</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Bangalore → Kanakapura → Malavalli → Kushalnagar → Madikeri. Slightly longer but quieter,
                    with countryside views. Good if you're starting from South or East Bangalore.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-muted/50 rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Start by 5–6 AM to beat city traffic and reach Coorg by lunch. The expressway has
                    speed cameras — our cars have a 100 km/hr limit, which keeps you safe and fine-free.
                  </p>
                </div>
              </div>
            </section>

            {/* Places to visit */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-3">
                <Camera className="w-6 h-6 text-primary" /> Must-Visit Places in Coorg
              </h2>
              <ul className="space-y-3 text-foreground">
                {[
                  ["Abbey Falls", "A stunning waterfall inside coffee estates, 8 km from Madikeri."],
                  ["Raja's Seat", "Sunset viewpoint in Madikeri with valley views — best in the evening."],
                  ["Dubare Elephant Camp", "On the Kushalnagar route — interact with elephants by the Cauvery river."],
                  ["Namdroling Monastery (Bylakuppe)", "The Golden Temple — one of the largest Tibetan settlements in India."],
                  ["Talacauvery & Bhagamandala", "Birthplace of the river Cauvery, in the Brahmagiri hills."],
                  ["Coffee Estate Walks", "Stay or stop at a plantation — Coorg is India's coffee heartland."],
                ].map(([name, desc]) => (
                  <li key={name} className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      <strong className="text-foreground">{name}</strong>
                      <span className="text-muted-foreground"> — {desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Which car */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-3">
                <Car className="w-6 h-6 text-primary" /> Choosing the Right Car for Coorg
              </h2>
              <ul className="space-y-3 text-sm text-foreground mb-5">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Couples / solo:</strong> a hatchback is fuel-efficient and easy to park in Madikeri's narrow lanes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Families & groups:</strong> a sedan or SUV gives luggage space and comfort on ghat sections.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>KM planning:</strong> the round trip plus local sightseeing is roughly 600–700 km — our
                  300 km/day limit comfortably covers a 2–3 day trip.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Weekend note:</strong> weekend bookings have a 2-day minimum — perfect for a Coorg getaway.</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Explore Our Fleet
                </Link>
                <a
                  href={buildWhatsAppLink("Hi Vikas, I'm planning a Bangalore to Coorg road trip. Which car do you recommend?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-whatsapp/90 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" /> Ask on WhatsApp
                </a>
              </div>
            </section>

            {/* Tips */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-3">
                <Coffee className="w-6 h-6 text-primary" /> Practical Tips
              </h2>
              <ul className="space-y-3 text-sm text-foreground">
                {[
                  "Carry your original driving licence and Aadhaar — required for the rental and often checked on the highway.",
                  "Fuel up before Hunsur; pumps get sparse inside Coorg's estate roads.",
                  "Ghats can be foggy in monsoon (June–September) — drive slow and use fog lamps.",
                  "Best season: October to March for clear skies; monsoon for lush green scenery.",
                  "Book your car early for long weekends — Coorg is Bengaluru's favourite getaway and cars go fast.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogBangaloreToCoorg;
