import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { WindowCalculation, WindowItem, shapes, filmTypes } from '@/components/window/types';
import { calculatePerimeter, calculateGrommetsCount, calculateRingGrommetsCount } from '@/components/window/utils';
import { generatePDF } from '@/components/window/PDFGenerator';
import ShapeRenderer from '@/components/window/ShapeRenderer';

interface CalculatorTabProps {
  calculation: WindowCalculation;
  setCalculation: React.Dispatch<React.SetStateAction<WindowCalculation>>;
  onCalculate: () => void;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({ calculation, setCalculation, onCalculate }) => {
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [showMultiWindow, setShowMultiWindow] = useState(false);

  const addWindow = () => {
    const newWindow: WindowItem = {
      id: Date.now().toString(),
      shape: calculation.shape,
      a: calculation.a,
      b: calculation.b,
      c: calculation.c,
      d: calculation.d,
      e: calculation.e,
      grommets: calculation.grommets,
      grommetsCount: calculation.grommetsCount,
      ringGrommets: calculation.ringGrommets,
      ringGrommetsCount: calculation.ringGrommetsCount,
      frenchLock: calculation.frenchLock,
      filmType: calculation.filmType,
      kantSize: calculation.kantSize,
      area: calculation.area,
      price: calculation.price
    };
    setWindows([...windows, newWindow]);
  };

  const removeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const updateWindow = (id: string, field: keyof WindowItem, value: number | boolean | string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const calculateTotal = () => {
    let total = calculation.price;
    windows.forEach(w => {
      total += w.price;
    });
    return total;
  };

  const calculateTotalArea = () => {
    let total = calculation.area;
    windows.forEach(w => {
      total += w.area;
    });
    return total;
  };

  return (
    <div className="space-y-6">
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

            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
              <Label className="text-white">Добавить окна с другими размерами</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowMultiWindow(!showMultiWindow)}
              >
                {showMultiWindow ? 'Скрыть' : 'Показать'}
              </Button>
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
                    onCheckedChange={(checked) => {
                      const autoCount = calculateGrommetsCount(calculation);
                      setCalculation(prev => ({ 
                        ...prev, 
                        grommets: checked as boolean, 
                        grommetsCount: checked ? autoCount : 0 
                      }));
                    }}
                  />
                  <Label htmlFor="grommets">Люверсы 16мм - только верхний кант (150 ₽/шт)</Label>
                </div>
                {calculation.grommets && (
                  <div className="ml-6 space-y-2">
                    <p className="text-xs text-white/60">
                      Рекомендуется: {calculateGrommetsCount(calculation)} шт (верх, шаг 30см)
                    </p>
                    <div className="flex items-center space-x-2">
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
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ringGrommets"
                    checked={calculation.ringGrommets}
                    onCheckedChange={(checked) => {
                      const autoCount = calculateRingGrommetsCount(calculation);
                      setCalculation(prev => ({ 
                        ...prev, 
                        ringGrommets: checked as boolean, 
                        ringGrommetsCount: checked ? autoCount : 0 
                      }));
                    }}
                  />
                  <Label htmlFor="ringGrommets">Кольцевые люверсы 42×22мм - левый/правый/нижний кант (180 ₽/шт)</Label>
                </div>
                {calculation.ringGrommets && (
                  <div className="ml-6 space-y-2">
                    <p className="text-xs text-white/60">
                      Рекомендуется: {calculateRingGrommetsCount(calculation)} шт (л/п/н, шаг 35мм)
                    </p>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="ringGrommetsCount" className="text-sm">Количество:</Label>
                      <Input
                        id="ringGrommetsCount"
                        type="number"
                        min="0"
                        max="50"
                        value={calculation.ringGrommetsCount}
                        onChange={(e) => setCalculation(prev => ({ ...prev, ringGrommetsCount: parseInt(e.target.value) || 0 }))}
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-sm text-gray-500">шт</span>
                    </div>
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

            <Button onClick={onCalculate} className="w-full">
              <Icon name="Calculator" className="mr-2" />
              Рассчитать
            </Button>

            {showMultiWindow && calculation.area > 0 && (
              <div className="space-y-3">
                <Button 
                  onClick={addWindow} 
                  variant="outline" 
                  className="w-full"
                >
                  <Icon name="Plus" className="mr-2" />
                  Добавить окно с текущими параметрами
                </Button>

                {windows.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Добавленные окна:</Label>
                    {windows.map((window, index) => (
                      <Card key={window.id} className="bg-white/20 border-white/30">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 text-sm text-white/90">
                              <p className="font-semibold">Окно {index + 2}</p>
                              <p className="text-xs">A:{window.a}, B:{window.b}, C:{window.c}, D:{window.d}мм</p>
                              <p className="text-xs">{window.area.toFixed(2)} м² • {window.price.toFixed(0)} ₽</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeWindow(window.id)}
                              className="text-white/70 hover:text-red-400"
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {calculation.area > 0 && (
              <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <p className="text-lg text-white font-semibold">
                      Окно 1
                    </p>
                    <p className="text-sm text-white/80">
                      Площадь: <strong>{calculation.area.toFixed(2)} м²</strong>
                    </p>
                    <p className="text-sm text-white/80">
                      Периметр: <strong>{calculatePerimeter(calculation).toFixed(2)} м</strong>
                    </p>
                    <p className="text-sm text-white/80">
                      Кант: <strong>{calculation.kantSize}мм × {calculatePerimeter(calculation).toFixed(2)}м</strong>
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
                    <p className="text-lg text-white/90">
                      Цена: <strong>{calculation.price.toFixed(0)} ₽</strong>
                    </p>

                    {windows.length > 0 && (
                      <div className="pt-3 border-t border-white/20 mt-3 space-y-1">
                        <p className="text-sm text-white/80">
                          Всего окон: <strong>{windows.length + 1}</strong>
                        </p>
                        <p className="text-sm text-white/80">
                          Общая площадь: <strong>{calculateTotalArea().toFixed(2)} м²</strong>
                        </p>
                        <p className="text-2xl font-bold text-cyan-300 mt-2">
                          Итого: {calculateTotal().toFixed(0)} ₽
                        </p>
                      </div>
                    )}

                    <Button onClick={() => generatePDF(calculation)} variant="outline" className="mt-3">
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
            <ShapeRenderer calculation={calculation} />
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
    </div>
  );
};

export default CalculatorTab;