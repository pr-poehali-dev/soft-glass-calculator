import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { WindowCalculation, kantColors, kantSizes } from '@/components/window/types';

interface TechCardTabProps {
  calculation: WindowCalculation;
}

const TechCardTab: React.FC<TechCardTabProps> = ({ calculation }) => {
  if (!calculation) {
    return <div>Нет данных расчета</div>;
  }
  
  const { верх, право, низ, лево, kantSize, kantColor, grommets, grommetsCount, ringGrommets, ringGrommetsCount, frenchLock, frenchLockCount } = calculation;
  
  const kantColorName = kantColors.find(k => k.id === kantColor)?.name || 'Белый';
  const kantSizeName = kantSizes.find(k => k.size === kantSize)?.name || `${kantSize} мм`;
  
  const pvcWidth = верх + 50;
  const pvcHeight = право + 50;
  const totalWidth = верх + kantSize;
  const totalHeight = право + kantSize;
  const kantHalfSize = kantSize / 2;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="FileText" size={24} className="text-primary" />
            <span>Технологическая карта производства мягких окон</span>
          </CardTitle>
          <CardDescription>
            Пошаговые инструкции для изготовления мягкого окна с размерами: {верх}×{право} мм (проем)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Icon name="Info" className="mr-2" size={18} />
              Параметры заказа
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Размер проема (Верх×Право):</strong> {верх}×{право} мм</div>
              <div><strong>Размер ПВХ полотна:</strong> {pvcWidth}×{pvcHeight} мм</div>
              <div><strong>Общий размер с кантом:</strong> {totalWidth}×{totalHeight} мм</div>
              <div><strong>Кант ПВХ:</strong> {kantSizeName}, {kantColorName}</div>
              {grommets && <div><strong>Люверсы 16мм (верх):</strong> {grommetsCount} шт</div>}
              {ringGrommets && <div><strong>Люверсы по бокам:</strong> {ringGrommetsCount} шт</div>}
              {frenchLock && <div><strong>Французские замки:</strong> {frenchLockCount} шт</div>}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="Settings" className="mr-2" />
                  1. ПОДГОТОВИТЕЛЬНЫЕ ОПЕРАЦИИ
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">1.1. Подготовка материалов</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Проверка качества ПВХ пленки (отсутствие дефектов, царапин, помутнений)</li>
                      <li>• Подготовка ПВХ канта {kantSizeName}, цвет {kantColorName}, длина: {((totalWidth + totalHeight) * 2 / 1000 * 1.05).toFixed(2)} м (с запасом 5%)</li>
                      <li>• Проверка крепежных элементов на целостность</li>
                      {grommets && <li>• Люверсы 16мм: {grommetsCount} шт (внешний диаметр 30 мм)</li>}
                      {ringGrommets && <li>• Кольцевые люверсы: {ringGrommetsCount} шт</li>}
                      {frenchLock && <li>• Французские замки: {frenchLockCount} комплектов</li>}
                      <li>• Контроль работоспособности инструмента и оборудования</li>
                    </ul>
                    <div className="mt-3 p-2 bg-blue-100 rounded">
                      <strong>Инструменты:</strong> линейка 3м, маркер несмываемый, ножницы, рулетка
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800">1.2. Раскрой ПВХ полотна</h4>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Расстелить ПВХ пленку на ровной чистой поверхности</li>
                      <li>• Разметить прямоугольник <strong>{pvcWidth}×{pvcHeight} мм</strong></li>
                      <li className="ml-4 text-xs">→ Верх: {верх} мм + 50 мм припуск = <strong>{pvcWidth} мм</strong></li>
                      <li className="ml-4 text-xs">→ Право: {право} мм + 50 мм припуск = <strong>{pvcHeight} мм</strong></li>
                      <li className="ml-4 text-xs">→ Низ: {низ} мм + 50 мм припуск = <strong>{низ + 50} мм</strong></li>
                      <li className="ml-4 text-xs">→ Лево: {лево} мм + 50 мм припуск = <strong>{лево + 50} мм</strong></li>
                      <li>• Проверить диагонали (должны быть равны ±2 мм)</li>
                      <li>• Вырезать полотно раскройным ножом по металлической линейке</li>
                      <li>• Контроль размеров кроя (допуск ±2 мм)</li>
                    </ul>
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <strong>Инструменты:</strong> раскройный нож, металлическая линейка 3м, угольник, рулетка
                    </div>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-medium text-teal-800">1.3. Подготовка канта</h4>
                    <ul className="text-sm text-teal-700 mt-2 space-y-1">
                      <li>• Нарезать кант ПВХ {kantSizeName}, цвет {kantColorName} на отрезки:</li>
                      <li className="ml-4">→ Верх: {(pvcWidth / 1000).toFixed(2)} м + 100 мм запас</li>
                      <li className="ml-4">→ Право: {(pvcHeight / 1000).toFixed(2)} м + 100 мм запас</li>
                      <li className="ml-4">→ Низ: {((низ + 50) / 1000).toFixed(2)} м + 100 мм запас</li>
                      <li className="ml-4">→ Лево: {((лево + 50) / 1000).toFixed(2)} м + 100 мм запас</li>
                      <li>• Кант укладывается: {kantHalfSize} мм на ПВХ + {kantHalfSize} мм за края</li>
                    </ul>
                    <div className="mt-3 p-2 bg-teal-100 rounded">
                      <strong>Инструменты:</strong> ножницы по ПВХ, рулетка, маркер
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="Zap" className="mr-2" />
                  2. СВАРОЧНЫЕ ОПЕРАЦИИ
                </h3>
                <div className="space-y-3">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-800">2.1. Подготовка к сварке</h4>
                    <ul className="text-sm text-orange-700 mt-2 space-y-1">
                      <li>• Очистить края ПВХ полотна от пыли мягкой тканью</li>
                      <li>• Обезжирить зону сварки спиртом или обезжиривателем (полоса 60 мм)</li>
                      <li>• Уложить кант {kantSizeName} по периметру: {kantHalfSize} мм на ПВХ, {kantHalfSize} мм за край</li>
                      <li>• Зафиксировать кант зажимами через каждые 200 мм</li>
                      <li>• Проверить равномерность укладки канта по всему периметру</li>
                    </ul>
                    <div className="mt-3 p-2 bg-orange-100 rounded">
                      <strong>Инструменты:</strong> обезжириватель, ветошь безворсовая, струбцины/зажимы
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800">2.2. Сварка канта по периметру</h4>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• Настроить сварочный аппарат ТВЧ: температура 380-420°C</li>
                      <li>• Установить скорость сварки: 2-3 м/мин</li>
                      <li>• Начать сварку с середины верхней стороны ({pvcWidth} мм)</li>
                      <li>• Формовать углы радиусом 3-5 мм (избегать острых углов)</li>
                      <li>• Прикатать шов прикаточным роликом с усилием 3-5 кг</li>
                      <li>• Визуально проверить качество шва (без пузырей, складок)</li>
                      <li>• Дать швам остыть до комнатной температуры (15-20 мин)</li>
                    </ul>
                    <div className="mt-3 p-2 bg-red-100 rounded">
                      <strong>Инструменты:</strong> сварочный аппарат ТВЧ, термофен, прикаточный ролик
                    </div>
                    <div className="mt-2 p-2 bg-red-200 rounded text-xs">
                      <strong>⚠️ ВНИМАНИЕ:</strong> Перегрев (более 430°C) приведет к деформации ПВХ!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="Wrench" className="mr-2" />
                  3. УСТАНОВКА КРЕПЕЖА
                </h3>
                <div className="space-y-3">
                  {grommets && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800">3.1. Люверсы 16мм на стороне A (верх)</h4>
                      <ul className="text-sm text-purple-700 mt-2 space-y-1">
                        <li>• Количество люверсов: <strong>{grommetsCount} шт</strong></li>
                        <li>• Разметка позиций на расстоянии от центра канта:</li>
                        <li className="ml-4">→ Первый люверс: в центре канта левого угла</li>
                        <li className="ml-4">→ Последний люверс: в центре канта правого угла</li>
                        <li className="ml-4">→ Расстояние между люверсами: {grommetsCount > 1 ? ((a + kantSize - kantSize) / (grommetsCount - 1)).toFixed(0) : '—'} мм</li>
                        <li>• Пробить отверстия d=8 мм пробойником</li>
                        <li>• Установить люверсы 16мм (внешний диаметр 30 мм) прессом</li>
                        <li>• Усилие установки: 500-700 кг</li>
                        <li>• Проверить прочность крепления каждого люверса</li>
                      </ul>
                      <div className="mt-3 p-2 bg-purple-100 rounded">
                        <strong>Инструменты:</strong> пробойник 8мм, люверсный пресс, штангенциркуль, линейка
                      </div>
                    </div>
                  )}

                  {ringGrommets && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-medium text-indigo-800">3.2. Кольцевые люверсы по бокам</h4>
                      <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                        <li>• Общее количество: <strong>{ringGrommetsCount} шт</strong></li>
                        <li>• Распределение по сторонам B и D (боковые стороны)</li>
                        <li>• Установка в центре канта с равномерным шагом</li>
                        <li>• Пробивка отверстий и установка аналогично п. 3.1</li>
                      </ul>
                      <div className="mt-3 p-2 bg-indigo-100 rounded">
                        <strong>Инструменты:</strong> пробойник, люверсный пресс, рулетка
                      </div>
                    </div>
                  )}
                  
                  {frenchLock && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">3.3. Французские замки (съемное крепление)</h4>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>• Количество замков: <strong>{frenchLockCount} комплектов</strong></li>
                        <li>• Разметка позиций замков на боковых сторонах (B и D)</li>
                        <li>• Сверление отверстий под крепеж d=3 мм</li>
                        <li>• Установка замков с герметизацией стыков силиконом</li>
                        <li>• Проверка работы механизма защелкивания</li>
                        <li>• Смазка подвижных частей силиконовой смазкой</li>
                      </ul>
                      <div className="mt-3 p-2 bg-yellow-100 rounded">
                        <strong>Инструменты:</strong> дрель, сверла 3мм, отвертка, герметик, смазка
                      </div>
                    </div>
                  )}

                  {!grommets && !ringGrommets && !frenchLock && (
                    <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                      <Icon name="AlertCircle" className="mx-auto mb-2" size={32} />
                      <p>Крепежные элементы не выбраны в калькуляторе</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="CheckCircle" className="mr-2" />
                  4. КОНТРОЛЬ КАЧЕСТВА
                </h3>
                <div className="space-y-3">
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-medium text-cyan-800">4.1. Проверка геометрии</h4>
                    <ul className="text-sm text-cyan-700 mt-2 space-y-1">
                      <li>• Размер ПВХ полотна: {pvcWidth}×{pvcHeight} мм (±3 мм)</li>
                      <li>• Общий размер с кантом: {totalWidth}×{totalHeight} мм (±3 мм)</li>
                      <li>• Диагонали должны быть равны (разница не более 5 мм)</li>
                      <li>• Ширина канта: {kantSizeName} ({kantHalfSize}+{kantHalfSize} мм), допуск ±2 мм</li>
                      <li>• Проверка прямоугольности углов угольником</li>
                    </ul>
                    <div className="mt-3 p-2 bg-cyan-100 rounded">
                      <strong>Инструменты:</strong> рулетка 5м, угольник, штангенциркуль
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-800">4.2. Проверка качества сварки</h4>
                    <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                      <li>• Визуальный осмотр сварных швов (ровность, отсутствие пузырей)</li>
                      <li>• Тест на герметичность: попытка расслоения шва вручную</li>
                      <li>• Проверка качества углов (радиус, отсутствие складок)</li>
                      <li>• Отсутствие непроваренных участков</li>
                    </ul>
                    <div className="mt-3 p-2 bg-emerald-100 rounded">
                      <strong>Инструменты:</strong> лупа 10х, источник света
                    </div>
                  </div>

                  <div className="bg-lime-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lime-800">4.3. Проверка крепежа</h4>
                    <ul className="text-sm text-lime-700 mt-2 space-y-1">
                      {grommets && <li>• Проверка прочности {grommetsCount} люверсов на стороне A (тест на вырыв 15 кг)</li>}
                      {ringGrommets && <li>• Проверка {ringGrommetsCount} боковых люверсов</li>}
                      {frenchLock && <li>• Тестирование {frenchLockCount} французских замков (50 циклов открытия/закрытия)</li>}
                      <li>• Отсутствие деформации материала вокруг крепежа</li>
                    </ul>
                    <div className="mt-3 p-2 bg-lime-100 rounded">
                      <strong>Инструменты:</strong> динамометр, лупа
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="Package" className="mr-2" />
                  5. УПАКОВКА И СДАЧА
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">5.1. Финишные операции</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Протереть изделие от пыли и следов маркера</li>
                    <li>• Аккуратно сложить окно по линиям канта</li>
                    <li>• Упаковать в защитную пленку</li>
                    <li>• Приклеить маркировку: "{a}×{b} мм, {totalWidth}×{totalHeight} мм с кантом"</li>
                    <li>• Заполнить паспорт изделия с указанием даты изготовления</li>
                    <li>• Передать на склад готовой продукции</li>
                  </ul>
                  <div className="mt-3 p-2 bg-gray-100 rounded">
                    <strong>Инструменты:</strong> упаковочная пленка, этикетки, маркер
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center">
              <Icon name="CheckCircle2" className="mr-2 text-green-600" size={20} />
              Изделие готово к отгрузке
            </h3>
            <p className="text-sm text-gray-700">
              Мягкое окно размером <strong>{a}×{b} мм</strong> (общий размер с кантом: <strong>{totalWidth}×{totalHeight} мм</strong>) прошло все этапы производства и контроля качества.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechCardTab;