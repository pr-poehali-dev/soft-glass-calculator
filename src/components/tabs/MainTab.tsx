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
        <h2 className="text-4xl font-bold text-white mb-4">
          Производство мягких окон
        </h2>
        <p className="text-xl text-white/80 mb-8">
          Профессиональное изготовление прозрачных защитных конструкций
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={onNavigateToCalculator}>
          <Icon name="Calculator" className="mr-2" />
          Рассчитать стоимость
        </Button>
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
        <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/25 transition-all hover:shadow-xl">
          <CardHeader>
            <Icon name="Shield" size={40} className="text-cyan-300 mb-2" />
            <CardTitle className="text-white">Качество</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">Используем только высококачественную ПВХ пленку европейского производства</p>
          </CardContent>
        </Card>

        <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/25 transition-all hover:shadow-xl">
          <CardHeader>
            <Icon name="Clock" size={40} className="text-purple-300 mb-2" />
            <CardTitle className="text-white">Скорость</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">Изготовление от 1 до 5 рабочих дней в зависимости от сложности заказа</p>
          </CardContent>
        </Card>

        <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/25 transition-all hover:shadow-xl">
          <CardHeader>
            <Icon name="Award" size={40} className="text-cyan-300 mb-2" />
            <CardTitle className="text-white">Гарантия</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">Предоставляем гарантию 2 года на все изготавливаемые конструкции</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainTab;
