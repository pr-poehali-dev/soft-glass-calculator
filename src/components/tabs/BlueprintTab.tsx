import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { WindowCalculation, shapes, filmTypes } from '@/components/window/types';
import { generatePDF } from '@/components/window/PDFGenerator';
import ShapeRenderer from '@/components/window/ShapeRenderer';

interface BlueprintTabProps {
  calculation: WindowCalculation;
}

const BlueprintTab: React.FC<BlueprintTabProps> = ({ calculation }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="FileText" className="mr-2" />
            Технологическая карта
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calculation.area > 0 ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Спецификация изделия</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Форма:</strong> {shapes.find(s => s.id === calculation.shape)?.name}</p>
                    <p><strong>Площадь:</strong> {calculation.area.toFixed(2)} м²</p>
                    <p><strong>Материал:</strong> {filmTypes.find(f => f.id === calculation.filmType)?.name}</p>
                    {calculation.grommets && <p><strong>Люверсы:</strong> Да</p>}
                    {calculation.frenchLock && <p><strong>Французский замок:</strong> Да</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Размеры (см)</h4>
                  <div className="space-y-2 text-sm">
                    {shapes.find(s => s.id === calculation.shape)?.params.map(param => (
                      <p key={param}>
                        <strong>{param.toUpperCase()}:</strong> {calculation[param as keyof WindowCalculation] as number}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center p-6 border rounded bg-gray-50">
                <ShapeRenderer calculation={calculation} />
              </div>

              <Button onClick={() => generatePDF(calculation)} className="w-full">
                <Icon name="Download" className="mr-2" />
                Скачать технологическую карту PDF
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Icon name="Calculator" size={48} className="mx-auto mb-4" />
              <p>Сначала выполните расчет в калькуляторе</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlueprintTab;
