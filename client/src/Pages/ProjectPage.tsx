import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  _id: string;
  name: string;
  description: string;
  custom: Record<string, string>;
  specifications: Specification[];
}

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectFields, setProjectFields] = useState<Field[]>([]);
  const [specFields, setSpecFields] = useState<Field[]>([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      const [proj, fields, specFields] = await Promise.all([
        axios.get<Project>(`/api/projects/${id}`, { headers }),
        axios.get<Field[]>('/api/settings/fields', { headers }),
        axios.get<Field[]>('/api/settings/specification-fields', { headers }),
      ]);
      setProject(proj.data);
      setProjectFields(fields.data);
      setSpecFields(specFields.data);
    };
    fetchData();
  }, [id]);

  if (!project) return null;

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>

        {/* Дополнительные поля */}
        <Card>
          <CardHeader>
            <CardTitle>Дополнительные поля</CardTitle>
          </CardHeader>
          <CardContent>
            {projectFields.length === 0 ? (
              <p className="text-muted-foreground">Нет полей</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {projectFields.map((field) => (
                    <tr key={field.key} className="border-b">
                      <td className="py-1 pr-4">{field.name}</td>
                      <td>{project.custom?.[field.key] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Спецификации */}
        <Card>
          <CardHeader>
            <CardTitle>Спецификации</CardTitle>
          </CardHeader>
          <CardContent>
            {project.specifications.length === 0 ? (
              <p className="text-muted-foreground">Нет спецификаций</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left">Название</th>
                    {specFields.map((field) => (
                      <th key={field.key} className="text-left">
                        {field.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {project.specifications.map((spec, idx) => (
                    <tr key={idx} className="border-b">
                      <td>{spec.name}</td>
                      {specFields.map((field) => (
                        <td key={field.key}>
                          {spec.spec?.[field.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectPage;
