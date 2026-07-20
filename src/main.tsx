import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import App from "./App.tsx";
import "./index.css";

AOS.init({
  duration: 800,
  once: true,
  easing: "ease-out-cubic",
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
