import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

interface Field {
  _id: string;
  name: string;
  key: string;
  type: string;
}

const SettingsPage = () => {
  const [mode, setMode] = useState<'project' | 'specification'>('project');
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState('string');
  const [projectFields, setProjectFields] = useState<Field[]>([]);
  const [specFields, setSpecFields] = useState<Field[]>([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchFields = async () => {
    const [proj, spec] = await Promise.all([
      axios.get<Field[]>('/api/settings/fields', { headers }),
      axios.get<Field[]>('/api/settings/specification-fields', { headers }),
    ]);
    setProjectFields(proj.data);
    setSpecFields(spec.data);
  };

  const addField = async () => {
    const endpoint =
      mode === 'project'
        ? '/api/settings/fields'
        : '/api/settings/specification-fields';

    try {
      await axios.post(endpoint, { name, key, type }, { headers });
      setName('');
      setKey('');
      setType('string');
      fetchFields();
    } catch (err: any) {
      const msg = err.response?.data?.error || '';
      if (msg.includes('duplicate')) {
        alert('Ключ уже существует');
      } else {
        alert('Ошибка при добавлении');
      }
    }
  };

  const deleteField = async (id: string) => {
    const endpoint =
      mode === 'project'
        ? `/api/settings/fields/${id}`
        : `/api/settings/specification-fields/${id}`;

    await axios.delete(endpoint, { headers });
    fetchFields();
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const fieldsToShow = mode === 'project' ? projectFields : specFields;

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Переключатель */}
        <div className="flex gap-4">
          <Button
            onClick={() => setMode('project')}
            className={`px-4 py-2 rounded font-medium transition ${
              mode === 'project'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-white hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
            }`}
          >
            Поля проекта
          </Button>
          <Button
            onClick={() => setMode('specification')}
            className={`px-4 py-2 rounded font-medium transition ${
              mode === 'project'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-white hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
            }`}
          >
            Поля спецификации
          </Button>
        </div>

        {/* Форма */}
        <Card>
          <CardHeader>
            <CardTitle>Добавить пользовательское поле</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Ключ (латиницей)" value={key} onChange={(e) => setKey(e.target.value)} />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-white"
            >
              <option value="string" className="text-black bg-white">Текст</option>
              <option value="date" className="text-black bg-white">Дата</option>
              <option value="number" className="text-black bg-white">Число</option>
            </select>
            <Button onClick={addField} className="bg-blue-600 text-white hover:bg-blue-700">
              Добавить
            </Button>
          </CardContent>
        </Card>

        {/* Таблица */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'project' ? 'Поля проекта' : 'Колонки спецификации'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fieldsToShow.length === 0 ? (
              <p className="text-muted-foreground">Нет полей</p>
            ) : (
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="font-bold">#</th>
                      <th className="font-bold">Название</th>
                      <th className="font-bold">Ключ</th>
                      <th className="font-bold">Тип</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldsToShow.map((field, index) => (
                      <tr key={field._id} className="border-b hover:bg-muted">
                        <td className="text-muted-foreground">{index + 1}</td>
                        <td>{field.name}</td>
                        <td><code>{field.key}</code></td>
                        <td>{field.type}</td>
                        <td>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteField(field._id)}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
