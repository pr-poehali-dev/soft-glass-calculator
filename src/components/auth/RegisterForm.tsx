import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, fullName, phone);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Регистрация</CardTitle>
        <CardDescription className="text-gray-600">
          Создайте личный кабинет для управления заказами
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="fullName" className="text-gray-700">Полное имя</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">Пароль *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                Регистрация...
              </>
            ) : (
              <>
                <Icon name="UserPlus" className="mr-2" size={18} />
                Зарегистрироваться
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Войти
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
