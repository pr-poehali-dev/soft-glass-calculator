import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ContractTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="FileText" className="mr-2" />
            Договор на изготовление мягких окон
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm leading-relaxed space-y-4 max-h-96 overflow-y-auto p-4 border rounded">
            <h3 className="font-bold text-center">ДОГОВОР №___</h3>
            <h3 className="font-bold text-center">на изготовление и поставку мягких окон</h3>
            
            <p><strong>г. _____________ "_____" _________ 202_ г.</strong></p>
            
            <p>ИП Малюченко В.С., именуемый в дальнейшем "Исполнитель", действующий на основании свидетельства о государственной регистрации, с одной стороны, и _____________, именуемый в дальнейшем "Заказчик", с другой стороны, заключили настоящий договор о нижеследующем:</p>
            
            <h4 className="font-bold">1. ПРЕДМЕТ ДОГОВОРА</h4>
            <p>1.1. Исполнитель обязуется изготовить и поставить Заказчику мягкие окна согласно техническому заданию и спецификации, являющимися неотъемлемой частью настоящего договора.</p>
            
            <h4 className="font-bold">2. СТОИМОСТЬ И ПОРЯДОК РАСЧЕТОВ</h4>
            <p>2.1. Общая стоимость работ составляет _______ рублей, включая НДС.</p>
            <p>2.2. Предоплата составляет 50% от общей суммы договора.</p>
            <p>2.3. Окончательный расчет производится при получении готовой продукции.</p>
            
            <h4 className="font-bold">3. СРОКИ ВЫПОЛНЕНИЯ</h4>
            <p>3.1. Срок изготовления составляет ___ рабочих дней с момента получения предоплаты.</p>
            <p>3.2. Доставка и монтаж осуществляются в течение 3 рабочих дней после готовности изделия.</p>
            
            <h4 className="font-bold">4. ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА</h4>
            <p>4.1. Исполнитель предоставляет гарантию на изготовленные изделия сроком 24 месяца.</p>
            <p>4.2. Гарантия не распространяется на механические повреждения и нарушения правил эксплуатации.</p>
          </div>
          
          <div className="flex justify-between pt-4">
            <div className="text-center">
              <p className="font-medium">Исполнитель</p>
              <p className="text-sm text-gray-600 mt-8">_____________ / _____________</p>
            </div>
            <div className="text-center">
              <p className="font-medium">Заказчик</p>
              <p className="text-sm text-gray-600 mt-8">_____________ / _____________</p>
            </div>
          </div>

          <Button className="w-full">
            <Icon name="Download" className="mr-2" />
            Скачать договор PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTab;