import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const TechCardTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="FileText" size={24} className="text-primary" />
            <span>Технологическая карта производства мягких окон</span>
          </CardTitle>
          <CardDescription>
            Пошаговые инструкции для изготовления качественных мягких окон с указанием инструментов и материалов
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <li>• Проверка качества ПВХ пленки (отсутствие дефектов, царапин)</li>
                      <li>• Подготовка канта ПВХ шириной 50мм (25мм с каждой стороны)</li>
                      <li>• Проверка крепежных элементов (люверсы 16мм)</li>
                      <li>• Контроль инструмента и оборудования</li>
                    </ul>
                    <div className="mt-3 p-2 bg-blue-100 rounded">
                      <strong>Инструменты:</strong> линейка, маркер, ножницы
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800">1.2. Раскрой материала</h4>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Разметка ПВХ полотна: размер стороны + 50мм припуск</li>
                      <li>• Кант 50мм: 25мм с каждой стороны по периметру</li>
                      <li>• Нарезка канта с запасом 5%</li>
                      <li>• Контроль размеров кроя (допуск ±2мм)</li>
                    </ul>
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <strong>Инструменты:</strong> раскройный нож, металлическая линейка, угольник
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
                      <li>• Очистка краев пленки от пыли и загрязнений</li>
                      <li>• Обезжиривание сварочных поверхностей</li>
                      <li>• Укладка канта по периметру с равномерным натяжением</li>
                      <li>• Фиксация канта зажимами через каждые 200мм</li>
                    </ul>
                    <div className="mt-3 p-2 bg-orange-100 rounded">
                      <strong>Инструменты:</strong> обезжириватель, ветошь, зажимы
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800">2.2. Сварка канта</h4>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• Настройка сварочного аппарата (t=380-420°C)</li>
                      <li>• Скорость сварки: 2-3 м/мин</li>
                      <li>• Контроль качества шва (герметичность)</li>
                      <li>• Формовка углов с радиусом 3-5мм</li>
                      <li>• Охлаждение швов до комнатной температуры</li>
                    </ul>
                    <div className="mt-3 p-2 bg-red-100 rounded">
                      <strong>Инструменты:</strong> сварочный аппарат ТВЧ, термофен, прикаточный ролик
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
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800">3.1. Люверсы 16мм (несъемное крепление)</h4>
                    <ul className="text-sm text-purple-700 mt-2 space-y-1">
                      <li>• Разметка позиций люверсов (внешний диаметр 30мм)</li>
                      <li>• Установка в центре канта (250-350мм между люверсами)</li>
                      <li>• Пробивка отверстий d=8мм пробойником</li>
                      <li>• Установка люверсов 16мм с помощью пресса</li>
                      <li>• Контроль усилия установки (500-700 кг)</li>
                      <li>• Проверка прочности крепления</li>
                    </ul>
                    <div className="mt-3 p-2 bg-purple-100 rounded">
                      <strong>Инструменты:</strong> пробойник, люверсный пресс, штангенциркуль
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800">3.2. Французские замки (съемное крепление)</h4>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Разметка позиций замков на боковых сторонах</li>
                      <li>• Сверление отверстий под крепеж d=3мм</li>
                      <li>• Установка замков с герметизацией стыков</li>
                      <li>• Проверка работы механизма</li>
                      <li>• Смазка подвижных частей</li>
                    </ul>
                    <div className="mt-3 p-2 bg-yellow-100 rounded">
                      <strong>Инструменты:</strong> дрель, сверла, отвертка, герметик, смазка
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="CheckCircle" className="mr-2" />
                  4. КОНТРОЛЬ КАЧЕСТВА
                </h3>
                <div className="space-y-3">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-800">4.1. Проверка геометрии</h4>
                    <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                      <li>• Контроль размеров изделия (допуск ±3мм)</li>
                      <li>• Проверка прямоугольности (диагонали)</li>
                      <li>• Измерение ширины канта: 50мм (25мм с каждой стороны ±2мм)</li>
                      <li>• Контроль припуска ПВХ: сторона + 50мм</li>
                    </ul>
                    <div className="mt-3 p-2 bg-indigo-100 rounded">
                      <strong>Инструменты:</strong> рулетка, угольник, штангенциркуль
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-medium text-teal-800">4.2. Проверка качества</h4>
                    <ul className="text-sm text-teal-700 mt-2 space-y-1">
                      <li>• Визуальный осмотр сварных швов</li>
                      <li>• Тест на герметичность (избыточное давление)</li>
                      <li>• Проверка прочности соединений</li>
                      <li>• Контроль работы крепежных элементов</li>
                    </ul>
                    <div className="mt-3 p-2 bg-teal-100 rounded">
                      <strong>Инструменты:</strong> манометр, динамометр, микроскоп
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="Package" className="mr-2" />
                  5. ФИНИШНЫЕ ОПЕРАЦИИ
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">5.1. Упаковка и маркировка</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Удаление защитной пленки с ПВХ</li>
                    <li>• Очистка поверхности от загрязнений</li>
                    <li>• Антистатическая обработка</li>
                    <li>• Упаковка в защитную пленку</li>
                    <li>• Маркировка с указанием размеров и даты</li>
                  </ul>
                  <div className="mt-3 p-2 bg-gray-100 rounded">
                    <strong>Инструменты:</strong> антистатик, упаковочная пленка, этикет-принтер
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Icon name="Timer" className="mr-2 text-primary" />
              НОРМЫ ВРЕМЕНИ ПРОИЗВОДСТВА
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">15-25 мин</div>
                <div>Подготовка</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-red-600">20-35 мин</div>
                <div>Сварка</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">10-20 мин</div>
                <div>Крепеж</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">60-90 мин</div>
                <div>Общее время</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <Icon name="Shield" className="mr-2" />
              ТРЕБОВАНИЯ БЕЗОПАСНОСТИ
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700">
              <ul className="space-y-2">
                <li>• Обязательное использование СИЗ (очки, перчатки, респиратор)</li>
                <li>• Вентиляция рабочего места при сварке ПВХ</li>
                <li>• Заземление сварочного оборудования</li>
              </ul>
              <ul className="space-y-2">
                <li>• Соблюдение противопожарной безопасности</li>
                <li>• Наличие средств первой помощи при ожогах</li>
                <li>• Регулярное обслуживание оборудования</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechCardTab;