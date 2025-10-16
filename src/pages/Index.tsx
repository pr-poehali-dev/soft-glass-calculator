import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { WindowCalculation } from '@/components/window/types';
import { calculatePrice } from '@/components/window/utils';
import MainTab from '@/components/tabs/MainTab';
import CalculatorTab from '@/components/tabs/CalculatorTab';
import ServicesTab from '@/components/tabs/ServicesTab';
import PortfolioTab from '@/components/tabs/PortfolioTab';
import BlueprintTab from '@/components/tabs/BlueprintTab';
import TechCardTab from '@/components/tabs/TechCardTab';
import ContractTab from '@/components/tabs/ContractTab';
import ContactsTab from '@/components/tabs/ContactsTab';

const Index = () => {
  const [calculation, setCalculation] = useState<WindowCalculation>({
    shape: 'rectangle',
    a: 1000,
    b: 1000,
    c: 1000,
    d: 1000,
    e: 0,
    grommets: false,
    grommetsCount: 0,
    frenchLock: false,
    ringGrommets: false,
    ringGrommetsCount: 0,
    filmType: 'transparent',
    kantSize: 10,
    area: 0,
    price: 0,
    quantity: 1
  });

  const [activeTab, setActiveTab] = useState('calculator');

  const handleCalculate = () => {
    const { area, price } = calculatePrice(calculation);
    setCalculation(prev => ({ ...prev, area, price }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-400 relative">
      <header className="bg-white/10 backdrop-blur-sm shadow-sm border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-roboto font-bold text-white">Полимер-проект</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="bg-white/15 text-white border-white/40">
                <Icon name="Phone" size={14} className="mr-1" />
                +7 (921) 636-36-08
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8 mb-8 bg-white/10 border-white/20 backdrop-blur-sm">
            <TabsTrigger value="main" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Главная</TabsTrigger>
            <TabsTrigger value="calculator" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Калькулятор</TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Услуги</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Портфолио</TabsTrigger>
            <TabsTrigger value="blueprint" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Чертежи</TabsTrigger>
            <TabsTrigger value="techcard" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Тех. карта</TabsTrigger>
            <TabsTrigger value="contract" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Договор</TabsTrigger>
            <TabsTrigger value="contacts" className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white hover:bg-white/20">Контакты</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <MainTab onNavigateToCalculator={() => setActiveTab('calculator')} />
          </TabsContent>

          <TabsContent value="calculator">
            <CalculatorTab 
              calculation={calculation}
              setCalculation={setCalculation}
              onCalculate={handleCalculate}
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

      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <img 
            src="https://cdn.poehali.dev/files/e9509955-756f-46ec-924f-b4d6e05c7d03.png" 
            alt="Полимер-проект логотип" 
            className="h-64 object-contain"
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;