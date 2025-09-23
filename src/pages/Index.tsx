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
  grommetsCount: number;
  frenchLock: boolean;
  ringGrommets: boolean;
  ringGrommetsCount: number;
  filmType: string;
  kantSize: number;
  area: number;
  price: number;
}

const Index = () => {
  const [calculation, setCalculation] = useState<WindowCalculation>({
    shape: 'rectangle',
    a: 1000,
    b: 1000,
    c: 1000,
    d: 1000,
    e: 0,
    grommets: false,
    grommetsCount: 0,
    frenchLock: false,
    ringGrommets: false,
    ringGrommetsCount: 0,
    filmType: 'transparent',
    kantSize: 10,
    area: 0,
    price: 0
  });

  const [activeTab, setActiveTab] = useState('calculator');

  const shapes = [
    { id: 'rectangle', name: 'Прямоугольник', params: ['a', 'b', 'c', 'd'] }
  ];

  const filmTypes = [
    { id: 'transparent', name: 'Прозрачная ПВХ', price: 450 },
    { id: 'colored', name: 'Цветная ПВХ', price: 520 },
    { id: 'textured', name: 'Текстурированная ПВХ', price: 590 }
  ];

  const calculateArea = () => {
    const { a, b } = calculation;
    return (a * b) / 1000000; // переводим мм² в м²
  };

  const calculatePrice = () => {
    const area = calculateArea();
    const filmPrice = filmTypes.find(f => f.id === calculation.filmType)?.price || 450;
    let price = area * filmPrice;

    if (calculation.grommets) price += calculation.grommetsCount * 150;
    if (calculation.ringGrommets) price += calculation.ringGrommetsCount * 180;
    if (calculation.frenchLock) price += area * 80;
    
    // Добавляем стоимость канта (15 ₽ за погонный метр)
    const perimeter = calculatePerimeter();
    price += perimeter * 15;

    return { area, price };
  };

  const calculatePerimeter = () => {
    const { a, b, c, d } = calculation;
    return (a + b + c + d) / 1000; // переводим мм в метры
  };

  const handleCalculate = () => {
    const { area, price } = calculatePrice();
    setCalculation(prev => ({ ...prev, area, price }));
  };

  const generatePDF = async () => {
    try {
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;
      const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
      
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      
      const { area, price } = calculatePrice();
      const currentShape = shapes.find(s => s.id === calculation.shape);
      const currentFilm = filmTypes.find(f => f.id === calculation.filmType);
      
      const fabricWidth = calculation.a + 20;
      const fabricHeight = calculation.b + 20;
      const kantPerimeter = (calculation.a + calculation.b) * 2;
      const kantLength = Math.round(kantPerimeter / 10);
      const kantWithMargin = Math.round(kantLength * 1.05);
      const totalGrommets = calculation.grommetsCount + (calculation.ringGrommets ? calculation.ringGrommetsCount : 0);
      
      const docDefinition = {
        pageOrientation: 'landscape' as const,
        pageMargins: [20, 20, 20, 20],
        content: [
          {
            text: 'ТЕХНОЛОГИЧЕСКАЯ КАРТА МЯГКОГО ОКНА',
            style: 'header',
            alignment: 'center' as const,
            margin: [0, 0, 0, 10]
          },
          {
            text: `${currentShape?.name?.toUpperCase()} - ${calculation.a}×${calculation.b}мм`,
            style: 'subheader', 
            alignment: 'center' as const,
            margin: [0, 0, 0, 20]
          },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: 'СПЕЦИФИКАЦИЯ ИЗДЕЛИЯ:', style: 'sectionHeader' },
                  { text: `Форма окна: ${currentShape?.name}`, margin: [0, 5] },
                  { text: `Площадь: ${area.toFixed(2)} м²`, margin: [0, 2] },
                  { text: `Материал: ${currentFilm?.name}`, margin: [0, 2] },
                  { text: 'Толщина пленки: 0.5-0.8 мм', margin: [0, 2] },
                  { text: `Кант: ПВХ ${calculation.kantSize}мм, цвет коричневый`, margin: [0, 2] },
                  { text: `Периметр: ${calculatePerimeter().toFixed(2)} м`, margin: [0, 2] },
                  { text: `Стоимость: ${price.toFixed(0)} ₽`, margin: [0, 2] },
                  
                  { text: 'РАЗМЕРЫ:', style: 'sectionHeader', margin: [0, 15, 0, 5] },
                  { text: `Параметр A: ${calculation.a} мм`, margin: [0, 2] },
                  { text: `Параметр B: ${calculation.b} мм`, margin: [0, 2] },
                  { text: `Параметр C: ${calculation.c} мм`, margin: [0, 2] },
                  { text: `Параметр D: ${calculation.d} мм`, margin: [0, 2] },
                  
                  { text: 'ЗАГОТОВКИ:', style: 'sectionHeader', margin: [0, 15, 0, 5] },
                  { text: `Размер заготовки полотна: ${fabricWidth}×${fabricHeight}мм (с припусками)`, margin: [0, 2] },
                  { text: `Размер заготовки канта: ${kantWithMargin}см (${kantLength}см + 5% запас)`, margin: [0, 2] },
                  { text: `Общее количество люверсов: ${totalGrommets} шт`, margin: [0, 2] }
                ]
              },
              {
                width: '50%',
                stack: [
                  { text: 'ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:', style: 'sectionHeader' },
                  { text: '1. Материал: ПВХ пленка прозрачная, ГОСТ 16272-79', margin: [0, 5] },
                  { text: `2. Кант: ПВХ лента шириной ${calculation.kantSize}мм, цвет коричневый`, margin: [0, 2] },
                  { text: '3. Люверсы: металл, диаметр 16мм, с шайбами', margin: [0, 2] },
                  { text: '4. Сварка: ультразвуковая, шов герметичный', margin: [0, 2] },
                  { text: '5. Допуски размеров: ±2мм', margin: [0, 2] }
                ]
              }
            ]
          }
        ],
        styles: {
          header: { fontSize: 16, bold: true },
          subheader: { fontSize: 14, bold: true },
          sectionHeader: { fontSize: 12, bold: true },
          normal: { fontSize: 10 }
        },
        defaultStyle: { font: 'Roboto', fontSize: 10 }
      };
      
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.download(`Технологическая-карта-${currentShape?.name}-A${calculation.a}xB${calculation.b}xC${calculation.c}xD${calculation.d}-${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF файла');
    }
  };

  const renderShape = () => {
    const { shape, a, b, c, d } = calculation;
    
    switch (shape) {
      case 'rectangle':
        return (
          <svg width="400" height="320" className="border rounded bg-white">
            {/* Коричневый кант (ПВХ лента) - увеличенный */}
            <rect x="40" y="40" width="320" height="220" fill="#A0522D" stroke="none"/>
            
            {/* Голубая прозрачная пленка */}
            <rect x="65" y="65" width="270" height="170" fill="#B3E5FC" stroke="none"/>
            
            {/* Размерные линии для всех сторон */}
            {/* Верхняя сторона A */}
            <line x1="40" y1="25" x2="360" y2="25" stroke="#000" strokeWidth="1"/>
            <line x1="40" y1="22" x2="40" y2="28" stroke="#000" strokeWidth="1"/>
            <line x1="360" y1="22" x2="360" y2="28" stroke="#000" strokeWidth="1"/>
            <text x="200" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">A = {a} мм</text>
            
            {/* Правая сторона B */}
            <line x1="375" y1="40" x2="375" y2="260" stroke="#000" strokeWidth="1"/>
            <line x1="372" y1="40" x2="378" y2="40" stroke="#000" strokeWidth="1"/>
            <line x1="372" y1="260" x2="378" y2="260" stroke="#000" strokeWidth="1"/>
            <text x="385" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(90 385 155)">B = {b} мм</text>
            
            {/* Нижняя сторона C */}
            <line x1="40" y1="275" x2="360" y2="275" stroke="#000" strokeWidth="1"/>
            <line x1="40" y1="272" x2="40" y2="278" stroke="#000" strokeWidth="1"/>
            <line x1="360" y1="272" x2="360" y2="278" stroke="#000" strokeWidth="1"/>
            <text x="200" y="290" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">C = {c} мм</text>
            
            {/* Левая сторона D */}
            <line x1="25" y1="40" x2="25" y2="260" stroke="#000" strokeWidth="1"/>
            <line x1="22" y1="40" x2="28" y2="40" stroke="#000" strokeWidth="1"/>
            <line x1="22" y1="260" x2="28" y2="260" stroke="#000" strokeWidth="1"/>
            <text x="15" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" transform="rotate(-90 15 155)">D = {d} мм</text>
            
            {/* Размеры канта */}
            <text x="200" y="310" textAnchor="middle" fontSize="12" fill="#666">Кант: {calculation.kantSize}мм</text>
            
            {/* Люверсы 16мм по верхнему канту */}
            {calculation.grommets && (
              <>
                {/* Верхний кант: начало на 5мм от края, далее каждые 200мм */}
                {(() => {
                  const positions = [];
                  const startX = 65; // 5мм от края + ширина канта (масштаб 1:10)
                  const spacing = 20; // 200мм в масштабе 1:10
                  const endX = 335; // 5мм от правого края
                  
                  for (let x = startX; x <= endX; x += spacing) {
                    positions.push([x, 52]); // центр верхнего канта
                  }
                  return positions;
                })().map(([x, y], i) => (
                  <g key={`top-${i}`}>
                    <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
                    {/* Размер люверса */}
                    <text x={x} y={y-15} textAnchor="middle" fontSize="10" fill="#666">16мм</text>
                  </g>
                ))}
              </>
            )}


            
            {/* Кольцевые люверсы 42×22мм на расстоянии 400мм */}
            {calculation.ringGrommets && (
              <>
                {/* Левая сторона */}
                {(() => {
                  const positions = [];
                  const startY = 90; // начальная позиция
                  const spacing = 40; // 400мм в масштабе 1:10
                  const endY = 210; // конечная позиция
                  
                  for (let y = startY; y <= endY; y += spacing) {
                    positions.push([52, y]); // центр левого канта
                  }
                  return positions;
                })().map(([x, y], i) => (
                  <g key={`left-${i}`}>
                    <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                    <text x={x-25} y={y+3} textAnchor="middle" fontSize="8" fill="#666">42×22</text>
                  </g>
                ))}
                
                {/* Правая сторона */}
                {(() => {
                  const positions = [];
                  const startY = 90;
                  const spacing = 40; // 400мм в масштабе 1:10
                  const endY = 210;
                  
                  for (let y = startY; y <= endY; y += spacing) {
                    positions.push([348, y]); // центр правого канта
                  }
                  return positions;
                })().map(([x, y], i) => (
                  <g key={`right-${i}`}>
                    <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                    <text x={x+25} y={y+3} textAnchor="middle" fontSize="8" fill="#666">42×22</text>
                  </g>
                ))}
                
                {/* Нижняя сторона */}
                {(() => {
                  const positions = [];
                  const startX = 90;
                  const spacing = 40; // 400мм в масштабе 1:10
                  const endX = 310;
                  
                  for (let x = startX; x <= endX; x += spacing) {
                    positions.push([x, 248]); // центр нижнего канта
                  }
                  return positions;
                })().map(([x, y], i) => (
                  <g key={`bottom-${i}`}>
                    <ellipse cx={x} cy={y} rx="11" ry="6" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <ellipse cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <ellipse cx={x-2} cy={y-1} rx="2" ry="1" fill="rgba(255,255,255,0.7)"/>
                    <text x={x} y={y+20} textAnchor="middle" fontSize="8" fill="#666">42×22</text>
                  </g>
                ))}
              </>
            )}

            {/* Французский замок */}
            {calculation.frenchLock && (
              <>
                {/* Замки на боковых сторонах */}
                {[
                  [50, 150], [350, 150]
                ].map(([x, y], i) => (
                  <g key={i}>
                    {/* Основание замка */}
                    <rect x={x-8} y={y-6} width="16" height="12" fill="#B8860B" stroke="#A0700B" strokeWidth="1" rx="2"/>
                    {/* Металлическая планка */}
                    <rect x={x-6} y={y-4} width="12" height="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5" rx="1"/>
                    {/* Защелка */}
                    <rect x={x-2} y={y-2} width="4" height="4" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" rx="0.5"/>
                    {/* Винты */}
                    <circle cx={x-4} cy={y-2} r="0.8" fill="#808080"/>
                    <circle cx={x+4} cy={y-2} r="0.8" fill="#808080"/>
                  </g>
                ))}
              </>
            )}
          </svg>
        );
      
      default:
        return (
          <div className="w-[400px] h-[300px] border rounded bg-white flex items-center justify-center">
            <Icon name="Shapes" size={60} className="text-primary" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-400 relative">
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm shadow-sm border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://cdn.poehali.dev/files/3aa9eb72-6b55-45bf-b151-00df591113ad.png" 
                alt="Полимер-проект логотип" 
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-2xl font-roboto font-bold text-white">Полимер-проект</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="bg-white/15 text-white border-white/40">
                <Icon name="Phone" size={14} className="mr-1" />
                +7 (921) 636-36-08
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8 mb-8 bg-white/10 border-white/20 backdrop-blur-sm">
            <TabsTrigger value="main" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Главная</TabsTrigger>
            <TabsTrigger value="calculator" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Калькулятор</TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Услуги</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Портфолио</TabsTrigger>
            <TabsTrigger value="blueprint" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Чертежи</TabsTrigger>
            <TabsTrigger value="techcard" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Тех. карта</TabsTrigger>
            <TabsTrigger value="contract" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Договор</TabsTrigger>
            <TabsTrigger value="contacts" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Контакты</TabsTrigger>
          </TabsList>

          {/* Главная */}
          <TabsContent value="main" className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Производство мягких окон
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Профессиональное изготовление прозрачных защитных конструкций
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setActiveTab('calculator')}>
                <Icon name="Calculator" className="mr-2" />
                Рассчитать стоимость
              </Button>
            </div>

            {/* Демонстрационное изображение мягкого окна */}
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
          </TabsContent>

          {/* Калькулятор */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Icon name="Calculator" className="mr-2" />
                    Калькулятор мягких окон
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Рассчитайте стоимость изготовления по вашим размерам
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">


                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="a">Сторона A (мм)</Label>
                      <Input
                        id="a"
                        type="number"
                        value={calculation.a}
                        onChange={(e) => setCalculation(prev => ({ ...prev, a: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="b">Сторона B (мм)</Label>
                      <Input
                        id="b"
                        type="number"
                        value={calculation.b}
                        onChange={(e) => setCalculation(prev => ({ ...prev, b: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="c">Сторона C (мм)</Label>
                      <Input
                        id="c"
                        type="number"
                        value={calculation.c}
                        onChange={(e) => setCalculation(prev => ({ ...prev, c: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="d">Сторона D (мм)</Label>
                      <Input
                        id="d"
                        type="number"
                        value={calculation.d}
                        onChange={(e) => setCalculation(prev => ({ ...prev, d: Number(e.target.value) }))}
                      />
                    </div>
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

                  <div>
                    <Label htmlFor="kantSize">Ширина канта (мм)</Label>
                    <Select value={calculation.kantSize.toString()} onValueChange={(value) => setCalculation(prev => ({ ...prev, kantSize: Number(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ширину канта" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 мм (стандарт)</SelectItem>
                        <SelectItem value="15">15 мм</SelectItem>
                        <SelectItem value="20">20 мм</SelectItem>
                        <SelectItem value="25">25 мм</SelectItem>
                        <SelectItem value="30">30 мм</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Дополнительные услуги</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="grommets"
                          checked={calculation.grommets}
                          onCheckedChange={(checked) => setCalculation(prev => ({ ...prev, grommets: checked as boolean, grommetsCount: checked ? prev.grommetsCount || 4 : 0 }))}
                        />
                        <Label htmlFor="grommets">Люверсы 16мм (150 ₽/шт)</Label>
                      </div>
                      {calculation.grommets && (
                        <div className="ml-6 flex items-center space-x-2">
                          <Label htmlFor="grommetsCount" className="text-sm">Количество:</Label>
                          <Input
                            id="grommetsCount"
                            type="number"
                            min="0"
                            max="50"
                            value={calculation.grommetsCount}
                            onChange={(e) => setCalculation(prev => ({ ...prev, grommetsCount: parseInt(e.target.value) || 0 }))}
                            className="w-20 h-8 text-sm"
                          />
                          <span className="text-sm text-gray-500">шт</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ringGrommets"
                          checked={calculation.ringGrommets}
                          onCheckedChange={(checked) => setCalculation(prev => ({ ...prev, ringGrommets: checked as boolean, ringGrommetsCount: checked ? prev.ringGrommetsCount || 2 : 0 }))}
                        />
                        <Label htmlFor="ringGrommets">Кольцевые люверсы 42×22мм (180 ₽/шт)</Label>
                      </div>
                      {calculation.ringGrommets && (
                        <div className="ml-6 flex items-center space-x-2">
                          <Label htmlFor="ringGrommetsCount" className="text-sm">Количество:</Label>
                          <Input
                            id="ringGrommetsCount"
                            type="number"
                            min="0"
                            max="20"
                            value={calculation.ringGrommetsCount}
                            onChange={(e) => setCalculation(prev => ({ ...prev, ringGrommetsCount: parseInt(e.target.value) || 0 }))}
                            className="w-20 h-8 text-sm"
                          />
                          <span className="text-sm text-gray-500">шт</span>
                        </div>
                      )}
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
                    <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
                      <CardContent className="pt-4">
                        <div className="text-center space-y-2">
                          <p className="text-lg text-white">
                            Площадь: <strong>{calculation.area.toFixed(2)} м²</strong>
                          </p>
                          <p className="text-sm text-white/80">
                            Периметр: <strong>{calculatePerimeter().toFixed(2)} м</strong>
                          </p>
                          <p className="text-sm text-white/80">
                            Кант: <strong>{calculation.kantSize}мм × {calculatePerimeter().toFixed(2)}м</strong>
                          </p>
                          {(calculation.grommets && calculation.grommetsCount > 0) && (
                            <p className="text-sm text-white/80">
                              Люверсы 16мм: <strong>{calculation.grommetsCount} шт</strong>
                            </p>
                          )}
                          {(calculation.ringGrommets && calculation.ringGrommetsCount > 0) && (
                            <p className="text-sm text-white/80">
                              Кольцевые люверсы 42×22мм: <strong>{calculation.ringGrommetsCount} шт</strong>
                            </p>
                          )}
                          <p className="text-2xl font-bold text-cyan-300">
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

              <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                <CardHeader>
                  <CardTitle className="text-white">Предварительный чертеж</CardTitle>
                  <CardDescription className="text-white/80">
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
                      Люверсы 16мм
                    </h4>
                    <p className="text-sm text-gray-600">Металлические кольца диаметром 16мм для надежного крепления</p>
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
                  <div className="p-3 bg-purple-50 rounded">
                    <h4 className="font-medium">Усиленные люверсы 16мм</h4>
                    <p className="text-sm text-gray-600">Люверсы увеличенного диаметра для повышенной нагрузки</p>
                    <Badge className="mt-1">+25 ₽/шт</Badge>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded">
                    <h4 className="font-medium">Установка люверсов</h4>
                    <p className="text-sm text-gray-600">Установка металлических люверсов 16мм с шайбами</p>
                    <Badge className="mt-1">150 ₽/шт</Badge>
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
          </TabsContent>

          {/* Технологическая карта */}
          <TabsContent value="techcard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="FileText" size={24} className="text-primary" />
                  <span>Технологическая карта производства мягких окон</span>
                </CardTitle>
                <CardDescription>
                  Пошаговые инструкции для изготовления качественных мягких окон с указанием инструментов и материалов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Левая колонка - Этапы производства */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <Icon name="Settings" className="mr-2" />
                        1. ПОДГОТОВИТЕЛЬНЫЕ ОПЕРАЦИИ
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800">1.1. Подготовка материалов</h4>
                          <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Проверка качества ПВХ пленки (отсутствие дефектов, царапин)</li>
                            <li>• Подготовка канта ПВХ шириной 50мм</li>
                            <li>• Проверка крепежных элементов</li>
                            <li>• Контроль инструмента и оборудования</li>
                          </ul>
                          <div className="mt-3 p-2 bg-blue-100 rounded">
                            <strong>Инструменты:</strong> линейка, маркер, ножницы
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800">1.2. Раскрой материала</h4>
                          <ul className="text-sm text-green-700 mt-2 space-y-1">
                            <li>• Разметка основного полотна по чертежу</li>
                            <li>• Припуски на сварку: +10мм по периметру</li>
                            <li>• Нарезка канта с запасом 5%</li>
                            <li>• Контроль размеров кроя (допуск ±2мм)</li>
                          </ul>
                          <div className="mt-3 p-2 bg-green-100 rounded">
                            <strong>Инструменты:</strong> раскройный нож, металлическая линейка, угольник
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <Icon name="Zap" className="mr-2" />
                        2. СВАРОЧНЫЕ ОПЕРАЦИИ
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium text-orange-800">2.1. Подготовка к сварке</h4>
                          <ul className="text-sm text-orange-700 mt-2 space-y-1">
                            <li>• Очистка краев пленки от пыли и загрязнений</li>
                            <li>• Обезжиривание сварочных поверхностей</li>
                            <li>• Укладка канта по периметру с равномерным натяжением</li>
                            <li>• Фиксация канта зажимами через каждые 200мм</li>
                          </ul>
                          <div className="mt-3 p-2 bg-orange-100 rounded">
                            <strong>Инструменты:</strong> обезжириватель, ветошь, зажимы
                          </div>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-red-800">2.2. Сварка канта</h4>
                          <ul className="text-sm text-red-700 mt-2 space-y-1">
                            <li>• Настройка сварочного аппарата (t=380-420°C)</li>
                            <li>• Скорость сварки: 2-3 м/мин</li>
                            <li>• Контроль качества шва (герметичность)</li>
                            <li>• Формовка углов с радиусом 3-5мм</li>
                            <li>• Охлаждение швов до комнатной температуры</li>
                          </ul>
                          <div className="mt-3 p-2 bg-red-100 rounded">
                            <strong>Инструменты:</strong> сварочный аппарат ТВЧ, термофен, прикаточный ролик
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Правая колонка - Установка крепежа и контроль */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <Icon name="Wrench" className="mr-2" />
                        3. УСТАНОВКА КРЕПЕЖА
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800">3.1. Люверсы (несъемное крепление)</h4>
                          <ul className="text-sm text-purple-700 mt-2 space-y-1">
                            <li>• Разметка позиций люверсов (шаг 40-75мм)</li>
                            <li>• Пробивка отверстий d=8мм пробойником</li>
                            <li>• Установка люверсов с помощью пресса</li>
                            <li>• Контроль усилия установки (500-700 кг)</li>
                            <li>• Проверка прочности крепления</li>
                          </ul>
                          <div className="mt-3 p-2 bg-purple-100 rounded">
                            <strong>Инструменты:</strong> пробойник, люверсный пресс, штангенциркуль
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-medium text-yellow-800">3.2. Французские замки (съемное крепление)</h4>
                          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                            <li>• Разметка позиций замков на боковых сторонах</li>
                            <li>• Сверление отверстий под крепеж d=3мм</li>
                            <li>• Установка замков с герметизацией стыков</li>
                            <li>• Проверка работы механизма</li>
                            <li>• Смазка подвижных частей</li>
                          </ul>
                          <div className="mt-3 p-2 bg-yellow-100 rounded">
                            <strong>Инструменты:</strong> дрель, сверла, отвертка, герметик, смазка
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <Icon name="CheckCircle" className="mr-2" />
                        4. КОНТРОЛЬ КАЧЕСТВА
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="font-medium text-indigo-800">4.1. Проверка геометрии</h4>
                          <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                            <li>• Контроль размеров изделия (допуск ±3мм)</li>
                            <li>• Проверка прямоугольности (диагонали)</li>
                            <li>• Измерение ширины канта (50±2мм)</li>
                          </ul>
                          <div className="mt-3 p-2 bg-indigo-100 rounded">
                            <strong>Инструменты:</strong> рулетка, угольник, штангенциркуль
                          </div>
                        </div>
                        
                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h4 className="font-medium text-teal-800">4.2. Проверка качества</h4>
                          <ul className="text-sm text-teal-700 mt-2 space-y-1">
                            <li>• Визуальный осмотр сварных швов</li>
                            <li>• Тест на герметичность (избыточное давление)</li>
                            <li>• Проверка прочности соединений</li>
                            <li>• Контроль работы крепежных элементов</li>
                          </ul>
                          <div className="mt-3 p-2 bg-teal-100 rounded">
                            <strong>Инструменты:</strong> манометр, динамометр, микроскоп
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <Icon name="Package" className="mr-2" />
                        5. ФИНИШНЫЕ ОПЕРАЦИИ
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800">5.1. Упаковка и маркировка</h4>
                        <ul className="text-sm text-gray-700 mt-2 space-y-1">
                          <li>• Удаление защитной пленки с ПВХ</li>
                          <li>• Очистка поверхности от загрязнений</li>
                          <li>• Антистатическая обработка</li>
                          <li>• Упаковка в защитную пленку</li>
                          <li>• Маркировка с указанием размеров и даты</li>
                        </ul>
                        <div className="mt-3 p-2 bg-gray-100 rounded">
                          <strong>Инструменты:</strong> антистатик, упаковочная пленка, этикет-принтер
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Нормы времени */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icon name="Timer" className="mr-2 text-primary" />
                    НОРМЫ ВРЕМЕНИ ПРОИЗВОДСТВА
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-blue-600">15-25 мин</div>
                      <div>Подготовка</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-red-600">20-35 мин</div>
                      <div>Сварка</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-purple-600">10-20 мин</div>
                      <div>Крепеж</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-green-600">60-90 мин</div>
                      <div>Общее время</div>
                    </div>
                  </div>
                </div>

                {/* Требования безопасности */}
                <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <Icon name="Shield" className="mr-2" />
                    ТРЕБОВАНИЯ БЕЗОПАСНОСТИ
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700">
                    <ul className="space-y-2">
                      <li>• Обязательное использование СИЗ (очки, перчатки, респиратор)</li>
                      <li>• Вентиляция рабочего места при сварке ПВХ</li>
                      <li>• Заземление сварочного оборудования</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• Соблюдение противопожарной безопасности</li>
                      <li>• Наличие средств первой помощи при ожогах</li>
                      <li>• Регулярное обслуживание оборудования</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Портфолио */}
          <TabsContent value="portfolio" className="space-y-8">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Наши проекты
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Более 500 успешно реализованных объектов
              </p>
            </div>

            {/* Галерея проектов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Проект 1 - Деревянная терраса */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/img/1f0cdb80-d24a-4c4d-aae3-2fa47ab4b79a.jpg" 
                  alt="Мягкие окна на деревянной террасе" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Деревянная терраса</h3>
                  <p className="text-gray-600 text-sm mb-3">Частный дом, 24 м²</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Люверсы</Badge>
                    <span className="text-sm text-gray-500">2023</span>
                  </div>
                </div>
              </div>

              {/* Проект 2 - Ресторан */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/img/030dde9c-1053-4d06-ae96-48a660afbcda.jpg" 
                  alt="Летняя терраса ресторана" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Ресторан "Вилла"</h3>
                  <p className="text-gray-600 text-sm mb-3">Летняя терраса, 48 м²</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Французские замки</Badge>
                    <span className="text-sm text-gray-500">2023</span>
                  </div>
                </div>
              </div>

              {/* Проект 3 - Склад */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/img/12a3c78a-02a5-4344-84cb-630e3b321bb1.jpg" 
                  alt="Промышленные мягкие окна" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Складской комплекс</h3>
                  <p className="text-gray-600 text-sm mb-3">Промышленное здание, 120 м²</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Большие размеры</Badge>
                    <span className="text-sm text-gray-500">2024</span>
                  </div>
                </div>
              </div>

              {/* Проект 4 - Кафе */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/img/1988cf49-6d49-4dbb-a464-0b5444f7b9e7.jpg" 
                  alt="Кафе с мягкими окнами" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Кафе "Уют"</h3>
                  <p className="text-gray-600 text-sm mb-3">Зимняя веранда, 32 м²</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Утепленные</Badge>
                    <span className="text-sm text-gray-500">2024</span>
                  </div>
                </div>
              </div>

              {/* Проект 5 - Марина */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/img/b753cc35-620e-4299-975b-7e963f4b67be.jpg" 
                  alt="Яхтенная марина" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Яхт-клуб "Neva"</h3>
                  <p className="text-gray-600 text-sm mb-3">Морская пристань, 85 м²</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Морская среда</Badge>
                    <span className="text-sm text-gray-500">2024</span>
                  </div>
                </div>
              </div>

              {/* Проект 6 - Загородный дом */}
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

            {/* Отзывы клиентов */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-white mb-4">
                  <Icon name="MessageSquare" className="mr-2 inline" />
                  Отзывы наших клиентов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Отзыв 1 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★★★★★".split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 italic">
                      "Отличное качество! Мягкие окна на террасе служат уже второй год. 
                      Никаких протечек, швы крепкие. Монтаж выполнили быстро и аккуратно."
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Александр П.</p>
                      <p className="text-gray-500">Частный дом, Павловск</p>
                    </div>
                  </div>

                  {/* Отзыв 2 */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★★★★★".split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 italic">
                      "Для нашего ресторана заказывали мягкие окна на летнюю веранду. 
                      Клиенты довольны - теперь можно сидеть даже в дождь. Рекомендую!"
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Елена В.</p>
                      <p className="text-gray-500">Ресторан "Вилла"</p>
                    </div>
                  </div>

                  {/* Отзыв 3 */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★★★★★".split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 italic">
                      "Заказывали промышленные окна для склада. Размеры большие, 
                      но справились на отлично. Теперь товары защищены от дождя."
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Михаил С.</p>
                      <p className="text-gray-500">ООО "Логистика-СПб"</p>
                    </div>
                  </div>

                  {/* Отзыв 4 */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★★★★★".split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 italic">
                      "Профессиональный подход! Сделали точные замеры, 
                      предложили оптимальное решение. Работают быстро и качественно."
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Ольга К.</p>
                      <p className="text-gray-500">Кафе "Уют"</p>
                    </div>
                  </div>

                  {/* Отзыв 5 */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★★★★★".split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 italic">
                      "Мягкие окна для яхт-клуба получились отличные! 
                      Выдерживают морской климат, соленый воздух. Очень довольны."
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Дмитрий Н.</p>
                      <p className="text-gray-500">Яхт-клуб "Neva"</p>
                    </div>
                  </div>

                  {/* Отзыв 6 */}
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★★★★★".split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 italic">
                      "Заказываем уже не первый раз. Качество стабильно высокое, 
                      цены адекватные. Лучшая компания в Петербурге!"
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Сергей Т.</p>
                      <p className="text-gray-500">Строительная компания</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
                    <Icon name="Phone" className="mr-2" />
                    Заказать консультацию
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;