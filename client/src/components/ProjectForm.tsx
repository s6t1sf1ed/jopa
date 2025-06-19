import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Field {
  _id: string;
  name: string;
  key: string;
  type: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  specifications?: { name: string; value: string }[];
  custom?: Record<string, string | number>;
  spec?: Record<string, string>; // ✅ новые поля по шаблону
}

interface Props {
  fields: Field[];
  specFields?: Field[]; // ✅ добавлены
  initialData?: ProjectFormData;
  onSubmit: (data: ProjectFormData) => void;
}

const ProjectForm = ({ fields, specFields = [], initialData, onSubmit }: Props) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [custom, setCustom] = useState<Record<string, string | number>>(initialData?.custom || {});
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || []
  );
  const [spec, setSpec] = useState<Record<string, string>>(initialData?.spec || {});

  const updateCustom = (key: string, value: string) => {
    setCustom((prev) => ({ ...prev, [key]: value }));
  };

  const updateSpecification = (index: number, field: 'name' | 'value', value: string) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateSpecField = (key: string, value: string) => {
    setSpec((prev) => ({ ...prev, [key]: value }));
  };

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { name: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({ name, description, specifications, custom, spec });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Название проекта"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Описание проекта"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Пользовательские поля</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <Input
                key={field._id}
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                placeholder={field.name}
                value={custom[field.key] || ''}
                onChange={(e) => updateCustom(field.key, e.target.value)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {specFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Спецификации (по шаблону)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {specFields.map((field) => (
              <Input
                key={field._id}
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                placeholder={field.name}
                value={spec[field.key] || ''}
                onChange={(e) => updateSpecField(field.key, e.target.value)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Свободные спецификации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Название"
                value={spec.name}
                onChange={(e) => updateSpecification(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Значение"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
              />
              <Button variant="destructive" onClick={() => removeSpecification(index)}>
                ✕
              </Button>
            </div>
          ))}
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={addSpecification}>
            Добавить спецификацию
          </Button>
        </CardContent>
      </Card>

      <div className="text-right text-white">
        <Button onClick={handleSubmit}>Сохранить</Button>
      </div>
    </div>
  );
};

export default ProjectForm;
