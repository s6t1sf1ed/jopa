import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface Specification {
  name: string;
  spec: Record<string, string>;
}

interface Project {
  name: string;
  description: string;
  specifications: Specification[];
  custom: Record<string, unknown>;
}

const AddProjectPage = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>({
    name: '',
    description: '',
    specifications: [],
    custom: {},
  });
  const [specFields, setSpecFields] = useState<Field[]>([]);
  const [newSpec, setNewSpec] = useState<Specification>({ name: '', spec: {} });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSpecFields = async () => {
    const res = await axios.get<Field[]>('/api/settings/specification-fields', { headers });
    setSpecFields(res.data);
  };

  const handleAddSpecification = () => {
    if (!newSpec.name.trim()) return;
    setProject((prev) => ({
      ...prev,
      specifications: [...prev.specifications, newSpec],
    }));
    setNewSpec({ name: '', spec: {} });
  };

  const handleSave = async () => {
    await axios.post('/api/projects', project, { headers });
    navigate('/projects');
  };

  useEffect(() => {
    fetchSpecFields();
  }, []);

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Новый проект</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название проекта"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
            <Input
              placeholder="Описание"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Добавить спецификацию</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название спецификации"
              value={newSpec.name}
              onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
            />

            {specFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1">{field.name}</label>
                {field.type === 'string' && (
                  <Input
                    value={newSpec.spec[field.key] || ''}
                    onChange={(e) =>
                      setNewSpec((prev) => ({
                        ...prev,
                        spec: { ...prev.spec, [field.key]: e.target.value },
                      }))
                    }
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    value={newSpec.spec[field.key] || ''}
                    onChange={(e) =>
                      setNewSpec((prev) => ({
                        ...prev,
                        spec: { ...prev.spec, [field.key]: e.target.value },
                      }))
                    }
                  />
                )}
                {field.type === 'date' && (
                  <Input
                    type="date"
                    value={newSpec.spec[field.key] || ''}
                    onChange={(e) =>
                      setNewSpec((prev) => ({
                        ...prev,
                        spec: { ...prev.spec, [field.key]: e.target.value },
                      }))
                    }
                  />
                )}
              </div>
            ))}

            <Button onClick={handleAddSpecification}>Добавить спецификацию</Button>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
          Сохранить проект
        </Button>
      </div>
    </Layout>
  );
};

export default AddProjectPage;
