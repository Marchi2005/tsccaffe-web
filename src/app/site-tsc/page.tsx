import Hero from "./components/home/Hero";
import Services from "./components/home/Services";
import MapSection from "./components/home/MapSection";
import ScrollToTop from "./components/home/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative max-w-[100vw] overflow-x-hidden">
      <main className="flex-grow">
        <Hero />
        <Services />
        <MapSection />
      </main>
      <ScrollToTop />
    </div>
  );
}