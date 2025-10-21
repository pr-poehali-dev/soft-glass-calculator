import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MainTabProps {
  onNavigateToCalculator: () => void;
}

const MainTab: React.FC<MainTabProps> = ({ onNavigateToCalculator }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/7b82e4c1-b1f6-44f5-82a8-362d75543dee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Заявка отправлена!',
          description: 'Мы свяжемся с вами в ближайшее время'
        });
        setIsDialogOpen(false);
        setName('');
        setPhone('');
      } else {
        toast({
          title: 'Ошибка отправки',
          description: 'Попробуйте позже или позвоните нам напрямую',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка соединения',
        description: 'Проверьте интернет-соединение',
        variant: 'destructive'
      });
    }
  };
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center py-8 sm:py-12 px-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Производство мягких окон
        </h2>
        <p className="text-base sm:text-xl text-gray-700 mb-6 sm:mb-8">
          Профессиональное изготовление прозрачных защитных конструкций
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-base w-full sm:w-auto" onClick={onNavigateToCalculator}>
            <Icon name="Calculator" className="mr-2" />
            Рассчитать стоимость
          </Button>
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 h-12 text-base w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>
            <Icon name="Phone" className="mr-2" />
            Заказать консультацию
          </Button>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://cdn.poehali.dev/files/26ee1f36-1533-46af-bfd4-f4c5ab65cd32.jpg" 
            alt="Мягкие окна на деревянной террасе - пример готового проекта" 
            className="w-full h-[250px] sm:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
            <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Готовый проект</h3>
            <p className="text-sm sm:text-lg opacity-90">Мягкие окна на деревянной террасе с металлическими люверсами</p>
          </div>
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 py-1">
              <Icon name="CheckCircle" size={14} className="mr-1" />
              Установлено
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Заказать консультацию</DialogTitle>
            <DialogDescription>
              Оставьте свои контакты и мы свяжемся с вами в ближайшее время
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Введите ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              <Icon name="Send" className="mr-2" />
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainTab;