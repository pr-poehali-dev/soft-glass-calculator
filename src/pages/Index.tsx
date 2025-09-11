import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface WindowCalculation {
  shape: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  grommets: boolean;
  frenchLock: boolean;
  filmType: string;
  area: number;
  price: number;
}

const Index = () => {
  const [calculation, setCalculation] = useState<WindowCalculation>({
    shape: 'rectangle',
    a: 100,
    b: 100,
    c: 0,
    d: 0,
    e: 0,
    grommets: false,
    frenchLock: false,
    filmType: 'transparent',
    area: 0,
    price: 0
  });

  const [activeTab, setActiveTab] = useState('calculator');

  const shapes = [
    { id: 'rectangle', name: 'Прямоугольник', params: ['a', 'b'] },
    { id: 'triangle', name: 'Треугольник', params: ['a', 'b', 'c'] },
    { id: 'trapezoid', name: 'Трапеция', params: ['a', 'b', 'c', 'd'] },
    { id: 'pentagon', name: 'Пятиугольник', params: ['a', 'b', 'c', 'd', 'e'] }
  ];

  const filmTypes = [
    { id: 'transparent', name: 'Прозрачная ПВХ', price: 450 },
    { id: 'colored', name: 'Цветная ПВХ', price: 520 },
    { id: 'textured', name: 'Текстурированная ПВХ', price: 590 }
  ];

  const calculateArea = () => {
    const { shape, a, b, c, d, e } = calculation;
    let area = 0;

    switch (shape) {
      case 'rectangle':
        area = (a * b) / 10000;
        break;
      case 'triangle':
        area = (a * b * 0.5) / 10000;
        break;
      case 'trapezoid':
        area = ((a + c) * b * 0.5) / 10000;
        break;
      case 'pentagon':
        area = (a * b + c * d * 0.5 + e * 10) / 10000;
        break;
    }

    return area;
  };

  const calculatePrice = () => {
    const area = calculateArea();
    const filmPrice = filmTypes.find(f => f.id === calculation.filmType)?.price || 450;
    let price = area * filmPrice;

    if (calculation.grommets) price += area * 50;
    if (calculation.frenchLock) price += area * 80;

    return { area, price };
  };

  const handleCalculate = () => {
    const { area, price } = calculatePrice();
    setCalculation(prev => ({ ...prev, area, price }));
  };

  const generatePDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const doc = new jsPDF();
      const { area, price } = calculatePrice();
      const currentShape = shapes.find(s => s.id === calculation.shape);
      const currentFilm = filmTypes.find(f => f.id === calculation.filmType);
      
      // Добавляем заголовок
      doc.setFontSize(20);
      doc.text('Технологическая карта мягкого окна', 105, 30, { align: 'center' });
      
      // Добавляем спецификацию
      doc.setFontSize(12);
      doc.text('СПЕЦИФИКАЦИЯ ИЗДЕЛИЯ', 20, 60);
      
      let yPosition = 80;
      doc.text(`Форма: ${currentShape?.name}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Площадь: ${area.toFixed(2)} м²`, 20, yPosition);
      yPosition += 10;
      doc.text(`Материал: ${currentFilm?.name}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Стоимость: ${price.toFixed(0)} ₽`, 20, yPosition);
      
      if (calculation.grommets || calculation.frenchLock) {
        yPosition += 15;
        doc.text('ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ:', 20, yPosition);
        yPosition += 10;
        if (calculation.grommets) {
          doc.text('• Люверсы', 25, yPosition);
          yPosition += 8;
        }
        if (calculation.frenchLock) {
          doc.text('• Французский замок', 25, yPosition);
          yPosition += 8;
        }
      }
      
      // Добавляем размеры
      yPosition += 15;
      doc.text('РАЗМЕРЫ (см):', 20, yPosition);
      yPosition += 10;
      
      currentShape?.params.forEach(param => {
        const value = calculation[param as keyof WindowCalculation] as number;
        doc.text(`${param.toUpperCase()}: ${value}`, 25, yPosition);
        yPosition += 8;
      });
      
      // Сохраняем PDF
      doc.save(`chertezh-${currentShape?.name}-${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF файла');
    }
  };

  const renderShape = () => {
    const { shape, a, b, c, d, e } = calculation;
    
    switch (shape) {
      case 'rectangle':
        return (
          <svg width="200" height="150" className="border rounded bg-blue-50">
            <rect x="25" y="25" width="150" height="100" fill="rgba(66, 133, 244, 0.2)" stroke="#4285F4" strokeWidth="2"/>
            <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#4285F4">a = {a}см</text>
            <text x="10" y="80" textAnchor="middle" fontSize="12" fill="#4285F4" transform="rotate(-90 10 80)">b = {b}см</text>
            {calculation.grommets && (
              <>
                <circle cx="45" cy="45" r="3" fill="#10B981"/>
                <circle cx="155" cy="45" r="3" fill="#10B981"/>
                <circle cx="45" cy="105" r="3" fill="#10B981"/>
                <circle cx="155" cy="105" r="3" fill="#10B981"/>
              </>
            )}
            {calculation.frenchLock && (
              <rect x="90" y="120" width="20" height="8" fill="#EF4444" rx="2"/>
            )}
          </svg>
        );
      
      case 'triangle':
        return (
          <svg width="200" height="150" className="border rounded bg-blue-50">
            <polygon points="100,25 25,125 175,125" fill="rgba(66, 133, 244, 0.2)" stroke="#4285F4" strokeWidth="2"/>
            <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#4285F4">a = {a}см</text>
            <text x="100" y="145" textAnchor="middle" fontSize="12" fill="#4285F4">b = {b}см</text>
            <text x="15" y="80" textAnchor="middle" fontSize="12" fill="#4285F4" transform="rotate(-60 15 80)">c = {c}см</text>
            {calculation.grommets && (
              <>
                <circle cx="100" cy="35" r="3" fill="#10B981"/>
                <circle cx="40" cy="115" r="3" fill="#10B981"/>
                <circle cx="160" cy="115" r="3" fill="#10B981"/>
              </>
            )}
          </svg>
        );
      
      default:
        return (
          <div className="w-[200px] h-[150px] border rounded bg-blue-50 flex items-center justify-center">
            <Icon name="Shapes" size={40} className="text-primary" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Icon name="Home" size={32} className="text-primary" />
              <h1 className="text-2xl font-roboto font-bold text-gray-900">SoftWindows</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" onClick={() => setActiveTab('main')}>Главная</Button>
              <Button variant="ghost" onClick={() => setActiveTab('calculator')}>Калькулятор</Button>
              <Button variant="ghost" onClick={() => setActiveTab('services')}>Услуги</Button>
              <Button variant="ghost" onClick={() => setActiveTab('blueprint')}>Чертежи</Button>
              <Button variant="ghost" onClick={() => setActiveTab('contract')}>Договор</Button>
              <Button variant="ghost" onClick={() => setActiveTab('contacts')}>Контакты</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 mb-8">
            <TabsTrigger value="main">Главная</TabsTrigger>
            <TabsTrigger value="calculator">Калькулятор</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="blueprint">Чертежи</TabsTrigger>
            <TabsTrigger value="contract">Договор</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
          </TabsList>

          {/* Главная */}
          <TabsContent value="main" className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Производство мягких окон
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Профессиональное изготовление прозрачных защитных конструкций
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setActiveTab('calculator')}>
                <Icon name="Calculator" className="mr-2" />
                Рассчитать стоимость
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon name="Shield" size={40} className="text-accent mb-2" />
                  <CardTitle>Качество</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Используем только высококачественную ПВХ пленку европейского производства</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon name="Clock" size={40} className="text-primary mb-2" />
                  <CardTitle>Скорость</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Изготовление от 1 до 5 рабочих дней в зависимости от сложности заказа</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon name="Award" size={40} className="text-destructive mb-2" />
                  <CardTitle>Гарантия</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Предоставляем гарантию 2 года на все изготавливаемые конструкции</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Калькулятор */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Calculator" className="mr-2" />
                    Калькулятор мягких окон
                  </CardTitle>
                  <CardDescription>
                    Рассчитайте стоимость изготовления по вашим размерам
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shape">Форма окна</Label>
                    <Select value={calculation.shape} onValueChange={(value) => setCalculation(prev => ({ ...prev, shape: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите форму" />
                      </SelectTrigger>
                      <SelectContent>
                        {shapes.map(shape => (
                          <SelectItem key={shape.id} value={shape.id}>
                            {shape.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {shapes.find(s => s.id === calculation.shape)?.params.map(param => (
                      <div key={param}>
                        <Label htmlFor={param}>Параметр {param.toUpperCase()} (см)</Label>
                        <Input
                          id={param}
                          type="number"
                          value={calculation[param as keyof WindowCalculation] as number}
                          onChange={(e) => setCalculation(prev => ({ ...prev, [param]: Number(e.target.value) }))}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="filmType">Тип ПВХ пленки</Label>
                    <Select value={calculation.filmType} onValueChange={(value) => setCalculation(prev => ({ ...prev, filmType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип пленки" />
                      </SelectTrigger>
                      <SelectContent>
                        {filmTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - {type.price} ₽/м²
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Дополнительные услуги</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="grommets"
                        checked={calculation.grommets}
                        onCheckedChange={(checked) => setCalculation(prev => ({ ...prev, grommets: checked as boolean }))}
                      />
                      <Label htmlFor="grommets">Люверсы (+50 ₽/м²)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="frenchLock"
                        checked={calculation.frenchLock}
                        onCheckedChange={(checked) => setCalculation(prev => ({ ...prev, frenchLock: checked as boolean }))}
                      />
                      <Label htmlFor="frenchLock">Французский замок (+80 ₽/м²)</Label>
                    </div>
                  </div>

                  <Button onClick={handleCalculate} className="w-full">
                    <Icon name="Calculator" className="mr-2" />
                    Рассчитать
                  </Button>

                  {calculation.area > 0 && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <div className="text-center space-y-2">
                          <p className="text-lg">
                            Площадь: <strong>{calculation.area.toFixed(2)} м²</strong>
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            Стоимость: {calculation.price.toFixed(0)} ₽
                          </p>
                          <Button onClick={generatePDF} variant="outline" className="mt-3">
                            <Icon name="Download" className="mr-2" />
                            Скачать чертеж PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Предварительный чертеж</CardTitle>
                  <CardDescription>
                    Визуализация выбранной формы с параметрами
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  {renderShape()}
                  <div className="text-center space-y-2">
                    <Badge variant="secondary">
                      {shapes.find(s => s.id === calculation.shape)?.name}
                    </Badge>
                    <div className="text-sm text-gray-600 space-y-1">
                      {shapes.find(s => s.id === calculation.shape)?.params.map(param => (
                        <div key={param}>
                          {param.toUpperCase()}: {calculation[param as keyof WindowCalculation] as number} см
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Услуги */}
          <TabsContent value="services" className="space-y-6">
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
                    <Badge className="mt-1">450 ₽/м²</Badge>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <h4 className="font-medium">Цветная ПВХ</h4>
                    <p className="text-sm text-gray-600">Тонированная пленка различных оттенков</p>
                    <Badge className="mt-1">520 ₽/м²</Badge>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <h4 className="font-medium">Текстурированная</h4>
                    <p className="text-sm text-gray-600">Пленка с декоративной текстурой</p>
                    <Badge className="mt-1">590 ₽/м²</Badge>
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
                      Люверсы
                    </h4>
                    <p className="text-sm text-gray-600">Металлические кольца для крепления</p>
                    <Badge className="mt-1">+50 ₽/м²</Badge>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <h4 className="font-medium flex items-center">
                      <Icon name="Lock" size={16} className="mr-2 text-destructive" />
                      Французский замок
                    </h4>
                    <p className="text-sm text-gray-600">Система быстрого открывания</p>
                    <Badge className="mt-1">+80 ₽/м²</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Дополнительно</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium">Замер на объекте</h4>
                    <p className="text-sm text-gray-600">Выезд специалиста для точных замеров</p>
                    <Badge className="mt-1">Бесплатно</Badge>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <h4 className="font-medium">Установка</h4>
                    <p className="text-sm text-gray-600">Профессиональный монтаж</p>
                    <Badge className="mt-1">2000 ₽</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Чертежи */}
          <TabsContent value="blueprint" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="FileText" className="mr-2" />
                  Технологическая карта
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculation.area > 0 ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Спецификация изделия</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Форма:</strong> {shapes.find(s => s.id === calculation.shape)?.name}</p>
                          <p><strong>Площадь:</strong> {calculation.area.toFixed(2)} м²</p>
                          <p><strong>Материал:</strong> {filmTypes.find(f => f.id === calculation.filmType)?.name}</p>
                          {calculation.grommets && <p><strong>Люверсы:</strong> Да</p>}
                          {calculation.frenchLock && <p><strong>Французский замок:</strong> Да</p>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Размеры (см)</h4>
                        <div className="space-y-2 text-sm">
                          {shapes.find(s => s.id === calculation.shape)?.params.map(param => (
                            <p key={param}>
                              <strong>{param.toUpperCase()}:</strong> {calculation[param as keyof WindowCalculation] as number}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center p-6 border rounded bg-gray-50">
                      {renderShape()}
                    </div>

                    <Button onClick={generatePDF} className="w-full">
                      <Icon name="Download" className="mr-2" />
                      Скачать технологическую карту PDF
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="Calculator" size={48} className="mx-auto mb-4" />
                    <p>Сначала выполните расчет в калькуляторе</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Договор */}
          <TabsContent value="contract" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="FileText" className="mr-2" />
                  Договор на изготовление мягких окон
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm leading-relaxed space-y-4 max-h-96 overflow-y-auto p-4 border rounded">
                  <h3 className="font-bold text-center">ДОГОВОР №___</h3>
                  <h3 className="font-bold text-center">на изготовление и поставку мягких окон</h3>
                  
                  <p><strong>г. _____________ "_____" _________ 202_ г.</strong></p>
                  
                  <p>ООО "SoftWindows", именуемое в дальнейшем "Исполнитель", в лице директора _____________, действующего на основании Устава, с одной стороны, и _____________, именуемый в дальнейшем "Заказчик", с другой стороны, заключили настоящий договор о нижеследующем:</p>
                  
                  <h4 className="font-bold">1. ПРЕДМЕТ ДОГОВОРА</h4>
                  <p>1.1. Исполнитель обязуется изготовить и поставить Заказчику мягкие окна согласно техническому заданию и спецификации, являющимися неотъемлемой частью настоящего договора.</p>
                  
                  <h4 className="font-bold">2. СТОИМОСТЬ И ПОРЯДОК РАСЧЕТОВ</h4>
                  <p>2.1. Общая стоимость работ составляет _______ рублей, включая НДС.</p>
                  <p>2.2. Предоплата составляет 50% от общей суммы договора.</p>
                  <p>2.3. Окончательный расчет производится при получении готовой продукции.</p>
                  
                  <h4 className="font-bold">3. СРОКИ ВЫПОЛНЕНИЯ</h4>
                  <p>3.1. Срок изготовления составляет ___ рабочих дней с момента получения предоплаты.</p>
                  <p>3.2. Доставка и монтаж осуществляются в течение 3 рабочих дней после готовности изделия.</p>
                  
                  <h4 className="font-bold">4. ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА</h4>
                  <p>4.1. Исполнитель предоставляет гарантию на изготовленные изделия сроком 24 месяца.</p>
                  <p>4.2. Гарантия не распространяется на механические повреждения и нарушения правил эксплуатации.</p>
                </div>
                
                <div className="flex justify-between pt-4">
                  <div className="text-center">
                    <p className="font-medium">Исполнитель</p>
                    <p className="text-sm text-gray-600 mt-8">_____________ / _____________</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Заказчик</p>
                    <p className="text-sm text-gray-600 mt-8">_____________ / _____________</p>
                  </div>
                </div>

                <Button className="w-full" onClick={generatePDF}>
                  <Icon name="Download" className="mr-2" />
                  Скачать договор PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Контакты */}
          <TabsContent value="contacts" className="space-y-6">
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
                      <p className="font-medium">+7 (999) 123-45-67</p>
                      <p className="text-sm text-gray-600">Звонки с 9:00 до 18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="Mail" className="text-primary" />
                    <div>
                      <p className="font-medium">info@softwindows.ru</p>
                      <p className="text-sm text-gray-600">Ответим в течение часа</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Icon name="MapPin" className="text-primary mt-1" />
                    <div>
                      <p className="font-medium">г. Москва, ул. Производственная, д. 1</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;