import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  const location = useLocation();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Our Cars" },
    { href: "/pricing", label: "Pricing" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Key2Go Logo" className="h-12 md:h-14 w-auto" />
          <div className="hidden sm:block">
            <h1 className="font-heading font-bold text-lg md:text-xl text-foreground leading-tight">
              Key2Go
            </h1>
            <p className="text-xs text-muted-foreground">Self Drive Car Rentals</p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-3 md:gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hidden sm:block ${
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
      </div>
    </header>
  );
};

export default Header;
