export interface WindowCalculation {
  shape: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  grommets: boolean;
  grommetsCount: number;
  frenchLock: boolean;
  frenchLockCount: number;
  ringGrommets: boolean;
  ringGrommetsCount: number;
  filmType: string;
  kantSize: number;
  kantColor: string;
  area: number;
  price: number;
  quantity: number;
  measurement: boolean;
  installation: boolean;
  windows?: WindowItem[];
}

export interface WindowItem {
  id: string;
  shape: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  grommets: boolean;
  grommetsCount: number;
  frenchLock: boolean;
  frenchLockCount: number;
  ringGrommets: boolean;
  ringGrommetsCount: number;
  filmType: string;
  kantSize: number;
  kantColor: string;
  area: number;
  price: number;
  measurement: boolean;
  installation: boolean;
}

export const shapes = [
  { id: 'rectangle', name: 'Прямоугольник', params: ['a', 'b', 'c', 'd'] }
];

export const filmTypes = [
  { id: 'transparent', name: 'Прозрачная ПВХ', price: 700 },
  { id: 'tinted', name: 'Тонированная ПВХ', price: 700 }
];

export const kantSizes = [
  { size: 160, price: 150, name: '160 мм' },
  { size: 200, price: 180, name: '200 мм' },
  { size: 300, price: 210, name: '300 мм' }
];

export const kantColors = [
  { id: 'white', name: 'Белый' },
  { id: 'beige', name: 'Бежевый' }
];