import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { WindowCalculation, WindowItem, filmTypes, kantSizes, kantColors } from '@/components/window/types';
import { calculateGrommetsCount, calculateRingGrommetsCount } from '@/components/window/utils';
import { generatePDF } from '@/components/window/PDFGenerator';
import ShapeRenderer from '@/components/window/ShapeRenderer';
import CommercialProposal from '@/components/window/CommercialProposal';

interface CalculatorTabProps {
  calculation: WindowCalculation;
  setCalculation: React.Dispatch<React.SetStateAction<WindowCalculation>>;
  onCalculate: () => void;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({ calculation, setCalculation, onCalculate }) => {
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [proposalOpen, setProposalOpen] = useState(false);
  const [previewWindowId, setPreviewWindowId] = useState<string | null>(null);
  const [cart, setCart] = useState<WindowItem[]>([]);
  const [proposalWindows, setProposalWindows] = useState<WindowItem[]>([]);
  const [windows, setWindows] = useState<WindowItem[]>([{
    id: '1',
    shape: 'rectangle',
    верх: 1000,
    право: 1000,
    низ: 1000,
    лево: 1000,
    e: 0,
    grommets: false,
    grommetsCount: 0,
    ringGrommets: false,
    ringGrommetsCount: 0,
    frenchLock: false,
    frenchLockCount: 0,
    filmType: 'transparent',
    kantSize: 160,
    kantColor: 'white',
    area: 0,
    price: 0,
    measurement: false,
    installation: false
  }]);

  const downloadBlueprint = () => {
    const svg = document.querySelector('.blueprint-svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 320;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `чертеж-окно-${windows[0].верх}x${windows[0].право}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareToWhatsApp = () => {
    const text = `Чертеж мягкого окна:\n- Размеры: ${windows[0].верх}x${windows[0].право} мм\n- Площадь: ${windows[0].area.toFixed(2)} м²\n- Стоимость: ${windows[0].price.toFixed(0)} ₽`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const text = `Чертеж мягкого окна:\n- Размеры: ${windows[0].верх}x${windows[0].право} мм\n- Площадь: ${windows[0].area.toFixed(2)} м²\n- Стоимость: ${windows[0].price.toFixed(0)} ₽`;
    const url = `https://t.me/share/url?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const addWindow = () => {
    const newWindow: WindowItem = {
      id: Date.now().toString(),
      shape: 'rectangle',
      верх: 1000,
      право: 1000,
      низ: 1000,
      лево: 1000,
      e: 0,
      grommets: false,
      grommetsCount: 0,
      ringGrommets: false,
      ringGrommetsCount: 0,
      frenchLock: false,
      frenchLockCount: 0,
      filmType: 'transparent',
      kantSize: 160,
      kantColor: 'white',
      area: 0,
      price: 0,
      measurement: false,
      installation: false
    };
    setWindows([...windows, newWindow]);
  };

  const removeWindow = (id: string) => {
    if (windows.length > 1) {
      setWindows(windows.filter(w => w.id !== id));
    }
  };
  
  const addToCart = (window: WindowItem) => {
    setCart([...cart, { ...window, id: Date.now().toString() }]);
  };
  
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateWindow = (id: string, field: keyof WindowItem, value: number | boolean | string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const calculateWindowPrice = (window: WindowItem) => {
    const filmType = filmTypes.find(f => f.id === window.filmType);
    if (!filmType) return { area: 0, price: 0, perimeter: 0 };

    // Размеры верх, право, низ, лево - это размеры ПВХ пленки
    // Общий размер окна = размер ПВХ + кант/2 с каждой стороны
    const kantAddition = window.kantSize / 2;
    const totalWidth = window.верх + (2 * kantAddition);
    const totalHeight = window.право + (2 * kantAddition);

    // Площадь считаем по общим размерам окна
    const area = (totalWidth * totalHeight) / 1000000;
    let price = area * filmType.price;

    // Расчет канта (периметр в метрах * цена за метр)
    const perimeterMeters = ((totalWidth + totalHeight) * 2) / 1000;
    const kantType = kantSizes.find(k => k.size === window.kantSize);
    const kantPricePerMeter = kantType ? kantType.price : 150;
    price += perimeterMeters * kantPricePerMeter;

    if (window.grommets) price += window.grommetsCount * 40;
    if (window.ringGrommets) price += window.ringGrommetsCount * 55;
    if (window.frenchLock) price += window.frenchLockCount * 75;
    if (window.measurement) price += 2000;
    if (window.installation) price += area * 200;

    return { area, price, perimeter: perimeterMeters };
  };

  const calculateAllWindows = () => {
    try {
      console.log('Calculating windows:', windows);
      const updatedWindows = windows.map(w => {
        const { area, price, perimeter } = calculateWindowPrice(w);
        console.log('Window calculated:', { id: w.id, area, price, perimeter });
        return { ...w, area, price, perimeter };
      });
      console.log('Updated windows:', updatedWindows);
      setWindows(updatedWindows);
    } catch (error) {
      console.error('Error calculating windows:', error);
    }
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
                  <CardTitle className="text-gray-900 text-lg">
                    Окно {index + 1} <span className="text-sm font-normal text-gray-500">(Внесите сюда чистые размеры проема)</span>
                  </CardTitle>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-700 text-sm">Верх (мм)</Label>
                    <Input
                      type="number"
                      value={window.верх === 0 ? '' : window.верх}
                      onChange={(e) => updateWindow(window.id, 'верх', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="h-10 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Право (мм)</Label>
                    <Input
                      type="number"
                      value={window.право === 0 ? '' : window.право}
                      onChange={(e) => updateWindow(window.id, 'право', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="h-10 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Низ (мм)</Label>
                    <Input
                      type="number"
                      value={window.низ === 0 ? '' : window.низ}
                      onChange={(e) => updateWindow(window.id, 'низ', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="h-10 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 text-sm">Лево (мм)</Label>
                    <Input
                      type="number"
                      value={window.лево === 0 ? '' : window.лево}
                      onChange={(e) => updateWindow(window.id, 'лево', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="h-10 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <Label className="text-gray-700 text-sm">Размер канта</Label>
                    <Select value={window.kantSize.toString()} onValueChange={(value) => updateWindow(window.id, 'kantSize', Number(value))}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {kantSizes.map(kant => (
                          <SelectItem key={kant.size} value={kant.size.toString()}>
                            {kant.name} - {kant.price} ₽/м
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-gray-700 text-sm">Цвет канта</Label>
                    <Select value={window.kantColor} onValueChange={(value) => updateWindow(window.id, 'kantColor', value)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {kantColors.map(color => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`grommets-${window.id}`}
                      checked={window.grommets}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        const count = isChecked ? calculateGrommetsCount({
                          a: window.a,
                          b: window.b,
                          c: window.c,
                          d: window.d,
                          kantSize: window.kantSize
                        } as any) : 0;
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, grommets: isChecked, grommetsCount: count } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`grommets-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Люверсы 16мм (40 ₽/шт)
                    </Label>
                  </div>
                  {window.grommets && (
                    <div className="ml-6">
                      <Input
                        type="number"
                        value={window.grommetsCount === 0 ? '' : window.grommetsCount}
                        onChange={(e) => updateWindow(window.id, 'grommetsCount', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
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
                        const count = isChecked ? calculateRingGrommetsCount({
                          верх: window.верх,
                          право: window.право,
                          низ: window.низ,
                          лево: window.лево,
                          kantSize: window.kantSize
                        } as any) : 0;
                        const updatedWindows = windows.map(w => {
                          if (w.id === window.id) {
                            const frenchCount = w.frenchLock ? count : 0;
                            return { ...w, ringGrommets: isChecked, ringGrommetsCount: count, frenchLockCount: frenchCount };
                          }
                          return w;
                        });
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`ring-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Кольцевые люверсы 42х22 (55 ₽/шт)
                    </Label>
                  </div>
                  {window.ringGrommets && (
                    <div className="ml-6">
                      <Input
                        type="number"
                        value={window.ringGrommetsCount === 0 ? '' : window.ringGrommetsCount}
                        onChange={(e) => {
                          const newCount = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                          const updatedWindows = windows.map(w => {
                            if (w.id === window.id) {
                              const frenchCount = w.frenchLock ? newCount : w.frenchLockCount;
                              return { ...w, ringGrommetsCount: newCount, frenchLockCount: frenchCount };
                            }
                            return w;
                          });
                          setWindows(updatedWindows);
                        }}
                        className="w-20 h-8"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`french-${window.id}`}
                      checked={window.frenchLock}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        const count = isChecked ? window.ringGrommetsCount : 0;
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, frenchLock: isChecked, frenchLockCount: count } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`french-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Скоба поворотная (75 ₽/шт)
                    </Label>
                  </div>
                  {window.frenchLock && (
                    <div className="ml-6">
                      <Input
                        type="number"
                        value={window.frenchLockCount === 0 ? '' : window.frenchLockCount}
                        onChange={(e) => updateWindow(window.id, 'frenchLockCount', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`measurement-${window.id}`}
                      checked={window.measurement}
                      onCheckedChange={(checked) => {
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, measurement: checked === true } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`measurement-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Выполнить замер (+2000 ₽)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`installation-${window.id}`}
                      checked={window.installation}
                      onCheckedChange={(checked) => {
                        const updatedWindows = windows.map(w => 
                          w.id === window.id ? { ...w, installation: checked === true } : w
                        );
                        setWindows(updatedWindows);
                      }}
                    />
                    <Label htmlFor={`installation-${window.id}`} className="text-gray-700 text-sm cursor-pointer">
                      Монтаж (+200 ₽/м²)
                    </Label>
                  </div>
                </div>

                {window.area > 0 && (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-gray-700 text-sm">
                        Площадь: <strong>{window.area.toFixed(2)} м²</strong>
                      </p>
                      {window.perimeter && (
                        <p className="text-gray-700 text-sm">
                          Периметр канта: <strong>{window.perimeter.toFixed(2)} м</strong>
                        </p>
                      )}
                      <p className="text-gray-900 text-lg font-bold">
                        {window.price.toFixed(0)} ₽
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setPreviewWindowId(window.id)}
                      >
                        <Icon name="Eye" className="mr-2" size={18} />
                        Посмотреть чертёж
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => addToCart(window)}
                      >
                        <Icon name="ShoppingCart" className="mr-2" size={18} />
                        В корзину
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          <Button onClick={calculateAllWindows} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base" size="lg">
            <Icon name="Calculator" className="mr-2" />
            Рассчитать все окна
          </Button>

          {windows.some(w => w.area > 0) && (
            <>
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

              <Button 
                onClick={() => {
                  setProposalWindows(windows);
                  setProposalOpen(true);
                }} 
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base" 
                size="lg"
              >
                <Icon name="FileText" className="mr-2" />
                Скачать коммерческое предложение
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {windows[0] && windows[0].area > 0 && (
        <>
          <div className="space-y-4">
            {uploadedImage && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <div className="flex items-center">
                      <Icon name="Image" className="mr-2" />
                      Ваше фото беседки
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedImage('')}
                      className="border-gray-400 text-gray-600 hover:bg-gray-50"
                    >
                      <Icon name="X" className="mr-1" size={16} />
                      Удалить
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={uploadedImage} 
                    alt="Загруженное фото беседки" 
                    className="w-full h-auto rounded-lg border border-gray-200"
                  />
                </CardContent>
              </Card>
            )}

            {!uploadedImage && (
              <Card className="bg-white border-gray-200 border-dashed">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Icon name="Upload" size={32} className="text-gray-400" />
                    <p className="text-gray-600 text-sm text-center">Загрузите фото вашей беседки для сравнения с чертежом</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setUploadedImage(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Icon name="Upload" className="mr-1" size={16} />
                      Выбрать фото
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  <div className="flex items-center">
                    <Icon name="FileText" className="mr-2" />
                    Предварительный чертеж
                  </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToWhatsApp}
                    className="border-green-500 text-green-600 hover:bg-green-50 h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Icon name="MessageCircle" className="mr-1" size={14} />
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">WA</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToTelegram}
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Icon name="Send" className="mr-1" size={14} />
                    <span className="hidden sm:inline">Telegram</span>
                    <span className="sm:hidden">TG</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadBlueprint}
                    className="border-gray-400 text-gray-600 hover:bg-gray-50 h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Icon name="Download" className="mr-1" size={14} />
                    <span className="hidden sm:inline">Скачать</span>
                    <span className="sm:hidden">↓</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBlueprintOpen(true)}
                    className="border-gray-400 text-gray-600 hover:bg-gray-50 h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Icon name="Maximize2" className="mr-1" size={14} />
                    <span className="hidden sm:inline">Развернуть</span>
                    <span className="sm:hidden">⛶</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="cursor-pointer" onClick={() => setBlueprintOpen(true)}>
              <ShapeRenderer 
                calculation={{
                  ...windows[0],
                  quantity: 1
                }}
              />
            </CardContent>
            </Card>
          </div>

          <Dialog open={blueprintOpen} onOpenChange={setBlueprintOpen}>
            <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b bg-white flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToWhatsApp}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <Icon name="MessageCircle" className="mr-1" size={16} />
                    Отправить в WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToTelegram}
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Icon name="Send" className="mr-1" size={16} />
                    Отправить в Telegram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadBlueprint}
                    className="border-gray-400 text-gray-600 hover:bg-gray-50"
                  >
                    <Icon name="Download" className="mr-1" size={16} />
                    Скачать изображение
                  </Button>
                </div>
                <div className="flex items-center justify-center flex-1 p-8 bg-gray-50">
                  <div className="transform scale-150">
                    <ShapeRenderer 
                      calculation={{
                        ...windows[0],
                        quantity: 1
                      }}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {proposalOpen && (
        <CommercialProposal 
          windows={proposalWindows}
          onClose={() => setProposalOpen(false)}
        />
      )}
      
      <Dialog open={previewWindowId !== null} onOpenChange={() => setPreviewWindowId(null)}>
        <DialogContent className="max-w-4xl">
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Предварительный чертёж окна</h3>
            {previewWindowId && (() => {
              const window = windows.find(w => w.id === previewWindowId);
              if (!window) return null;
              return (
                <div className="flex justify-center">
                  <ShapeRenderer 
                    calculation={{
                      ...window,
                      quantity: 1
                    }}
                  />
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
      
      {cart.length > 0 && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="ShoppingCart" className="mr-2" />
                Корзина ({cart.length})
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCart([])}
                className="text-red-600 border-red-300"
              >
                <Icon name="Trash2" className="mr-1" size={16} />
                Очистить
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div>
                  <p className="font-medium">Окно {index + 1}</p>
                  <p className="text-sm text-gray-600">{item.верх}×{item.право} мм</p>
                  <p className="text-sm text-gray-600">Площадь: {item.area.toFixed(2)} м²</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg">{item.price.toFixed(0)} ₽</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600"
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </div>
            ))}
            <div className="bg-white p-4 rounded border-2 border-green-500">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">Итого:</span>
                <span className="text-2xl font-bold text-green-600">
                  {cart.reduce((sum, item) => sum + item.price, 0).toFixed(0)} ₽
                </span>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  setProposalWindows(cart);
                  setProposalOpen(true);
                }}
              >
                <Icon name="FileText" className="mr-2" />
                Сформировать коммерческое предложение
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatorTab;