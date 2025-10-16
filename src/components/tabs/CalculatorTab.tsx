import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { WindowCalculation, WindowItem, filmTypes } from '@/components/window/types';
import { calculateGrommetsCount, calculateRingGrommetsCount } from '@/components/window/utils';
import { generatePDF } from '@/components/window/PDFGenerator';
import ShapeRenderer from '@/components/window/ShapeRenderer';

interface CalculatorTabProps {
  calculation: WindowCalculation;
  setCalculation: React.Dispatch<React.SetStateAction<WindowCalculation>>;
  onCalculate: () => void;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({ calculation, setCalculation, onCalculate }) => {
  const [windows, setWindows] = useState<WindowItem[]>([{
    id: '1',
    shape: 'rectangle',
    a: 1000,
    b: 1000,
    c: 1000,
    d: 1000,
    e: 0,
    grommets: false,
    grommetsCount: 0,
    ringGrommets: false,
    ringGrommetsCount: 0,
    frenchLock: false,
    filmType: 'transparent',
    kantSize: 10,
    area: 0,
    price: 0
  }]);

  const addWindow = () => {
    const newWindow: WindowItem = {
      id: Date.now().toString(),
      shape: 'rectangle',
      a: 1000,
      b: 1000,
      c: 1000,
      d: 1000,
      e: 0,
      grommets: false,
      grommetsCount: 0,
      ringGrommets: false,
      ringGrommetsCount: 0,
      frenchLock: false,
      filmType: 'transparent',
      kantSize: 10,
      area: 0,
      price: 0
    };
    setWindows([...windows, newWindow]);
  };

  const removeWindow = (id: string) => {
    if (windows.length > 1) {
      setWindows(windows.filter(w => w.id !== id));
    }
  };

  const updateWindow = (id: string, field: keyof WindowItem, value: number | boolean | string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const calculateWindowPrice = (window: WindowItem) => {
    const filmType = filmTypes.find(f => f.id === window.filmType);
    if (!filmType) return { area: 0, price: 0 };

    const area = (window.a * window.b) / 1000000;
    let price = area * filmType.price;

    if (window.grommets) price += window.grommetsCount * 150;
    if (window.ringGrommets) price += window.ringGrommetsCount * 180;
    if (window.frenchLock) price += area * 80;

    return { area, price };
  };

  const calculateAllWindows = () => {
    const updatedWindows = windows.map(w => {
      const { area, price } = calculateWindowPrice(w);
      return { ...w, area, price };
    });
    setWindows(updatedWindows);
  };

  const calculateTotal = () => {
    return windows.reduce((sum, w) => sum + w.price, 0);
  };

  const calculateTotalArea = () => {
    return windows.reduce((sum, w) => sum + w.area, 0);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <Icon name="Calculator" className="mr-2" />
              Калькулятор мягких окон
            </div>
            <Button onClick={addWindow} variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Icon name="Plus" className="mr-1" size={16} />
              Добавить окно
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Рассчитайте стоимость изготовления по вашим размерам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {windows.map((window, index) => (
            <Card key={window.id} className="bg-gray-50 border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900 text-lg">Окно {index + 1}</CardTitle>
                  {windows.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeWindow(window.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icon name="X" size={18} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-700 text-sm">Сторона A (мм)</Label>
                    <Input
                      type="number"
                      value={window.a}
                      onChange={(e) => updateWindow(window.id, 'a', Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Сторона B (мм)</Label>
                    <Input
                      type="number"
                      value={window.b}
                      onChange={(e) => updateWindow(window.id, 'b', Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Сторона C (мм)</Label>
                    <Input
                      type="number"
                      value={window.c}
                      onChange={(e) => updateWindow(window.id, 'c', Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Сторона D (мм)</Label>
                    <Input
                      type="number"
                      value={window.d}
                      onChange={(e) => updateWindow(window.id, 'd', Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 text-sm">Тип ПВХ пленки</Label>
                  <Select value={window.filmType} onValueChange={(value) => updateWindow(window.id, 'filmType', value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
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

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`grommets-${window.id}`}
                      checked={window.grommets}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        const count = isChecked ? Math.ceil((window.a / 1000) / 0.3) : 0;
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, grommets: isChecked, grommetsCount: count } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`grommets-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Люверсы 16мм (150 ₽/шт)
                    </Label>
                  </div>
                  {window.grommets && (
                    <div className="ml-6">
                      <Input
                        type="number"
                        value={window.grommetsCount}
                        onChange={(e) => updateWindow(window.id, 'grommetsCount', parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`ring-${window.id}`}
                      checked={window.ringGrommets}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        const perimeter = (window.a + window.b * 2) / 1000;
                        const count = isChecked ? Math.ceil(perimeter / 0.35) : 0;
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, ringGrommets: isChecked, ringGrommetsCount: count } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`ring-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Кольцевые люверсы (180 ₽/шт)
                    </Label>
                  </div>
                  {window.ringGrommets && (
                    <div className="ml-6">
                      <Input
                        type="number"
                        value={window.ringGrommetsCount}
                        onChange={(e) => updateWindow(window.id, 'ringGrommetsCount', parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`french-${window.id}`}
                      checked={window.frenchLock}
                      onCheckedChange={(checked) => {
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, frenchLock: checked === true } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`french-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Французский замок (+80 ₽/м²)
                    </Label>
                  </div>
                </div>

                {window.area > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-gray-700 text-sm">
                      Площадь: <strong>{window.area.toFixed(2)} м²</strong>
                    </p>
                    <p className="text-gray-900 text-lg font-bold">
                      {window.price.toFixed(0)} ₽
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button onClick={calculateAllWindows} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            <Icon name="Calculator" className="mr-2" />
            Рассчитать все окна
          </Button>

          {windows.some(w => w.area > 0) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-900">
                    <span>Количество окон:</span>
                    <strong>{windows.length} шт</strong>
                  </div>
                  <div className="flex justify-between text-gray-900">
                    <span>Общая площадь:</span>
                    <strong>{calculateTotalArea().toFixed(2)} м²</strong>
                  </div>
                  <div className="flex justify-between text-gray-900 text-2xl font-bold pt-3 border-t border-blue-300">
                    <span>Итого:</span>
                    <span>{calculateTotal().toFixed(0)} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {windows[0] && windows[0].area > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Icon name="FileText" className="mr-2" />
              Предварительный чертеж
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ShapeRenderer 
              shape={windows[0].shape}
              calculation={{
                ...windows[0],
                quantity: 1
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatorTab;