import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { WindowCalculation, WindowItem } from '@/components/window/types';
import { calculatePrice } from '@/components/window/utils';
import MainTab from '@/components/tabs/MainTab';
import CalculatorTab from '@/components/tabs/CalculatorTab';
import ServicesTab from '@/components/tabs/ServicesTab';
import PortfolioTab from '@/components/tabs/PortfolioTab';
import BlueprintTab from '@/components/tabs/BlueprintTab';
import TechCardTab from '@/components/tabs/TechCardTab';
import ContractTab from '@/components/tabs/ContractTab';
import ContactsTab from '@/components/tabs/ContactsTab';
import CartTab from '@/components/tabs/CartTab';

const Index = () => {
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

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'main';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleCalculate = () => {
    const { area, price } = calculatePrice(calculation);
    setCalculation(prev => ({ ...prev, area, price }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <header className="bg-white shadow-sm border-b border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-roboto font-bold text-gray-900">Полимер-проект</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge variant="outline" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 py-1">
                <Icon name="Phone" size={12} className="mr-1 sm:mr-1" />
                <span className="hidden sm:inline">+7 (921) 636-36-08</span>
                <span className="sm:hidden">Звонок</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-9 mb-4 sm:mb-8 bg-white shadow-sm border border-gray-200 h-auto p-1">
            <TabsTrigger value="main" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Главная</TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Калькулятор</TabsTrigger>
            <TabsTrigger value="cart" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2 relative">
              Корзина
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {cart.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Услуги</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Портфолио</TabsTrigger>
            <TabsTrigger value="blueprint" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Чертежи</TabsTrigger>
            <TabsTrigger value="techcard" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Тех. карта</TabsTrigger>
            <TabsTrigger value="contract" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Договор</TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs sm:text-sm text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 px-2 py-2">Контакты</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <MainTab onNavigateToCalculator={() => setActiveTab('calculator')} />
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
            <BlueprintTab calculation={calculation} />
          </TabsContent>

          <TabsContent value="techcard">
            <TechCardTab calculation={calculation} />
          </TabsContent>

          <TabsContent value="contract">
            <ContractTab />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-center">
          <img 
            src="https://cdn.poehali.dev/files/e9509955-756f-46ec-924f-b4d6e05c7d03.png" 
            alt="Полимер-проект логотип" 
            className="h-32 sm:h-48 lg:h-64 object-contain"
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;