import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { PricingSection } from './PricingSection';
import { OrderFormSection } from './OrderFormSection';
import { FooterSection } from './FooterSection';

const LandingPage = () => {
  const scrollToForm = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <HeroSection onOrderClick={scrollToForm} />
      <FeaturesSection />
      <PricingSection onPlanSelect={scrollToForm} />
      <OrderFormSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
