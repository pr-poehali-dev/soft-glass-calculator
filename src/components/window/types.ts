export interface WindowCalculation {
  shape: string;
  верх: number;
  право: number;
  низ: number;
  лево: number;
  e: number;
  grommets: boolean;
  grommetsCount: number;
  frenchLock: boolean;
  frenchLockCount: number;
  ringGrommets: boolean;
  ringGrommetsCount: number;
  zipper: boolean;
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
  верх: number;
  право: number;
  низ: number;
  лево: number;
  e: number;
  grommets: boolean;
  grommetsCount: number;
  frenchLock: boolean;
  frenchLockCount: number;
  ringGrommets: boolean;
  ringGrommetsCount: number;
  zipper: boolean;
  filmType: string;
  kantSize: number;
  kantColor: string;
  area: number;
  price: number;
  measurement: boolean;
  installation: boolean;
  perimeter?: number;
}

export const shapes = [
  { id: 'rectangle', name: 'Прямоугольник', params: ['верх', 'право', 'низ', 'лево'] }
];

export const filmTypes = [
  { id: 'transparent', name: 'Прозрачная ПВХ', price: 700 },
  { id: 'tinted', name: 'Тонированная ПВХ', price: 800 }
];

export const kantSizes = [
  { size: 100, price: 75, name: '100 мм' },
  { size: 160, price: 150, name: '160 мм' },
  { size: 200, price: 180, name: '200 мм' },
  { size: 300, price: 210, name: '300 мм' }
];

export const kantColors = [
  { id: 'white', name: 'Белый' },
  { id: 'beige', name: 'Бежевый' },
  { id: 'brown', name: 'Коричневый' }
];