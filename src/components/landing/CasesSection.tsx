import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const CasesSection = () => {
  const cases = [
    {
      company: 'Интернет-магазин электроники',
      industry: 'E-commerce',
      icon: 'ShoppingCart',
      problem: 'Клиенты уходили из-за долгих ответов на вопросы о характеристиках товаров',
      solution: 'Подключили AI-консультанта с загруженными спецификациями всех товаров',
      results: [
        'Конверсия выросла на 43%',
        'Время ответа снизилось с 4 часов до 3 секунд',
        'Сэкономили 180 000₽/мес на зарплате операторов'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      company: 'Стоматологическая клиника',
      industry: 'Медицина',
      icon: 'Heart',
      problem: 'Администраторы не успевали отвечать на однотипные вопросы о ценах и услугах',
      solution: 'Внедрили AI-бота с прайсом, описаниями услуг и FAQ',
      results: [
        'Количество записей выросло на 67%',
        'Освободили 8 часов/день администраторов',
        'Работа с клиентами 24/7, даже ночью'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      company: 'Агентство недвижимости',
      industry: 'Недвижимость',
      icon: 'Building',
      problem: 'Риэлторы тратили 70% времени на ответы о наличии объектов и условиях',
      solution: 'Настроили AI с базой объектов и автоответами на типовые вопросы',
      results: [
        'Риэлторы экономят 5 часов/день',
        'Лидов стало больше на 89%',
        'Клиенты получают ответы мгновенно'
      ],
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
              <Icon name="TrendingUp" size={16} />
              Реальные результаты наших клиентов
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Как AI-консультант помогает бизнесу
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Компании из разных сфер уже увеличили продажи и сократили расходы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {cases.map((caseItem, index) => (
            <Card key={index} className="hover:shadow-2xl transition-all hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${caseItem.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon name={caseItem.icon as any} size={32} className="text-white" />
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {caseItem.company}
                  </h3>
                  <p className="text-sm text-slate-500">{caseItem.industry}</p>
                </div>
                
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <Icon name="AlertCircle" size={16} />
                    Проблема:
                  </p>
                  <p className="text-sm text-slate-700">{caseItem.problem}</p>
                </div>

                <div className="mb-4 pb-4 border-b border-slate-200">
                  <p className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-2">
                    <Icon name="Lightbulb" size={16} />
                    Решение:
                  </p>
                  <p className="text-sm text-slate-700">{caseItem.solution}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} />
                    Результаты:
                  </p>
                  <ul className="space-y-2">
                    {caseItem.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <Icon name="ArrowRight" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 border-0 shadow-2xl max-w-4xl mx-auto">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Bot" size={40} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Суперворонка-чат: комбо AI + живой менеджер
              </h3>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                AI-консультант квалифицирует клиента, отвечает на базовые вопросы и передаёт "горячего" лида менеджеру. 
                Вы не тратите время на холодные запросы, а работаете только с готовыми к покупке клиентами.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl font-bold text-white mb-1">3x</div>
                  <div className="text-blue-100 text-sm">больше обработанных лидов</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl font-bold text-white mb-1">-70%</div>
                  <div className="text-blue-100 text-sm">времени менеджера на рутину</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-blue-100 text-sm">приём заявок без выходных</div>
                </div>
              </div>
              <a
                href="https://chat.ai-ru.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
              >
                <Icon name="MessageCircle" size={24} />
                Попробовать суперворонку прямо сейчас
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
