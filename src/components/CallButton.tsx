import { Phone } from "lucide-react";

const CallButton = () => {
  return (
    <a
      href="tel:+919448277091"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3.5 rounded-full font-semibold shadow-lg animate-pulse-glow transition-all duration-300 hover:scale-105"
    >
      <Phone className="w-6 h-6" />
      <span className="hidden sm:inline">Call Now</span>
    </a>
  );
};

export default CallButton;
