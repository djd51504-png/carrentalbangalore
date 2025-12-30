import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Key2Go Logo" className="h-14 w-auto" />
              <div>
                <h3 className="font-heading font-bold text-xl">Key2Go</h3>
                <p className="text-sm text-primary-foreground/70">Self Drive Car Rentals</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Your trusted partner for self-drive car rentals in Bangalore. Premium cars, transparent pricing, and exceptional service.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-electric-light" />
                <a href="tel:+919448277091" className="hover:text-electric-light transition-colors">
                  Vikas | 9448277091
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-5 h-5 text-electric-light" />
                <a href="mailto:vikas@carrentalbanglore.site" className="hover:text-electric-light transition-colors text-sm">
                  vikas@carrentalbanglore.site
                </a>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-electric-light flex-shrink-0 mt-0.5" />
                <span className="text-sm">Pickup and Drop available across Bengaluru</span>
              </li>
            </ul>
          </div>

          {/* Quick Booking */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5">Quick Booking</h4>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Ready to hit the road? Book your car instantly on WhatsApp!
            </p>
            <a
              href="https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20book%20a%20car%20from%20Key2Go."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Book on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Key2Go Self Drive Car Rentals. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Made with <span className="text-electric-light">❤</span> in Bengaluru
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
