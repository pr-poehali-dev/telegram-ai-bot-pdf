import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const Index = () => {
  const [view, setView] = useState<'guest' | 'admin'>('guest');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Здравствуйте! Я виртуальный консьерж отеля. Чем могу помочь? Могу рассказать о номерах, услугах, ресторанах и инфраструктуре.', 
      timestamp: '10:23' 
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const responses = [
        'В отеле доступны номера категорий Standard, Deluxe и Suite. Все номера оборудованы кондиционером, мини-баром и Wi-Fi.',
        'Завтрак подается в ресторане на 1 этаже с 7:00 до 11:00. Шведский стол включает горячие блюда, выпечку и фрукты.',
        'SPA-центр работает с 9:00 до 22:00. Доступны массаж, сауна, хаммам и бассейн. Запись по телефону ресепшн.',
        'Парковка бесплатная для гостей отеля, расположена на подземном уровне. Въезд с западной стороны здания.'
      ];
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 1200);
  };

  const quickQuestions = [
    { icon: 'Bed', text: 'Типы номеров', question: 'Какие типы номеров доступны?' },
    { icon: 'UtensilsCrossed', text: 'Завтрак', question: 'Во сколько завтрак?' },
    { icon: 'Wifi', text: 'Wi-Fi', question: 'Как подключиться к Wi-Fi?' },
    { icon: 'Dumbbell', text: 'Фитнес', question: 'Есть ли тренажерный зал?' },
    { icon: 'Car', text: 'Парковка', question: 'Где находится парковка?' },
    { icon: 'Sparkles', text: 'SPA', question: 'Расскажите про SPA-центр' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-4 lg:p-8 max-w-6xl">
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="Hotel" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Hotel Concierge</h1>
                <p className="text-slate-600 text-sm">Виртуальный помощник гостей</p>
              </div>
            </div>
            <Button 
              variant={view === 'admin' ? 'default' : 'outline'}
              onClick={() => setView(view === 'guest' ? 'admin' : 'guest')}
              className="gap-2"
            >
              <Icon name={view === 'admin' ? 'Users' : 'Settings'} size={18} />
              {view === 'admin' ? 'Для гостей' : 'Админ-панель'}
            </Button>
          </div>
        </header>

        {view === 'guest' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-xl animate-scale-in h-[calc(100vh-200px)]">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MessageCircle" size={20} />
                    Чат с консьержем
                  </CardTitle>
                  <CardDescription>Спросите о номерах, услугах и инфраструктуре</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(100%-100px)]">
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'assistant' ? 'bg-primary' : 'bg-slate-300'
                          }`}>
                            {msg.role === 'assistant' ? (
                              <Icon name="ConciergeBell" size={16} className="text-white" />
                            ) : (
                              <Icon name="User" size={16} className="text-slate-700" />
                            )}
                          </div>
                          <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`inline-block px-4 py-3 rounded-2xl max-w-[85%] ${
                              msg.role === 'assistant'
                                ? 'bg-slate-100 text-slate-900'
                                : 'bg-primary text-white'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 px-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t bg-slate-50/50">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Задайте вопрос..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-white"
                      />
                      <Button onClick={handleSendMessage} size="icon" className="flex-shrink-0">
                        <Icon name="Send" size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-xl animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="Lightbulb" size={18} />
                    Быстрые вопросы
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((q, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto py-3 px-3 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-primary transition-all"
                        onClick={() => {
                          setInputMessage(q.question);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        <Icon name={q.icon as any} size={20} className="text-primary" />
                        <span className="text-xs font-medium text-center">{q.text}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="Info" size={18} />
                    Контакты
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="Phone" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Ресепшн</p>
                      <p className="text-slate-600">+7 (495) 123-45-67</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="Mail" size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <p className="text-slate-600">info@hotel.ru</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon name="MapPin" size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Адрес</p>
                      <p className="text-slate-600">Москва, ул. Примерная, 1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">5</p>
                      <p className="text-xs text-slate-600">Документов</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="Users" size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">342</p>
                      <p className="text-xs text-slate-600">Запросов гостей</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">94%</p>
                      <p className="text-xs text-slate-600">Точность</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Icon name="Zap" size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">1.8с</p>
                      <p className="text-xs text-slate-600">Ср. ответ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Upload" size={20} />
                    Загрузка документов
                  </CardTitle>
                  <CardDescription>Добавьте PDF с информацией об отеле</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon name="Upload" size={24} className="text-primary" />
                    </div>
                    <p className="font-medium text-slate-900 mb-1">Выберите PDF файл</p>
                    <p className="text-sm text-slate-600">или перетащите сюда</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Library" size={20} />
                    База знаний
                  </CardTitle>
                  <CardDescription>Документы отеля</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[320px]">
                    <div className="p-4 space-y-2">
                      {[
                        { name: 'Описание номеров.pdf', size: '3.2 MB', category: 'Номера' },
                        { name: 'Меню ресторана.pdf', size: '1.5 MB', category: 'Питание' },
                        { name: 'SPA услуги.pdf', size: '2.1 MB', category: 'Услуги' },
                        { name: 'Правила отеля.pdf', size: '0.8 MB', category: 'Правила' },
                        { name: 'Инфраструктура.pdf', size: '4.3 MB', category: 'Общая' },
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all animate-fade-in"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon name="FileText" size={18} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-slate-900 truncate">{doc.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700">{doc.category}</span>
                                <span className="text-xs text-slate-600">{doc.size}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                              <Icon name="Trash2" size={16} className="text-slate-400" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
