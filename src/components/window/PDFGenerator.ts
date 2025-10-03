import { WindowCalculation, shapes, filmTypes } from './types';
import { calculatePrice, calculatePerimeter } from './utils';

const transliterate = (text: string): string => {
  const cyrillicToLatin: Record<string, string> = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text.replace(/[А-Яа-яЁё]/g, (char) => cyrillicToLatin[char] || char);
};

export const generatePDF = async (calculation: WindowCalculation) => {
  try {
    const jsPDF = (await import('jspdf')).default;
    
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    const { area, price } = calculatePrice(calculation);
    const currentShape = shapes.find(s => s.id === calculation.shape);
    const currentFilm = filmTypes.find(f => f.id === calculation.filmType);
    
    const fabricWidth = calculation.a + 20;
    const fabricHeight = calculation.b + 20;
    const kantPerimeter = (calculation.a + calculation.b) * 2;
    const kantLength = Math.round(kantPerimeter / 10);
    const kantWithMargin = Math.round(kantLength * 1.05);
    const totalGrommets = calculation.grommetsCount + (calculation.ringGrommets ? calculation.ringGrommetsCount : 0);
    
    doc.setFontSize(16);
    doc.text(transliterate('ТЕХНОЛОГИЧЕСКАЯ КАРТА МЯГКОГО ОКНА'), 148, 20, { align: 'center' });
    doc.text(transliterate(`${currentShape?.name?.toUpperCase()} - ${calculation.a}x${calculation.b}мм`), 148, 30, { align: 'center' });
    
    doc.rect(10, 10, 277, 190);
    
    doc.setFontSize(12);
    let yPos = 50;
    doc.text(transliterate('СПЕЦИФИКАЦИЯ ИЗДЕЛИЯ:'), 15, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.text(transliterate(`Forma okna: ${currentShape?.name}`), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Ploschad: ${area.toFixed(2)} m²`), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Material: ${currentFilm?.name}`), 15, yPos);
    yPos += 6;
    doc.text(transliterate('Tolschina plenki: 0.5-0.8 mm'), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Kant: PVKh ${calculation.kantSize}mm, tsvet korichnevyy`), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Perimetr: ${calculatePerimeter(calculation).toFixed(2)} m`), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Stoimost: ${price.toFixed(0)} rub`), 15, yPos);
    
    yPos += 15;
    doc.setFontSize(12);
    doc.text(transliterate('RAZMERY:'), 15, yPos);
    yPos += 10;
    doc.setFontSize(10);
    
    doc.text(`Parametr A: ${calculation.a} mm`, 15, yPos); yPos += 6;
    doc.text(`Parametr B: ${calculation.b} mm`, 15, yPos); yPos += 6;
    doc.text(`Parametr C: ${calculation.c} mm`, 15, yPos); yPos += 6;
    doc.text(`Parametr D: ${calculation.d} mm`, 15, yPos); yPos += 6;
    
    yPos += 10;
    doc.setFontSize(12);
    doc.text(transliterate('ZAGOTOVKI:'), 15, yPos);
    yPos += 10;
    doc.setFontSize(10);
    
    doc.text(transliterate(`Razmer zagotovki polotna: ${fabricWidth}x${fabricHeight}mm (s pripuskami)`), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Razmer zagotovki kanta: ${kantWithMargin}sm (${kantLength}sm + 5% zapas)`), 15, yPos);
    yPos += 6;
    doc.text(transliterate(`Obschee kolichestvo lyuversov: ${totalGrommets} sht`), 15, yPos);
    
    yPos = 50;
    doc.setFontSize(12);
    doc.text(transliterate('TEKHNICHESKIE TREBOVANIYA:'), 150, yPos);
    yPos += 10;
    doc.setFontSize(10);
    
    doc.text(transliterate('1. Material: PVKh plenka prozrachnaya, GOST 16272-79'), 150, yPos);
    yPos += 6;
    doc.text(transliterate(`2. Kant: PVKh lenta shirinoj ${calculation.kantSize}mm, tsvet korichnevyy`), 150, yPos);
    yPos += 6;
    if (calculation.grommets && calculation.grommetsCount > 0) {
      doc.text(transliterate(`3. Lyuversy 16mm: ${calculation.grommetsCount} sht, TOLKO verkhniy kant, shag 30cm`), 150, yPos);
      yPos += 6;
    }
    if (calculation.ringGrommets && calculation.ringGrommetsCount > 0) {
      doc.text(transliterate(`4. Koltsevye lyuversy 42x22mm: ${calculation.ringGrommetsCount} sht, levyy/pravyy/nizhniy kant, shag 50cm`), 150, yPos);
      yPos += 6;
    }
    doc.text(transliterate('5. Svarka: ultrazvukovaya, shov germetichnyy'), 150, yPos);
    yPos += 6;
    doc.text(transliterate('5. Dopuski razmerov: ±2mm'), 150, yPos);
    
    doc.setFontSize(10);
    doc.text(transliterate('Razrabotal: ________________'), 15, 180);
    doc.text(transliterate('Proveril: ________________'), 150, 180);
    doc.text(`Data: ${new Date().toLocaleDateString('ru-RU')}`, 230, 180);
    
    const fileName = `Tekhnologicheskaya-karta-${transliterate(currentShape?.name || 'okno')}-A${calculation.a}xB${calculation.b}xC${calculation.c}xD${calculation.d}-${Date.now()}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Ошибка при создании PDF:', error);
    alert('Ошибка при создании PDF файла');
  }
};