import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  custom: Record<string, string>;
}

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [specFields, setSpecFields] = useState<Field[]>([]);
  const [projectFields, setProjectFields] = useState<Field[]>([]);
  const [newSpec, setNewSpec] = useState<Specification>({ name: '', spec: {} });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProject = async () => {
    const res = await axios.get<Project>(`/api/projects/${id}`, { headers });
    setProject(res.data);
    setLoading(false);
  };

  const fetchFields = async () => {
    const [spec, proj] = await Promise.all([
      axios.get<Field[]>('/api/settings/specification-fields', { headers }),
      axios.get<Field[]>('/api/settings/fields', { headers }),
    ]);
    setSpecFields(spec.data);
    setProjectFields(proj.data);
  };

  useEffect(() => {
    fetchProject();
    fetchFields();
  }, []);

  const handleAddSpecification = () => {
    if (!newSpec.name.trim()) {
      alert('Введите название спецификации');
      return;
    }

    setProject((prev) =>
      prev
        ? {
            ...prev,
            specifications: [...(prev.specifications || []), newSpec],
          }
        : prev
    );
    setNewSpec({ name: '', spec: {} });
  };

  const handleSave = async () => {
    if (!project) return;

    const hasEmptySpecName = project.specifications.some((s) => !s.name.trim());
    if (hasEmptySpecName) {
      alert('У всех спецификаций должно быть заполнено название');
      return;
    }

    await axios.put(`/api/projects/${id}`, project, { headers });
    navigate('/dashboard');
  };

  if (loading || !project) return <div className="p-8">Загрузка...</div>;

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Редактирование проекта</h1>

        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
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

        {/* Пользовательские поля */}
        <Card>
          <CardHeader>
            <CardTitle>Пользовательские поля</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {projectFields.map((field) => (
              <Input
                key={field.key}
                type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                placeholder={field.name}
                value={project.custom?.[field.key] || ''}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          custom: { ...prev.custom, [field.key]: e.target.value },
                        }
                      : prev
                  )
                }
              />
            ))}
            </div>
          </CardContent>
        </Card>

        {/* Спецификации */}
        <Card>
          <CardHeader>
            <CardTitle>Спецификации</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {project.specifications.map((spec, index) => (
              <div key={index} className="space-y-2 border p-4 rounded">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Название спецификации"
                    value={spec.name}
                    onChange={(e) => {
                      const updated = [...project.specifications];
                      updated[index].name = e.target.value;
                      setProject({ ...project, specifications: updated });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const updated = [...project.specifications];
                      updated.splice(index, 1);
                      setProject({ ...project, specifications: updated });
                    }}
                  >
                    ✕
                  </Button>
                </div>

                {specFields.map((field) => (
                  <Input
                    key={field.key}
                    placeholder={field.name}
                    type={
                      field.type === 'date'
                        ? 'date'
                        : field.type === 'number'
                        ? 'number'
                        : 'text'
                    }
                    value={spec.spec?.[field.key] || ''}
                    onChange={(e) => {
                      const updated = [...project.specifications];
                      updated[index].spec = {
                        ...updated[index].spec,
                        [field.key]: e.target.value,
                      };
                      setProject({ ...project, specifications: updated });
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Новый блок добавления */}
            <div className="space-y-2 pt-4 border-t">
              <Input
                placeholder="Название спецификации"
                value={newSpec.name}
                onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
              />
              {specFields.map((field) => (
                <Input
                  key={field.key}
                  placeholder={field.name}
                  type={
                    field.type === 'date'
                      ? 'date'
                      : field.type === 'number'
                      ? 'number'
                      : 'text'
                  }
                  value={newSpec.spec[field.key] || ''}
                  onChange={(e) =>
                    setNewSpec((prev) => ({
                      ...prev,
                      spec: { ...prev.spec, [field.key]: e.target.value },
                    }))
                  }
                />
              ))}
              <Button onClick={handleAddSpecification} className="bg-green-600 hover:bg-green-700 text-white">Добавить спецификацию</Button>
            </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Сохранить проект
        </Button>
      </div>
    </Layout>
  );
};

export default EditProject;
