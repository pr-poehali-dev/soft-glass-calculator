import React from 'react';
import { WindowItem } from './types';
import Icon from '@/components/ui/icon';

interface CommercialProposalProps {
  windows: WindowItem[];
  onClose: () => void;
  globalMeasurement?: boolean;
}

const CommercialProposal: React.FC<CommercialProposalProps> = ({ windows, onClose, globalMeasurement = false }) => {
  const calculateTotal = () => {
    const windowsTotal = windows.reduce((sum, w) => sum + w.price, 0);
    const measurementCost = globalMeasurement ? 2000 : 0;
    return windowsTotal + measurementCost;
  };

  const calculateTotalArea = () => {
    return windows.reduce((sum, w) => sum + w.area, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const getFilmTypeName = (filmType: string) => {
    const types: Record<string, string> = {
      transparent: 'Прозрачная ПВХ',
      colored: 'Цветная ПВХ',
      textured: 'Текстурированная ПВХ'
    };
    return types[filmType] || filmType;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="print:hidden sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Коммерческое предложение</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Icon name="Printer" size={18} />
              Печать/PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 commercial-proposal-content">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Коммерческое предложение</h1>
            <p className="text-gray-600">на изготовление и монтаж мягких окон</p>
            <p className="text-sm text-gray-500 mt-2">Дата: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              Спецификация заказа
            </h2>
            
            {windows.map((window, index) => (
              <div key={window.id} className="mb-6 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Окно №{index + 1}</h3>
                
                <table className="w-full text-sm mb-3">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600">Размеры проема:</td>
                      <td className="py-2 text-right font-medium">{window.верх} x {window.право} мм</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600">Размеры ПВХ с припуском:</td>
                      <td className="py-2 text-right font-medium">{window.верх + 50} x {window.право + 50} мм</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600">Тип пленки:</td>
                      <td className="py-2 text-right font-medium">{getFilmTypeName(window.filmType)} (700 ₽/м²)</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600">Размер канта:</td>
                      <td className="py-2 text-right font-medium">{window.kantSize} мм (75 ₽/м)</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600">Площадь ПВХ:</td>
                      <td className="py-2 text-right font-medium">{window.area.toFixed(2)} м²</td>
                    </tr>
                  </tbody>
                </table>

                {(window.grommets || window.ringGrommets || window.frenchLock || window.installation) && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <p className="font-semibold text-gray-900 mb-2">Дополнительные опции:</p>
                    <ul className="space-y-1 text-sm">
                      {window.grommets && (
                        <li className="flex justify-between">
                          <span>• Люверсы 16мм ({window.grommetsCount} шт × 40 ₽)</span>
                          <span className="font-medium">{window.grommetsCount * 40} ₽</span>
                        </li>
                      )}
                      {window.ringGrommets && (
                        <>
                          <li className="flex justify-between">
                            <span>• Кольцевые люверсы 42х22 ({window.ringGrommetsCount} шт × 55 ₽)</span>
                            <span className="font-medium">{window.ringGrommetsCount * 55} ₽</span>
                          </li>
                          <li className="flex justify-between">
                            <span>• Скоба поворотная ({window.ringGrommetsCount} шт × 25 ₽)</span>
                            <span className="font-medium">{window.ringGrommetsCount * 25} ₽</span>
                          </li>
                        </>
                      )}
                      {window.frenchLock && (
                        <li className="flex justify-between">
                          <span>• Скоба поворотная ({window.frenchLockCount} шт × 25 ₽)</span>
                          <span className="font-medium">{window.frenchLockCount * 25} ₽</span>
                        </li>
                      )}

                      {window.installation && (
                        <li className="flex justify-between">
                          <span>• Монтаж ({window.area.toFixed(2)} м² × 200 ₽)</span>
                          <span className="font-medium">{(window.area * 200).toFixed(0)} ₽</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Стоимость окна №{index + 1}:</span>
                    <span className="font-bold text-xl text-blue-600">{window.price.toFixed(0)} ₽</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-900">Количество окон:</span>
                <span className="font-bold">{windows.length} шт</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-900">Общая площадь:</span>
                <span className="font-bold">{calculateTotalArea().toFixed(2)} м²</span>
              </div>
              {globalMeasurement && (
                <div className="flex justify-between text-lg pt-2 border-t border-blue-300">
                  <span className="text-gray-900">Выполнить замер:</span>
                  <span className="font-bold">2000 ₽</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-blue-300">
                <span className="text-gray-900">Итого к оплате:</span>
                <span className="text-blue-600">{calculateTotal().toFixed(0)} ₽</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Прайс-лист</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Материалы:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• ПВХ пленка — 700 ₽/м²</li>
                  <li>• Кант — 75 ₽/метр</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Фурнитура:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Люверс 16мм — 40 ₽/шт</li>
                  <li>• Люверс кольцевой 42х22 — 55 ₽/шт</li>
                  <li>• Французский замок — 70 ₽/м²</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Услуги:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Замер — 2000 ₽</li>
                  <li>• Монтаж — 200 ₽/м²</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
            <p className="mb-2"><strong>Условия:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Срок изготовления: от 3 до 7 рабочих дней</li>
              <li>Гарантия на изделия: 12 месяцев</li>
              <li>Оплата: 50% предоплата, 50% по факту монтажа</li>
            </ul>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Коммерческое предложение действительно 30 дней с даты формирования</p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4">От исполнителя:</p>
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Дата:</p>
                      <div className="border-b border-gray-400 pb-1">
                        <span className="text-sm">___ . ___ . 20___</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Подпись:</p>
                      <div className="border-b border-gray-400 pb-1 h-12"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center">М.П.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4">От заказчика:</p>
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Дата:</p>
                      <div className="border-b border-gray-400 pb-1">
                        <span className="text-sm">___ . ___ . 20___</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Подпись:</p>
                      <div className="border-b border-gray-400 pb-1 h-12"></div>
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">ФИО:</p>
                      <div className="border-b border-gray-400 pb-1 h-8"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .commercial-proposal-content,
          .commercial-proposal-content * {
            visibility: visible;
          }
          .commercial-proposal-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CommercialProposal;