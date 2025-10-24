import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { WindowItem } from '@/components/window/types';
import ShapeRenderer from '@/components/window/ShapeRenderer';

interface CartTabProps {
  cart: WindowItem[];
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const CartTab: React.FC<CartTabProps> = ({ cart, onRemoveFromCart, onClearCart, onCheckout }) => {
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTotalArea = () => {
    return cart.reduce((sum, item) => sum + item.area, 0);
  };

  if (cart.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="p-12 text-center">
          <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Корзина пуста</h3>
          <p className="text-gray-600">Добавьте окна из калькулятора в корзину</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 flex items-center">
            <Icon name="ShoppingCart" className="mr-2" />
            Корзина ({cart.length} {cart.length === 1 ? 'окно' : 'окон'})
          </CardTitle>
          {cart.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearCart}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Icon name="Trash2" className="mr-1" size={16} />
              Очистить корзину
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.map((item, index) => (
            <Card key={item.id} className="bg-gray-50 border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900 text-lg">
                    Окно {index + 1}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Верх:</span>
                    <span className="ml-2 font-semibold">{item.верх} мм</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Право:</span>
                    <span className="ml-2 font-semibold">{item.право} мм</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Низ:</span>
                    <span className="ml-2 font-semibold">{item.низ} мм</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Лево:</span>
                    <span className="ml-2 font-semibold">{item.лево} мм</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <ShapeRenderer calculation={item as any} />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-gray-700 text-sm">
                    Общая площадь: <strong>{item.area.toFixed(2)} м²</strong>
                  </p>
                  {item.perimeter && (
                    <p className="text-gray-700 text-sm">
                      Периметр канта: <strong>{item.perimeter.toFixed(2)} м</strong>
                    </p>
                  )}
                  <p className="text-gray-900 text-lg font-bold">
                    {item.price.toFixed(0)} ₽
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-900">
              <span>Количество окон:</span>
              <strong>{cart.length} шт</strong>
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
        onClick={onCheckout}
        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base" 
        size="lg"
      >
        <Icon name="FileText" className="mr-2" />
        Оформить заказ
      </Button>
    </div>
  );
};

export default CartTab;