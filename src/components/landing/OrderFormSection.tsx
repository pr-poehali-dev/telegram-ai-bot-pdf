import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const OrderFormSection = () => {
  return (
    <div id="order-form" className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="pt-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
              Заказать AI-консультанта
            </h2>
            <p className="text-slate-600 mb-8 text-center">
              Оставьте заявку и мы свяжемся с вами в течение часа
            </p>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ivan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+7 999 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Тариф
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Старт (9 990₽/мес)</option>
                  <option>Бизнес (24 990₽/мес)</option>
                  <option>Корпоративный (от 49 990₽/мес)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Комментарий (опционально)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                  placeholder="Расскажите о вашем проекте..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full text-lg">
                Отправить заявку
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
