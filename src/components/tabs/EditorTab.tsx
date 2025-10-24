import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import ImageEditor from '@/components/ImageEditor';

const EditorTab: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <Icon name="Pencil" className="mr-2" size={24} />
            Графический редактор разметки
          </CardTitle>
          <CardDescription className="text-gray-600">
            Загрузите фотографии объекта и добавьте к ним размеры и аннотации
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Icon name="Info" className="mr-2" size={18} />
              Как пользоваться редактором:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Загрузите фотографии объекта (до 10 штук)</li>
              <li>Кликните на любое изображение, чтобы открыть редактор</li>
              <li>Введите размер в поле редактора (например, "1200 мм")</li>
              <li>Нажмите на фото и протяните линию для указания размера</li>
              <li>Сохраните размеченное изображение</li>
              <li>Используйте размеченные фото в калькуляторе для отправки заявки</li>
            </ol>
          </div>

          <div>
            <Label htmlFor="editor-image-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors text-center bg-gray-50">
                <Icon name="Upload" className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="text-base font-medium text-gray-700 mb-1">
                  Нажмите для загрузки фотографий
                </p>
                <p className="text-sm text-gray-500">
                  Поддерживаются форматы: JPG, PNG, WEBP
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Загружено: {uploadedImages.length}/10
                </p>
              </div>
            </Label>
            <Input
              id="editor-image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const remaining = 10 - uploadedImages.length;
                const newFiles = files.slice(0, remaining);
                setUploadedImages([...uploadedImages, ...newFiles]);
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>

          {uploadedImages.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">
                  Загруженные изображения ({uploadedImages.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadedImages([])}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icon name="Trash2" className="mr-2" size={16} />
                  Удалить все
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Фото ${idx + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs text-gray-600 truncate">Фото {idx + 1}</p>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700"
                        onClick={() => setEditingImageIndex(idx)}
                      >
                        <Icon name="Pencil" className="mr-1" size={16} />
                        Разметить
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setUploadedImages(uploadedImages.filter((_, i) => i !== idx));
                        }}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <Icon name="CheckCircle2" className="text-green-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Изображения готовы к использованию
                    </p>
                    <p className="text-xs text-gray-600">
                      Перейдите во вкладку "Калькулятор" чтобы использовать размеченные фотографии в заявке
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {editingImageIndex !== null && (
        <ImageEditor
          image={uploadedImages[editingImageIndex]}
          onSave={(blob) => {
            const file = new File([blob], uploadedImages[editingImageIndex].name, { type: 'image/jpeg' });
            const updatedImages = [...uploadedImages];
            updatedImages[editingImageIndex] = file;
            setUploadedImages(updatedImages);
            setEditingImageIndex(null);
          }}
          onClose={() => setEditingImageIndex(null)}
        />
      )}
    </div>
  );
};

export default EditorTab;
