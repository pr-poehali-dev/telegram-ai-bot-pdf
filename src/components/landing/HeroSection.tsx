import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOrderClick: () => void;
}

export const HeroSection = ({ onOrderClick }: HeroSectionProps) => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          AI-консультант для вашего бизнеса
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Умный чат-бот, который знает всё о вашей компании и отвечает на вопросы клиентов 24/7
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={onOrderClick} className="text-lg px-8">
            Заказать чат-бота
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Посмотреть демо
          </Button>
        </div>
      </div>
    </div>
  );
};
