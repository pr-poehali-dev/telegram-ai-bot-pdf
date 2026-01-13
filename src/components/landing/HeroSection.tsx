import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  onOrderClick: () => void;
}

export const HeroSection = ({ }: HeroSectionProps) => {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-5xl mx-auto">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
          <p className="text-sm font-semibold text-primary flex items-center gap-2">
            <Icon name="Sparkles" size={16} />
            Уже 247 компаний автоматизировали общение с клиентами
          </p>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
          Перестаньте терять клиентов
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> из-за долгих ответов</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-консультант отвечает за 3 секунды. Работает 24/7. Знает ВСЁ о вашем бизнесе. Не берёт отпуск и не просит зарплату.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" onClick={scrollToPricing} className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all">
            <Icon name="Zap" className="mr-2" size={20} />
            Запустить за 1 день
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-10 py-6" asChild>
            <a href="https://ai-ru.ru/demo" target="_blank" rel="noopener">
              <Icon name="Play" className="mr-2" size={20} />
              Посмотреть демо
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-primary mb-1">97%</div>
            <div className="text-sm text-slate-600">точность ответов</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-primary mb-1">&lt;3 сек</div>
            <div className="text-sm text-slate-600">среднее время ответа</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-slate-600">без выходных</div>
          </div>
        </div>
      </div>
    </div>
  );
};