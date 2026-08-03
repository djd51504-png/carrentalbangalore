import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const WhatsAppButton = () => {
  return (
    <a
      href={buildWhatsAppLink("Hi Vikas, I want to book a car from Car Rental Bengaluru.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground px-5 py-3.5 rounded-full font-semibold shadow-lg animate-pulse-glow transition-all duration-300 hover:scale-105"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline">Book on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
