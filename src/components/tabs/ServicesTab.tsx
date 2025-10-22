import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const ServicesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши услуги</h2>
        <p className="text-gray-600">Полный спектр услуг по изготовлению мягких окон</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Типы ПВХ пленки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="font-medium">Прозрачная ПВХ</h4>
              <p className="text-sm text-gray-600">Стандартная прозрачная пленка толщиной 0,5-0,8 мм</p>
              <Badge className="mt-1">700 ₽/м²</Badge>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-medium">Тонированная ПВХ</h4>
              <p className="text-sm text-gray-600">Пленка с тонировкой различных оттенков</p>
              <Badge className="mt-1">700 ₽/м²</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Фурнитура</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-medium flex items-center">
                <Icon name="Circle" size={16} className="mr-2 text-accent" />
                Люверсы 16мм
              </h4>
              <p className="text-sm text-gray-600">Металлические кольца диаметром 16мм для надежного крепления</p>
              <Badge className="mt-1">40 ₽/шт</Badge>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <h4 className="font-medium flex items-center">
                <Icon name="Circle" size={16} className="mr-2 text-orange-500" />
                Кольцевые люверсы
              </h4>
              <p className="text-sm text-gray-600">Боковые люверсы для дополнительного крепления</p>
              <Badge className="mt-1">55 ₽/шт</Badge>
            </div>
            <div className="p-3 bg-red-50 rounded">
              <h4 className="font-medium flex items-center">
                <Icon name="Lock" size={16} className="mr-2 text-destructive" />
                Скобы поворотные
              </h4>
              <p className="text-sm text-gray-600">Система быстрого открывания</p>
              <Badge className="mt-1">75 ₽/шт</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Дополнительно</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="font-medium">Кант ПВХ 50мм</h4>
              <p className="text-sm text-gray-600">25мм с каждой стороны по периметру окна</p>
              <Badge className="mt-1">75 ₽/м</Badge>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-medium">Замер на объекте</h4>
              <p className="text-sm text-gray-600">Выезд специалиста для точных замеров</p>
              <Badge className="mt-1">2000 ₽</Badge>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <h4 className="font-medium">Установка</h4>
              <p className="text-sm text-gray-600">Профессиональный монтаж</p>
              <Badge className="mt-1">200 ₽/м²</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesTab;