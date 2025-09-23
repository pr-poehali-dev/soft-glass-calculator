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
    a: 100,
    b: 100,
    c: 0,
    d: 0,
    e: 0,
    grommets: false,
    grommetsCount: 0,
    frenchLock: false,
    ringGrommets: false,
    ringGrommetsCount: 0,
    filmType: 'transparent',
    kantSize: 20,
    area: 0,
    price: 0
  });

  const [activeTab, setActiveTab] = useState('calculator');

  const shapes = [
    { id: 'rectangle', name: 'Прямоугольник', params: ['a', 'b'] }
  ];

  const filmTypes = [
    { id: 'transparent', name: 'Прозрачная ПВХ', price: 450 },
    { id: 'colored', name: 'Цветная ПВХ', price: 520 },
    { id: 'textured', name: 'Текстурированная ПВХ', price: 590 }
  ];

  const calculateArea = () => {
    const { a, b } = calculation;
    return (a * b) / 10000;
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
    const { a, b } = calculation;
    return (2 * (a + b)) / 1000; // переводим в метры
  };

  const handleCalculate = () => {
    const { area, price } = calculatePrice();
    setCalculation(prev => ({ ...prev, area, price }));
  };

  const generatePDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      // Подключаем встроенный шрифт с поддержкой Unicode
      doc.setFont('helvetica');
      
      const { area, price } = calculatePrice();
      const currentShape = shapes.find(s => s.id === calculation.shape);
      const currentFilm = filmTypes.find(f => f.id === calculation.filmType);
      
      // Заголовок на русском
      doc.setFontSize(16);
      doc.text('ТЕХНОЛОГИЧЕСКАЯ КАРТА МЯГКОГО ОКНА', 148, 20, { align: 'center' });
      doc.text(`${currentShape?.name?.toUpperCase()} - ${calculation.a}x${calculation.b}мм`, 148, 30, { align: 'center' });
      
      // Рамка документа
      doc.rect(10, 10, 277, 200);
      
      // Левая часть - спецификация
      doc.setFontSize(12);
      doc.text('СПЕЦИФИКАЦИЯ ИЗДЕЛИЯ:', 15, 50);
      
      let yPos = 60;
      doc.setFontSize(10);
      doc.text(`Форма окна: ${currentShape?.name}`, 15, yPos);
      yPos += 8;
      doc.text(`Площадь: ${area.toFixed(2)} м²`, 15, yPos);
      yPos += 8;
      doc.text(`Материал: ${currentFilm?.name}`, 15, yPos);
      yPos += 8;
      doc.text(`Толщина пленки: 0.5-0.8 мм`, 15, yPos);
      yPos += 8;
      doc.text(`Кант: ПВХ ${calculation.kantSize}мм, цвет коричневый`, 15, yPos);
      yPos += 8;
      doc.text(`Периметр: ${calculatePerimeter().toFixed(2)} м`, 15, yPos);
      yPos += 8;
      doc.text(`Стоимость: ${price.toFixed(0)} ₽`, 15, yPos);
      
      // Размеры
      yPos += 15;
      doc.setFontSize(12);
      doc.text('РАЗМЕРЫ:', 15, yPos);
      yPos += 10;
      doc.setFontSize(10);
      
      currentShape?.params.forEach(param => {
        const value = calculation[param as keyof WindowCalculation] as number;
        doc.text(`Параметр ${param.toUpperCase()}: ${value} мм`, 15, yPos);
        yPos += 6;
      });
      
      // Дополнительные услуги
      if (calculation.grommets || calculation.frenchLock) {
        yPos += 10;
        doc.setFontSize(12);
        doc.text('ФУРНИТУРА:', 15, yPos);
        yPos += 10;
        doc.setFontSize(10);
        
        if (calculation.grommets) {
          doc.text('✓ Люверсы металлические d=16мм', 15, yPos);
          yPos += 6;
          doc.text('  Расположение: на канте по периметру (несъёмное крепление)', 17, yPos);
          yPos += 6;
        }

        if (calculation.frenchLock) {
          doc.text('✓ Французские замки', 15, yPos);
          yPos += 6;
          doc.text('  Расположение: на боковых сторонах (съёмное крепление)', 17, yPos);
          yPos += 6;
        }

        // Технологическая карта
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('ТЕХНОЛОГИЧЕСКАЯ КАРТА ПРОИЗВОДСТВА', 15, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.text('1. ПОДГОТОВИТЕЛЬНЫЕ ОПЕРАЦИИ', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.text('1.1. Подготовка материалов:', 17, yPos);
        yPos += 5;
        doc.text('    • Проверка качества ПВХ пленки (отсутствие дефектов, царапин)', 19, yPos);
        yPos += 4;
        doc.text('    • Подготовка канта ПВХ шириной 50мм (цвет по заказу)', 19, yPos);
        yPos += 4;
        const metalware = calculation.grommets ? 'люверсы d=16мм' : 'французские замки';
        doc.text(`    • Подготовка крепежа: ${metalware}`, 19, yPos);
        yPos += 4;
        doc.text('    • Проверка инструмента и оборудования', 19, yPos);
        yPos += 6;

        doc.text('1.2. Раскрой материала:', 17, yPos);
        yPos += 5;
        doc.text(`    • Разметка основного полотна: ${calculation.a}×${calculation.b}мм`, 19, yPos);
        yPos += 4;
        doc.text('    • Припуски на сварку: +10мм по периметру', 19, yPos);
        yPos += 4;
        const kantLength = Math.round((calculation.a + calculation.b) * 2 / 10);
        doc.text(`    • Нарезка канта: ${kantLength}см + 5% запас`, 19, yPos);
        yPos += 4;
        doc.text('    • Контроль размеров кроя (допуск ±2мм)', 19, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.text('2. СБОРОЧНЫЕ ОПЕРАЦИИ', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.text('2.1. Подготовка к сварке:', 17, yPos);
        yPos += 5;
        doc.text('    • Очистка краев пленки от пыли и загрязнений', 19, yPos);
        yPos += 4;
        doc.text('    • Обезжиривание сварочных поверхностей', 19, yPos);
        yPos += 4;
        doc.text('    • Укладка канта по периметру с равномерным натяжением', 19, yPos);
        yPos += 4;
        doc.text('    • Фиксация канта зажимами через каждые 200мм', 19, yPos);
        yPos += 6;

        doc.text('2.2. Сварка канта:', 17, yPos);
        yPos += 5;
        doc.text('    • Настройка сварочного аппарата (t=380-420°C)', 19, yPos);
        yPos += 4;
        doc.text('    • Скорость сварки: 2-3 м/мин', 19, yPos);
        yPos += 4;
        doc.text('    • Контроль качества шва (герметичность, равномерность)', 19, yPos);
        yPos += 4;
        doc.text('    • Формовка углов с радиусом 3-5мм', 19, yPos);
        yPos += 4;
        doc.text('    • Охлаждение швов до комнатной температуры', 19, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.text('3. УСТАНОВКА КРЕПЕЖА', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        if (calculation.grommets) {
          doc.text('3.1. Установка люверсов:', 17, yPos);
          yPos += 5;
          doc.text('    • Разметка позиций люверсов (шаг 40-75мм)', 19, yPos);
          yPos += 4;
          doc.text('    • Пробивка отверстий d=8мм пробойником', 19, yPos);
          yPos += 4;
          doc.text('    • Установка люверсов с помощью пресса', 19, yPos);
          yPos += 4;
          doc.text('    • Контроль усилия установки (500-700 кг)', 19, yPos);
          yPos += 4;
          doc.text('    • Проверка прочности крепления (тест на вырыв)', 19, yPos);
        } else if (calculation.frenchLock) {
          doc.text('3.1. Установка французских замков:', 17, yPos);
          yPos += 5;
          doc.text('    • Разметка позиций замков на боковых сторонах', 19, yPos);
          yPos += 4;
          doc.text('    • Сверление отверстий под крепеж d=3мм', 19, yPos);
          yPos += 4;
          doc.text('    • Установка замков с герметизацией стыков', 19, yPos);
          yPos += 4;
          doc.text('    • Проверка работы механизма (открытие/закрытие)', 19, yPos);
          yPos += 4;
          doc.text('    • Смазка подвижных частей силиконовой смазкой', 19, yPos);
        }
        yPos += 8;

        doc.setFontSize(10);
        doc.text('4. КОНТРОЛЬ КАЧЕСТВА', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.text('4.1. Проверка геометрии:', 17, yPos);
        yPos += 5;
        doc.text(`    • Контроль размеров: ${calculation.a}×${calculation.b}мм (±3мм)`, 19, yPos);
        yPos += 4;
        doc.text('    • Проверка прямоугольности (диагонали)', 19, yPos);
        yPos += 4;
        doc.text('    • Измерение ширины канта (50±2мм)', 19, yPos);
        yPos += 6;

        doc.text('4.2. Проверка качества швов:', 17, yPos);
        yPos += 5;
        doc.text('    • Визуальный осмотр сварных швов', 19, yPos);
        yPos += 4;
        doc.text('    • Тест на герметичность (избыточное давление)', 19, yPos);
        yPos += 4;
        doc.text('    • Проверка прочности соединений', 19, yPos);
        yPos += 6;

        doc.text('4.3. Проверка крепежа:', 17, yPos);
        yPos += 5;
        if (calculation.grommets) {
          doc.text('    • Контроль установки всех люверсов', 19, yPos);
          yPos += 4;
          doc.text('    • Проверка отсутствия деформаций вокруг люверсов', 19, yPos);
        } else {
          doc.text('    • Контроль работы замков', 19, yPos);
          yPos += 4;
          doc.text('    • Проверка герметичности в закрытом состоянии', 19, yPos);
        }
        yPos += 8;

        doc.setFontSize(10);
        doc.text('5. ФИНИШНЫЕ ОПЕРАЦИИ', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.text('5.1. Очистка и упаковка:', 17, yPos);
        yPos += 5;
        doc.text('    • Удаление защитной пленки с ПВХ', 19, yPos);
        yPos += 4;
        doc.text('    • Очистка поверхности от загрязнений', 19, yPos);
        yPos += 4;
        doc.text('    • Антистатическая обработка', 19, yPos);
        yPos += 4;
        doc.text('    • Упаковка в защитную пленку', 19, yPos);
        yPos += 6;

        doc.text('5.2. Маркировка:', 17, yPos);
        yPos += 5;
        doc.text(`    • Размер: ${calculation.a}×${calculation.b}мм`, 19, yPos);
        yPos += 4;
        const filmTypeName = filmTypes.find(f => f.id === calculation.filmType)?.name || 'Прозрачная ПВХ';
        doc.text(`    • Материал: ${filmTypeName}`, 19, yPos);
        yPos += 4;
        doc.text('    • Дата изготовления', 19, yPos);
        yPos += 4;
        doc.text('    • Номер партии', 19, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.text('6. НОРМЫ ВРЕМЕНИ', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        const area = calculateArea();
        const prepTime = Math.max(15, Math.round(area * 5));
        const weldTime = Math.max(20, Math.round(area * 8));
        const installTime = calculation.grommets ? Math.max(10, Math.round(area * 6)) : Math.max(15, Math.round(area * 7));
        const qcTime = Math.max(10, Math.round(area * 3));
        const totalTime = prepTime + weldTime + installTime + qcTime;

        doc.text(`Подготовительные операции: ${prepTime} мин`, 17, yPos);
        yPos += 4;
        doc.text(`Сварочные операции: ${weldTime} мин`, 17, yPos);
        yPos += 4;
        doc.text(`Установка крепежа: ${installTime} мин`, 17, yPos);
        yPos += 4;
        doc.text(`Контроль качества: ${qcTime} мин`, 17, yPos);
        yPos += 4;
        doc.text(`ОБЩЕЕ ВРЕМЯ: ${totalTime} мин (${Math.round(totalTime/60*10)/10} ч)`, 17, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.text('7. ТРЕБОВАНИЯ БЕЗОПАСНОСТИ', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.text('    • Использование СИЗ (очки, перчатки, респиратор)', 17, yPos);
        yPos += 4;
        doc.text('    • Вентиляция рабочего места при сварке', 17, yPos);
        yPos += 4;
        doc.text('    • Заземление сварочного оборудования', 17, yPos);
        yPos += 4;
        doc.text('    • Противопожарная безопасность', 17, yPos);
        yPos += 4;
        doc.text('    • Первая помощь при ожогах', 17, yPos);
        if (calculation.frenchLock) {
          doc.text('✓ Французский замок', 15, yPos);
          yPos += 6;
          doc.text('  Материал: пластик, цвет красный', 17, yPos);
          yPos += 6;
        }
      }
      
      // Правая часть - чертеж
      doc.setFontSize(12);
      doc.text('ЧЕРТЕЖ:', 160, 50);
      
      // Рисуем чертеж прямоугольника
      if (calculation.shape === 'rectangle') {
        const rectX = 180;
        const rectY = 70;
        const rectW = 80;
        const rectH = 50;
        
        // Основной контур
        doc.setLineWidth(0.5);
        doc.rect(rectX, rectY, rectW, rectH);
        
        // Кант (жирная линия)
        doc.setLineWidth(2);
        doc.rect(rectX, rectY, rectW, rectH);
        
        // Размерные линии
        doc.setLineWidth(0.3);
        // Верхняя размерная линия
        doc.line(rectX, rectY - 10, rectX + rectW, rectY - 10);
        doc.line(rectX, rectY - 12, rectX, rectY - 8);
        doc.line(rectX + rectW, rectY - 12, rectX + rectW, rectY - 8);
        doc.text(`${calculation.a}мм`, rectX + rectW/2, rectY - 15, { align: 'center' });
        
        // Левая размерная линия
        doc.line(rectX - 10, rectY, rectX - 10, rectY + rectH);
        doc.line(rectX - 12, rectY, rectX - 8, rectY);
        doc.line(rectX - 12, rectY + rectH, rectX - 8, rectY + rectH);
        doc.text(`${calculation.b}мм`, rectX - 15, rectY + rectH/2, { align: 'center', angle: 90 });
        
        // Крепеж
        if (calculation.grommets) {
          // Люверсы на канте (по периметру)
          const grommetPositions = [
            // Верхний кант
            [rectX + 15, rectY],
            [rectX + rectW/2, rectY],
            [rectX + rectW - 15, rectY],
            // Нижний кант  
            [rectX + 15, rectY + rectH],
            [rectX + rectW/2, rectY + rectH],
            [rectX + rectW - 15, rectY + rectH],
            // Левый кант
            [rectX, rectY + 15],
            [rectX, rectY + rectH/2],
            [rectX, rectY + rectH - 15],
            // Правый кант
            [rectX + rectW, rectY + 15],
            [rectX + rectW, rectY + rectH/2],
            [rectX + rectW, rectY + rectH - 15]
          ];
          
          // Рисуем фотореалистичные люверсы
          grommetPositions.forEach(([x, y]) => {
            // Основа люверса (серый цвет)
            doc.setFillColor(192, 192, 192);
            doc.circle(x, y, 2, 'F');
            
            // Внутренний круг
            doc.setFillColor(232, 232, 232);
            doc.circle(x, y, 1.5, 'F');
            
            // Отверстие
            doc.setDrawColor(139, 69, 19);
            doc.setLineWidth(0.3);
            doc.circle(x, y, 1, 'S');
          });
          
          // Размерные линии между люверсами
          doc.setDrawColor(255, 102, 0);
          doc.setLineWidth(0.2);
          
          // Расстояние между первыми двумя люверсами на верхнем канте
          const gap1 = rectW/4 - 15; // расстояние между люверсами
          doc.line(rectX + 15, rectY - 3, rectX + 15 + gap1, rectY - 3);
          doc.line(rectX + 15, rectY - 5, rectX + 15, rectY - 1);
          doc.line(rectX + 15 + gap1, rectY - 5, rectX + 15 + gap1, rectY - 1);
          
          doc.setFontSize(7);
          doc.setTextColor(255, 102, 0);
          doc.text(`${Math.round(gap1 * 10)}мм`, rectX + 15 + gap1/2, rectY - 6, { align: 'center' });
          
          // Обозначение люверса
          doc.setFontSize(8);
          doc.setTextColor(66, 66, 66);
          doc.text('Металлические люверсы d=16мм', rectX + rectW + 5, rectY + 15);
          doc.text('Расстояние между люверсами: 40-75мм', rectX + rectW + 5, rectY + 25);
          doc.line(rectX + rectW, rectY + 15, rectX + rectW + 3, rectY + 15);
        }

        if (calculation.ringGrommets) {
          // Кольцевые люверсы в центральной части
          const ringGrommetPositions = [
            [rectX + rectW/4, rectY + rectH/3],
            [rectX + 3*rectW/4, rectY + rectH/3],
            [rectX + rectW/4, rectY + 2*rectH/3],
            [rectX + 3*rectW/4, rectY + 2*rectH/3]
          ].slice(0, calculation.ringGrommetsCount);
          
          // Рисуем фотореалистичные кольцевые люверсы
          ringGrommetPositions.forEach(([x, y]) => {
            // Внешнее кольцо (латунь)
            doc.setFillColor(184, 134, 11);
            doc.ellipse(x, y, 3, 2, 'F');
            
            // Внутреннее кольцо (блестящий металл)
            doc.setFillColor(230, 230, 230);
            doc.ellipse(x, y, 2.5, 1.7, 'F');
            
            // Центральное отверстие (овальное)
            doc.setDrawColor(80, 80, 80);
            doc.setLineWidth(0.8);
            doc.ellipse(x, y, 1.5, 1, 'S');
            
            // Блики на металле
            doc.setFillColor(255, 255, 255);
            doc.ellipse(x - 0.5, y - 0.3, 0.3, 0.2, 'F');
          });
          
          // Обозначение кольцевых люверсов
          doc.setFontSize(8);
          doc.setTextColor(184, 134, 11);
          doc.text('Кольцевые люверсы 42×22мм (латунь)', rectX + rectW + 5, rectY + 35);
          doc.text('Усиленные для тяжелых нагрузок', rectX + rectW + 5, rectY + 45);
        }

        if (calculation.frenchLock) {
          // Французские замки на боковых сторонах
          const lockPositions = [
            [rectX, rectY + rectH/3],
            [rectX, rectY + 2*rectH/3],
            [rectX + rectW, rectY + rectH/3],
            [rectX + rectW, rectY + 2*rectH/3]
          ];
          
          lockPositions.forEach(([x, y]) => {
            // Основание замка (золотистый)
            doc.setFillColor(184, 134, 11);
            doc.roundedRect(x-2, y-1.5, 4, 3, 0.3, 0.3, 'F');
            
            // Металлическая планка
            doc.setFillColor(192, 192, 192);
            doc.roundedRect(x-1.5, y-1, 3, 2, 0.2, 0.2, 'F');
            
            // Защелка
            doc.setFillColor(255, 215, 0);
            doc.roundedRect(x-0.5, y-0.5, 1, 1, 0.1, 0.1, 'F');
          });
          
          // Обозначение замка
          doc.setFontSize(8);
          doc.setTextColor(184, 134, 11);
          doc.text('Французские замки (съёмные)', rectX + rectW + 5, rectY + 25);
          doc.line(rectX + rectW, rectY + rectH/2, rectX + rectW + 3, rectY + 25);
        }
        
        // Французский замок
        if (calculation.frenchLock) {
          doc.setFillColor(255, 68, 68);
          doc.rect(rectX + rectW/2 - 8, rectY + rectH + 5, 16, 4, 'F');
          doc.setFontSize(8);
          doc.text('Французский замок', rectX + rectW/2, rectY + rectH + 15, { align: 'center' });
        }
      }
      
      // Технические требования
      yPos = 160;
      doc.setFontSize(12);
      doc.text('ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:', 15, yPos);
      yPos += 10;
      doc.setFontSize(9);
      doc.text('1. Материал: ПВХ пленка прозрачная, ГОСТ 16272-79', 15, yPos);
      yPos += 6;
      doc.text(`2. Кант: ПВХ лента шириной ${calculation.kantSize}мм, цвет коричневый`, 15, yPos);
      yPos += 6;
      doc.text('3. Люверсы: металл, диаметр 16мм, с шайбами', 15, yPos);
      yPos += 6;
      doc.text('4. Сварка: ультразвуковая, шов герметичный', 15, yPos);
      yPos += 6;
      doc.text('5. Допуски размеров: ±2мм', 15, yPos);
      
      // Подписи
      doc.setFontSize(10);
      doc.text('Разработал: ________________', 15, 195);
      doc.text('Проверил: ________________', 160, 195);
      doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 230, 195);
      
      // Сохранение
      doc.save(`Технологическая-карта-${currentShape?.name}-${calculation.a}x${calculation.b}-${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF файла');
    }
  };

  const renderShape = () => {
    const { shape, a, b } = calculation;
    
    switch (shape) {
      case 'rectangle':
        return (
          <svg width="400" height="320" className="border rounded bg-white">
            {/* Коричневый кант (ПВХ лента 12мм) */}
            <rect x="50" y="50" width="300" height="200" fill="#A0522D" stroke="none"/>
            
            {/* Голубая прозрачная пленка */}
            <rect x="62" y="62" width="276" height="176" fill="#B3E5FC" stroke="none"/>
            
            {/* Люверсы по периметру (соответствуют образцу) */}
            {calculation.grommets && (
              <>
                {/* Верхний ряд люверсов */}
                {[
                  [80, 50], [140, 50], [200, 50], [260, 50], [320, 50]
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
                  </g>
                ))}
                
                {/* Нижний ряд люверсов */}
                {[
                  [80, 250], [140, 250], [200, 250], [260, 250], [320, 250]
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
                  </g>
                ))}
                
                {/* Левый ряд люверсов */}
                {[
                  [50, 90], [50, 130], [50, 170], [50, 210]
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
                  </g>
                ))}
                
                {/* Правый ряд люверсов */}
                {[
                  [350, 90], [350, 130], [350, 170], [350, 210]
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="6" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    <circle cx={x} cy={y} r="4" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    <circle cx={x-2} cy={y-2} r="1.5" fill="rgba(255,255,255,0.8)"/>
                  </g>
                ))}
              </>
            )}

            {/* Размеры как на образце */}
            {/* Цифра 10 сверху */}
            <text x="200" y="35" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">{Math.round(a/10)}</text>
            {/* Цифра 10 снизу */}
            <text x="200" y="275" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">{Math.round(a/10)}</text>
            {/* Цифра 10 слева */}
            <text x="35" y="155" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">{Math.round(b/10)}</text>
            {/* Цифра 10 справа */}
            <text x="365" y="155" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">{Math.round(b/10)}</text>
            
            {/* Люверсы на канте */}
            {calculation.grommets && (
              <>
                {/* Фотореалистичные люверсы */}
                {[
                  [80, 50], [125, 50], [200, 50], [275, 50], [320, 50],
                  [80, 250], [125, 250], [200, 250], [275, 250], [320, 250],
                  [50, 90], [50, 130], [50, 170], [50, 210],
                  [350, 90], [350, 130], [350, 170], [350, 210]
                ].map(([x, y], i) => (
                  <g key={i}>
                    {/* Основа люверса */}
                    <circle cx={x} cy={y} r="6" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.5"/>
                    {/* Внутренний металлический круг */}
                    <circle cx={x} cy={y} r="4" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    {/* Отверстие */}
                    <circle cx={x} cy={y} r="2.5" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    {/* Блик металла */}
                    <circle cx={x-1} cy={y-1} r="1.5" fill="rgba(255,255,255,0.6)"/>
                    {/* Тень */}
                    <circle cx={x+0.5} cy={y+0.5} r="6" fill="rgba(0,0,0,0.1)" stroke="none"/>
                  </g>
                ))}
                
                {/* Размерные линии между люверсами */}
                {/* Расстояние между люверсами на верхнем канте */}
                <line x1="80" y1="40" x2="125" y2="40" stroke="#FF6600" strokeWidth="1"/>
                <line x1="80" y1="35" x2="80" y2="45" stroke="#FF6600" strokeWidth="1"/>
                <line x1="125" y1="35" x2="125" y2="45" stroke="#FF6600" strokeWidth="1"/>
                <text x="102.5" y="32" textAnchor="middle" fontSize="10" fill="#FF6600">45мм</text>
                
                <line x1="125" y1="40" x2="200" y2="40" stroke="#FF6600" strokeWidth="1"/>
                <line x1="125" y1="35" x2="125" y2="45" stroke="#FF6600" strokeWidth="1"/>
                <line x1="200" y1="35" x2="200" y2="45" stroke="#FF6600" strokeWidth="1"/>
                <text x="162.5" y="32" textAnchor="middle" fontSize="10" fill="#FF6600">75мм</text>
                
                {/* Расстояние между люверсами на левом канте */}
                <line x1="35" y1="90" x2="35" y2="130" stroke="#FF6600" strokeWidth="1"/>
                <line x1="30" y1="90" x2="40" y2="90" stroke="#FF6600" strokeWidth="1"/>
                <line x1="30" y1="130" x2="40" y2="130" stroke="#FF6600" strokeWidth="1"/>
                <text x="20" y="110" textAnchor="middle" fontSize="10" fill="#FF6600" transform="rotate(-90 20 110)">40мм</text>
                
                {/* Обозначение размеров между люверсами */}
                <text x="50" y="300" textAnchor="start" fontSize="9" fill="#FF6600">* Расстояние между люверсами: 40-75мм</text>
              </>
            )}

            {/* Французский замок */}
            {calculation.frenchLock && (
              <>
                {/* Замки на боковых сторонах */}
                {[
                  [50, 100], [50, 200], [350, 100], [350, 200]
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
                    {/* Блик */}
                    <rect x={x-5} y={y-3} width="2" height="1" fill="rgba(255,255,255,0.5)"/>
                  </g>
                ))}
              </>
            )}
                
            {/* Подписи */}
            <text x="200" y="155" textAnchor="middle" fontSize="14" fill="#1565C0" fontWeight="bold">Прозрачная пленка</text>
            <text x="200" y="175" textAnchor="middle" fontSize="12" fill="#5D4037">кант 5 см</text>
            
            {calculation.grommets && (
              <text x="200" y="10" textAnchor="middle" fontSize="12" fill="#424242">Люверсы диаметром 16мм (несъёмное крепление)</text>
            )}

            {/* Кольцевые люверсы на прямоугольнике */}
            {calculation.ringGrommets && (
              <>
                {[
                  [150, 120], [250, 120], [200, 170], [150, 220], [250, 220]
                ].slice(0, calculation.ringGrommetsCount).map(([x, y], i) => (
                  <g key={i}>
                    {/* Внешнее кольцо (латунь) */}
                    <ellipse cx={x} cy={y} rx="8" ry="5" fill="#B8860B" stroke="#A0700B" strokeWidth="0.5"/>
                    {/* Внутреннее кольцо (блестящий металл) */}
                    <ellipse cx={x} cy={y} rx="6.5" ry="4" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
                    {/* Центральное отверстие (овальное) */}
                    <ellipse cx={x} cy={y} rx="4" ry="2.5" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    {/* Блики на металле */}
                    <ellipse cx={x-1.5} cy={y-1} rx="1" ry="0.8" fill="rgba(255,255,255,0.7)"/>
                  </g>
                ))}
              </>
            )}
            
            {calculation.frenchLock && (
              <text x="200" y="10" textAnchor="middle" fontSize="12" fill="#B8860B">Французский замок (съёмное крепление)</text>
            )}
            
            {/* Размер светового проёма */}
            <line x1="70" y1="270" x2="330" y2="270" stroke="#666" strokeWidth="1"/>
            <text x="200" y="285" textAnchor="middle" fontSize="10" fill="#666">260мм (световой проём)</text>
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
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-300 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Солнце */}
        <div className="absolute top-10 right-16 w-20 h-20 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse">
          <div className="absolute inset-2 bg-yellow-300 rounded-full opacity-70"></div>
        </div>
        
        {/* Облака */}
        <div className="absolute top-8 left-1/4 animate-float">
          <div className="flex">
            <div className="w-16 h-8 bg-white/80 rounded-full"></div>
            <div className="w-20 h-10 bg-white/80 rounded-full -ml-4"></div>
            <div className="w-14 h-7 bg-white/80 rounded-full -ml-3"></div>
          </div>
        </div>
        
        <div className="absolute top-16 right-1/3 animate-float-delayed">
          <div className="flex">
            <div className="w-12 h-6 bg-white/70 rounded-full"></div>
            <div className="w-16 h-8 bg-white/70 rounded-full -ml-3"></div>
            <div className="w-10 h-5 bg-white/70 rounded-full -ml-2"></div>
          </div>
        </div>
        
        <div className="absolute top-6 left-1/2 animate-float-slow">
          <div className="flex">
            <div className="w-14 h-7 bg-white/60 rounded-full"></div>
            <div className="w-18 h-9 bg-white/60 rounded-full -ml-4"></div>
            <div className="w-12 h-6 bg-white/60 rounded-full -ml-3"></div>
          </div>
        </div>
        
        {/* Лес на заднем плане */}
        <div className="absolute bottom-0 left-0 w-full h-40">
          {/* Дальние горы/холмы */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-600/40 to-green-500/20 rounded-t-full transform scale-x-150"></div>
          
          {/* Деревья */}
          <div className="absolute bottom-0 left-8 w-4 h-28 bg-green-700 rounded-t-full"></div>
          <div className="absolute bottom-0 left-16 w-6 h-32 bg-green-800 rounded-t-full"></div>
          <div className="absolute bottom-0 left-28 w-5 h-26 bg-green-700 rounded-t-full"></div>
          <div className="absolute bottom-0 left-40 w-7 h-30 bg-green-800 rounded-t-full"></div>
          
          <div className="absolute bottom-0 right-8 w-5 h-24 bg-green-700 rounded-t-full"></div>
          <div className="absolute bottom-0 right-20 w-6 h-28 bg-green-800 rounded-t-full"></div>
          <div className="absolute bottom-0 right-32 w-4 h-22 bg-green-700 rounded-t-full"></div>
          
          {/* Кусты */}
          <div className="absolute bottom-0 left-60 w-8 h-12 bg-green-600 rounded-t-full"></div>
          <div className="absolute bottom-0 left-80 w-10 h-14 bg-green-600 rounded-t-full"></div>
          <div className="absolute bottom-0 right-60 w-6 h-10 bg-green-600 rounded-t-full"></div>
          
          {/* Полянка */}
          <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-green-400 to-green-300"></div>
        </div>
        
        {/* Летающие листочки */}
        <div className="absolute top-1/3 left-20 w-2 h-2 bg-green-500 rounded-full animate-fall opacity-60"></div>
        <div className="absolute top-1/4 right-32 w-1.5 h-1.5 bg-green-400 rounded-full animate-fall-delayed opacity-50"></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-green-600 rounded-full animate-fall-slow opacity-40"></div>
      </div>
      
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-sm border-b border-gray-800 relative z-10">
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
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Icon name="Phone" size={14} className="mr-1" />
                +7 (999) 123-45-67
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8 mb-8 bg-black border-black">
            <TabsTrigger value="main" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Главная</TabsTrigger>
            <TabsTrigger value="calculator" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Калькулятор</TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Услуги</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Портфолио</TabsTrigger>
            <TabsTrigger value="blueprint" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Чертежи</TabsTrigger>
            <TabsTrigger value="techcard" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Тех. карта</TabsTrigger>
            <TabsTrigger value="contract" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Договор</TabsTrigger>
            <TabsTrigger value="contacts" className="text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white hover:bg-gray-900">Контакты</TabsTrigger>
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


                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="a">Ширина (см)</Label>
                      <Input
                        id="a"
                        type="number"
                        value={calculation.a}
                        onChange={(e) => setCalculation(prev => ({ ...prev, a: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="b">Высота (см)</Label>
                      <Input
                        id="b"
                        type="number"
                        value={calculation.b}
                        onChange={(e) => setCalculation(prev => ({ ...prev, b: Number(e.target.value) }))}
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
                        <SelectItem value="15">15 мм</SelectItem>
                        <SelectItem value="20">20 мм (стандарт)</SelectItem>
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
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <div className="text-center space-y-2">
                          <p className="text-lg">
                            Площадь: <strong>{calculation.area.toFixed(2)} м²</strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            Периметр: <strong>{calculatePerimeter().toFixed(2)} м</strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            Кант: <strong>{calculation.kantSize}мм × {calculatePerimeter().toFixed(2)}м</strong>
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
                      <p className="font-medium">+7 (999) 123-45-67</p>
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