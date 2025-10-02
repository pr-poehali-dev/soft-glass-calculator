import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const ContactsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="MapPin" className="mr-2" />
              Контактная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Phone" className="text-primary" />
              <div>
                <p className="font-medium">+7 (921) 636-36-08</p>
                <p className="text-sm text-gray-600">Звонки с 9:00 до 18:00</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Icon name="Mail" className="text-primary" />
              <div>
                <p className="font-medium">info@polymer-project.ru</p>
                <p className="text-sm text-gray-600">Ответим в течение часа</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" className="text-primary mt-1" />
              <div>
                <p className="font-medium">г. Санкт-Петербург, ул. Уральская, д. 1</p>
                <p className="text-sm text-gray-600">Офис и производство</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Icon name="Clock" className="text-primary" />
              <div>
                <p className="font-medium">Пн-Пт: 9:00-18:00</p>
                <p className="text-sm text-gray-600">Сб-Вс: по договоренности</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Заказать звонок</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Ваше имя</Label>
              <Input id="name" placeholder="Введите ваше имя" />
            </div>
            
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" placeholder="+7 (___) ___-__-__" />
            </div>
            
            <div>
              <Label htmlFor="message">Сообщение</Label>
              <Textarea id="message" placeholder="Опишите ваши требования" rows={3} />
            </div>
            
            <Button className="w-full">
              <Icon name="Phone" className="mr-2" />
              Заказать звонок
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactsTab;
