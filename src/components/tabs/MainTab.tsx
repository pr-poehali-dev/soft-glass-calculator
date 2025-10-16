import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface MainTabProps {
  onNavigateToCalculator: () => void;
}

const MainTab: React.FC<MainTabProps> = ({ onNavigateToCalculator }) => {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Производство мягких окон
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Профессиональное изготовление прозрачных защитных конструкций
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onNavigateToCalculator}>
            <Icon name="Calculator" className="mr-2" />
            Рассчитать стоимость
          </Button>
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Icon name="Phone" className="mr-2" />
            Заказать консультацию
          </Button>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto mb-12">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://cdn.poehali.dev/files/26ee1f36-1533-46af-bfd4-f4c5ab65cd32.jpg" 
            alt="Мягкие окна на деревянной террасе - пример готового проекта" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Готовый проект</h3>
            <p className="text-lg opacity-90">Мягкие окна на деревянной террасе с металлическими люверсами</p>
          </div>
          <div className="absolute top-6 right-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Icon name="CheckCircle" size={16} className="mr-1" />
              Установлено
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 hover:shadow-xl transition-all">
          <CardHeader>
            <Icon name="Shield" size={40} className="text-blue-600 mb-2" />
            <CardTitle className="text-gray-900">Качество</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Используем только высококачественную ПВХ пленку европейского производства</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-xl transition-all">
          <CardHeader>
            <Icon name="Clock" size={40} className="text-blue-600 mb-2" />
            <CardTitle className="text-gray-900">Скорость</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Изготовление от 1 до 5 рабочих дней в зависимости от сложности заказа</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-xl transition-all">
          <CardHeader>
            <Icon name="Award" size={40} className="text-blue-600 mb-2" />
            <CardTitle className="text-gray-900">Гарантия</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Предоставляем гарантию 2 года на все изготавливаемые конструкции</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainTab;