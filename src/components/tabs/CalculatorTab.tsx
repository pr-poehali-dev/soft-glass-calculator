import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { WindowCalculation, shapes, filmTypes } from '@/components/window/types';
import { calculatePerimeter } from '@/components/window/utils';
import { generatePDF } from '@/components/window/PDFGenerator';
import ShapeRenderer from '@/components/window/ShapeRenderer';

interface CalculatorTabProps {
  calculation: WindowCalculation;
  setCalculation: React.Dispatch<React.SetStateAction<WindowCalculation>>;
  onCalculate: () => void;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({ calculation, setCalculation, onCalculate }) => {
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

            <div>
              <Label htmlFor="quantity">Количество окон</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={calculation.quantity}
                onChange={(e) => setCalculation(prev => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
              />
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

            <Button onClick={onCalculate} className="w-full">
              <Icon name="Calculator" className="mr-2" />
              Рассчитать
            </Button>

            {calculation.area > 0 && (() => {
              const { area, price, totalPrice, totalArea, quantity } = calculatePerimeter(calculation) && 
                { area: calculation.area, price: calculation.price, 
                  totalPrice: calculation.price * (calculation.quantity || 1), 
                  totalArea: calculation.area * (calculation.quantity || 1),
                  quantity: calculation.quantity || 1 };
              return (
                <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
                  <CardContent className="pt-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-white/80">
                        Количество: <strong>{quantity} {quantity === 1 ? 'окно' : quantity < 5 ? 'окна' : 'окон'}</strong>
                      </p>
                      <p className="text-lg text-white">
                        Площадь одного окна: <strong>{area.toFixed(2)} м²</strong>
                      </p>
                      {quantity > 1 && (
                        <p className="text-sm text-white/80">
                          Общая площадь: <strong>{totalArea.toFixed(2)} м²</strong>
                        </p>
                      )}
                      <p className="text-sm text-white/80">
                        Периметр: <strong>{calculatePerimeter(calculation).toFixed(2)} м</strong>
                      </p>
                      <p className="text-sm text-white/80">
                        Кант: <strong>{calculation.kantSize}мм × {calculatePerimeter(calculation).toFixed(2)}м</strong>
                      </p>
                      {(calculation.grommets && calculation.grommetsCount > 0) && (
                        <p className="text-sm text-white/80">
                          Люверсы 16мм: <strong>{calculation.grommetsCount} шт на окно</strong>
                        </p>
                      )}
                      {(calculation.ringGrommets && calculation.ringGrommetsCount > 0) && (
                        <p className="text-sm text-white/80">
                          Кольцевые люверсы 42×22мм: <strong>{calculation.ringGrommetsCount} шт на окно</strong>
                        </p>
                      )}
                      <div className="pt-2 border-t border-white/20 mt-3">
                        <p className="text-lg text-white/90">
                          Цена за одно окно: <strong>{price.toFixed(0)} ₽</strong>
                        </p>
                        {quantity > 1 && (
                          <p className="text-2xl font-bold text-cyan-300 mt-2">
                            Итого за {quantity} {quantity === 1 ? 'окно' : quantity < 5 ? 'окна' : 'окон'}: {totalPrice.toFixed(0)} ₽
                          </p>
                        )}
                        {quantity === 1 && (
                          <p className="text-2xl font-bold text-cyan-300 mt-2">
                            Итого: {price.toFixed(0)} ₽
                          </p>
                        )}
                      </div>
                      <Button onClick={() => generatePDF(calculation)} variant="outline" className="mt-3">
                        <Icon name="Download" className="mr-2" />
                        Скачать чертеж PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
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