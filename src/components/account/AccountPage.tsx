import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-gray-900">Личный кабинет</CardTitle>
                <CardDescription className="text-gray-600">
                  Управляйте своим профилем и заказами
                </CardDescription>
              </div>
              <Button variant="outline" onClick={logout}>
                <Icon name="LogOut" className="mr-2" size={18} />
                Выйти
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="User" size={18} className="text-gray-500" />
                <span className="text-gray-700">
                  {user?.full_name || 'Не указано'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Mail" size={18} className="text-gray-500" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={18} className="text-gray-500" />
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
    </div>
  );
};

export default AccountPage;
