import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const PortfolioTab: React.FC = () => {
  const projects = [
    { img: '/img/1f0cdb80-d24a-4c4d-aae3-2fa47ab4b79a.jpg', title: 'Деревянная терраса', desc: 'Частный дом, 24 м²', badge: 'Люверсы', year: '2023' },
    { img: '/img/030dde9c-1053-4d06-ae96-48a660afbcda.jpg', title: 'Ресторан "Вилла"', desc: 'Летняя терраса, 48 м²', badge: 'Французские замки', year: '2023' },
    { img: '/img/12a3c78a-02a5-4344-84cb-630e3b321bb1.jpg', title: 'Складской комплекс', desc: 'Промышленное здание, 120 м²', badge: 'Большие размеры', year: '2024' },
    { img: '/img/1988cf49-6d49-4dbb-a464-0b5444f7b9e7.jpg', title: 'Кафе "Уют"', desc: 'Зимняя веранда, 32 м²', badge: 'Утепленные', year: '2024' },
    { img: '/img/b753cc35-620e-4299-975b-7e963f4b67be.jpg', title: 'Яхт-клуб "Neva"', desc: 'Морская пристань, 85 м²', badge: 'Морская среда', year: '2024' }
  ];

  const reviews = [
    { text: 'Отличное качество! Мягкие окна на террасе служат уже второй год. Никаких протечек, швы крепкие. Монтаж выполнили быстро и аккуратно.', author: 'Александр П.', location: 'Частный дом, Павловск', bg: 'bg-blue-50' },
    { text: 'Для нашего ресторана заказывали мягкие окна на летнюю веранду. Клиенты довольны - теперь можно сидеть даже в дождь. Рекомендую!', author: 'Елена В.', location: 'Ресторан "Вилла"', bg: 'bg-green-50' },
    { text: 'Заказывали промышленные окна для склада. Размеры большие, но справились на отлично. Теперь товары защищены от дождя.', author: 'Михаил С.', location: 'ООО "Логистика-СПб"', bg: 'bg-purple-50' },
    { text: 'Профессиональный подход! Сделали точные замеры, предложили оптимальное решение. Работают быстро и качественно.', author: 'Ольга К.', location: 'Кафе "Уют"', bg: 'bg-orange-50' },
    { text: 'Мягкие окна для яхт-клуба получились отличные! Выдерживают морской климат, соленый воздух. Очень довольны.', author: 'Дмитрий Н.', location: 'Яхт-клуб "Neva"', bg: 'bg-indigo-50' },
    { text: 'Заказываем уже не первый раз. Качество стабильно высокое, цены адекватные. Лучшая компания в Петербурге!', author: 'Сергей Т.', location: 'Строительная компания', bg: 'bg-pink-50' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-white mb-4">Наши проекты</h2>
        <p className="text-xl text-white/90 mb-6">Более 500 успешно реализованных объектов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img src={project.img} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{project.desc}</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{project.badge}</Badge>
                <span className="text-sm text-gray-500">{project.year}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-blue-100 to-green-100 w-full h-48 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Home" size={48} className="text-blue-600 mb-2 mx-auto" />
              <p className="text-gray-600">Загородный дом</p>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Дом в Павловске</h3>
            <p className="text-gray-600 text-sm mb-3">Беседка и терраса, 28 м²</p>
            <div className="flex justify-between items-center">
              <Badge variant="outline">Комбинированные</Badge>
              <span className="text-sm text-gray-500">2024</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-white mb-4">
            <Icon name="MessageSquare" className="mr-2 inline" />
            Отзывы наших клиентов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className={`${review.bg} p-4 rounded-lg`}>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {"★★★★★".split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3 italic">{review.text}</p>
                <div className="text-sm">
                  <p className="font-medium">{review.author}</p>
                  <p className="text-gray-500">{review.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
              <Icon name="Phone" className="mr-2" />
              Заказать консультацию
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;
