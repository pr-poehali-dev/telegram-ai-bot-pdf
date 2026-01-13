import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const FeaturesSection = () => {
  const features = [
    {
      icon: 'MessageCircle',
      title: 'Работает 24/7',
      description: 'Отвечает на вопросы клиентов в любое время суток без выходных и праздников',
      bgColor: 'bg-blue-100',
      iconColor: 'text-primary'
    },
    {
      icon: 'Brain',
      title: 'Знает ваш бизнес',
      description: 'Обучен на ваших документах: прайсах, правилах, описаниях услуг',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: 'Zap',
      title: 'Быстрая интеграция',
      description: 'Готов к работе за 1 день. Встраивается на любой сайт одной строкой кода',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: 'Shield',
      title: 'Безопасность данных',
      description: 'Все данные хранятся в России, соответствие 152-ФЗ',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: 'Settings',
      title: 'Гибкая настройка',
      description: 'Настройте тон общения, дизайн виджета и правила ответов под себя',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: 'BarChart',
      title: 'Аналитика',
      description: 'Статистика вопросов, качество ответов, популярные темы',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
        Почему AI-консультант?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 text-center">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon name={feature.icon as any} size={32} className={feature.iconColor} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
