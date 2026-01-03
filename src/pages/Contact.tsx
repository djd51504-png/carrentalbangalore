import { MapPin, Phone, MessageCircle, Clock, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const locations = [
  { name: "Hebbal", address: "Near Hebbal Flyover", lat: 13.0358, lng: 77.5970 },
  { name: "Thanisandra", address: "Thanisandra Main Road", lat: 13.0674, lng: 77.6208 },
  { name: "KR Puram", address: "KR Puram Railway Station", lat: 13.0012, lng: 77.6968 },
  { name: "Bellandur", address: "Bellandur Junction", lat: 12.9261, lng: 77.6763 },
  { name: "Haralur", address: "Haralur Road", lat: 12.9150, lng: 77.6750 },
  { name: "Hongasandra", address: "Hongasandra Main Road", lat: 12.8897, lng: 77.6350 },
  { name: "Kengeri", address: "Kengeri Satellite Town", lat: 12.9036, lng: 77.4830 },
  { name: "Nagarabhavi", address: "Nagarabhavi Circle", lat: 12.9600, lng: 77.5100 },
  { name: "Kadugodi", address: "Near Kadugodi Bus Stop", lat: 12.9942, lng: 77.7614 },
];

const Contact = () => {
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.49085453281982!3d12.954517008640543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact <span className="text-gold">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Get in touch with us for bookings, inquiries, or any assistance. 
              We're available across 9 convenient locations in Bengaluru.
            </p>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video w-full">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Key2Go Bangalore Locations"
                className="w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Our <span className="text-gold">Pickup Locations</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <a
                key={location.name}
                href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card border border-border rounded-xl p-5 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-colors">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <a
              href="tel:+919448277091"
              className="group bg-card border border-border rounded-xl p-6 text-center hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
            >
              <div className="inline-flex p-4 bg-gold/10 rounded-full mb-4 group-hover:bg-gold/20 transition-colors">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-gold font-medium">+91 94482 77091</p>
              <p className="text-sm text-muted-foreground mt-1">Click to call directly</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919448277091?text=Hi%2C%20I%20want%20to%20book%20a%20car"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 text-center hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
            >
              <div className="inline-flex p-4 bg-green-500/10 rounded-full mb-4 group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
              <p className="text-green-500 font-medium">+91 94482 77091</p>
              <p className="text-sm text-muted-foreground mt-1">Quick response guaranteed</p>
            </a>

            {/* Hours */}
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="inline-flex p-4 bg-gold/10 rounded-full mb-4">
                <Clock className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Working Hours</h3>
              <p className="text-gold font-medium">24/7 Available</p>
              <p className="text-sm text-muted-foreground mt-1">Pickup & Drop anytime</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border border-gold/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Book Your Ride?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Contact us now for the best rates on premium car rentals in Bengaluru. 
              Prices are negotiable for long-term bookings!
            </p>
            <a
              href="https://wa.me/919448277091?text=Hi%2C%20I%20want%20to%20book%20a%20car"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Book via WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
