import HeroHeader from "../components/servizi/HeroHeader";
import OffersSection from "../components/servizi/OffersSection";
import ShippingSection from "../components/servizi/ShippingSection";
import QuickServices from "../components/servizi/QuickServices";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <main className="flex-grow">
        <HeroHeader />
        <OffersSection />
        <ShippingSection />
        <QuickServices />
      </main>
    </div>
  );
}