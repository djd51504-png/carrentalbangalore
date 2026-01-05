import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Our Cars" },
    { href: "/pricing", label: "Pricing" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo with tagline */}
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Key2Go Logo" className="h-10 md:h-14 w-auto" />
          <div>
            <h1 className="font-heading font-bold text-sm md:text-xl text-foreground leading-tight">
              Car Rental Bangalore
            </h1>
            <p className="text-[10px] md:text-xs text-gold font-medium">Nimma Trip Namma Car</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20know%20more%20about%20Key2Go%20car%20rentals."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-button text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-button hover:opacity-90 transition-opacity"
          >
            Contact Us
          </a>
        </nav>

        {/* Mobile: Right side - Menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40">
          <nav className="container flex flex-col py-6 space-y-1 bg-background">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium py-4 px-4 rounded-xl transition-all ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <a
                href="https://wa.me/919448277091?text=Hi%20Vikas,%20I%20want%20to%20know%20more%20about%20Key2Go%20car%20rentals."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-whatsapp text-primary-foreground py-4 rounded-xl text-lg font-semibold"
              >
                Contact Us on WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
