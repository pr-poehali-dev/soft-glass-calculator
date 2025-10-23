import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';
import { WindowCalculation, WindowItem } from '@/components/window/types';
import { calculatePrice } from '@/components/window/utils';
import CalculatorTab from '@/components/tabs/CalculatorTab';
import ServicesTab from '@/components/tabs/ServicesTab';
import PortfolioTab from '@/components/tabs/PortfolioTab';
import BlueprintTab from '@/components/tabs/BlueprintTab';
import TechCardTab from '@/components/tabs/TechCardTab';
import ContractTab from '@/components/tabs/ContractTab';
import ContactsTab from '@/components/tabs/ContactsTab';
import CartTab from '@/components/tabs/CartTab';

interface Order {
  id: number;
  order_data: any;
  total_price: number;
  status: string;
  created_at: string;
}

const ORDERS_API_URL = 'https://functions.poehali.dev/85c1e69a-c521-414b-87fd-f9c7ff0ad939';

const AccountPage: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [cart, setCart] = useState<WindowItem[]>([]);
  const [calculation, setCalculation] = useState<WindowCalculation>({
    shape: 'rectangle',
    верх: 1000,
    право: 1000,
    низ: 1000,
    лево: 1000,
    e: 0,
    grommets: false,
    grommetsCount: 0,
    frenchLock: false,
    frenchLockCount: 0,
    ringGrommets: false,
    ringGrommetsCount: 0,
    filmType: 'transparent',
    kantSize: 160,
    kantColor: 'white',
    area: 0,
    price: 0,
    quantity: 1,
    measurement: false,
    installation: false
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      const response = await fetch(ORDERS_API_URL, {
        method: 'GET',
        headers: {
          'X-Auth-Token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    const { area, price } = calculatePrice(calculation);
    setCalculation(prev => ({ ...prev, area, price }));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      new: { label: 'Новый', variant: 'default' },
      processing: { label: 'В работе', variant: 'secondary' },
      completed: { label: 'Выполнен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'destructive' },
    };

    const config = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-9 mb-8 bg-white shadow-sm border border-gray-200 h-auto p-1">
            <TabsTrigger value="profile" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Профиль
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="cart" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2 relative">
              Корзина
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {cart.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Услуги
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="blueprint" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Чертежи
            </TabsTrigger>
            <TabsTrigger value="techcard" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Тех. карта
            </TabsTrigger>
            <TabsTrigger value="contract" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Договор
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">
              Контакты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Информация о профиле</CardTitle>
                  <CardDescription className="text-gray-600">
                    Ваши личные данные
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={18} className="text-gray-500" />
                      <span className="text-gray-700 font-medium">Имя:</span>
                      <span className="text-gray-700">
                        {user?.full_name || 'Не указано'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Mail" size={18} className="text-gray-500" />
                      <span className="text-gray-700 font-medium">Email:</span>
                      <span className="text-gray-700">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={18} className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Телефон:</span>
                        <span className="text-gray-700">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Мои заказы</CardTitle>
                  <CardDescription className="text-gray-600">
                    История ваших заказов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Icon name="Loader2" className="animate-spin mx-auto mb-2" size={32} />
                      <p className="text-gray-600">Загрузка заказов...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="Package" className="mx-auto mb-2 text-gray-400" size={48} />
                      <p className="text-gray-600">У вас пока нет заказов</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">Заказ #{order.id}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="text-sm text-gray-600">
                              Окон: {order.order_data?.windows?.length || 0}
                            </span>
                            <span className="font-bold text-blue-600 text-lg">
                              {order.total_price.toFixed(0)} ₽
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator">
            <CalculatorTab 
              calculation={calculation}
              setCalculation={setCalculation}
              onCalculate={handleCalculate}
              cart={cart}
              setCart={setCart}
            />
          </TabsContent>

          <TabsContent value="cart">
            <CartTab 
              cart={cart}
              onRemoveFromCart={(id) => setCart(cart.filter(item => item.id !== id))}
              onClearCart={() => setCart([])}
              onCheckout={() => setActiveTab('calculator')}
            />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioTab />
          </TabsContent>

          <TabsContent value="blueprint">
            <BlueprintTab />
          </TabsContent>

          <TabsContent value="techcard">
            <TechCardTab />
          </TabsContent>

          <TabsContent value="contract">
            <ContractTab />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
