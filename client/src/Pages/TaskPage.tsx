import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, PlusCircle, CheckCircle } from 'lucide-react';

import { api } from '@/lib/axios';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id?: string;
  title: string;
  description?: string;
  deadline?: string;
  createdAt?: string;
}

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(searchParams.get('project'));
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    api
      .get<Project[]>('/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Ошибка загрузки проектов', err));
  }, []);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) {
      setSelectedProjectId(projectId);
      api
        .get<Task[]>(`/projects/${projectId}/tasks`)
        .then((res) => setTasks(res.data))
        .catch((err) => console.error('Ошибка загрузки задач', err));
    } else {
      setSelectedProjectId(null);
      setTasks([]);
    }
  }, [searchParams]);

  const handleProjectChange = (value: string) => {
    setSearchParams({ project: value });
  };

  const addTask = async () => {
    if (!selectedProjectId || !newTask.title.trim()) return;
    const res = await api.post<Task>(`/projects/${selectedProjectId}/tasks`, newTask);
    setTasks([...tasks, res.data]);
    setNewTask({ title: '', description: '', deadline: '' });
  };

  const updateTask = async (updated: Task) => {
    if (!selectedProjectId || !updated._id) return;
    const res = await api.put<Task>(`/projects/${selectedProjectId}/tasks/${updated._id}`, updated);
    setTasks(tasks.map((t) => (t._id === updated._id ? res.data : t)));
  };

  const deleteTask = async (taskId: string) => {
    if (!selectedProjectId) return;
    await api.delete(`/projects/${selectedProjectId}/tasks/${taskId}`);
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Мои задачи</h1>

      <div className="max-w-xl mb-6">
        <Select onValueChange={handleProjectChange} value={selectedProjectId || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите проект" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProjectId && (
        <>
          <Card className="mb-6 shadow-md border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Новая задача</CardTitle>
              <Button variant="outline" onClick={addTask} className="gap-2">
                <PlusCircle size={16} />
                Добавить
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Заголовок"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Textarea
                placeholder="Описание"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Крайний срок</p>
                <Input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {tasks.map((task) => (
              <Card key={task._id} className="shadow-sm border border-border">
                <CardContent className="space-y-2 pt-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <Input
                      className="flex-1"
                      value={task.title}
                      onChange={(e) => updateTask({ ...task, title: e.target.value })}
                    />
                    {task.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays size={16} />
                        {format(new Date(task.createdAt), 'dd.MM.yyyy')}
                      </div>
                    )}
                  </div>
                  <Textarea
                    value={task.description}
                    onChange={(e) => updateTask({ ...task, description: e.target.value })}
                  />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Крайний срок</p>
                    <div className="flex items-center justify-between">
                      <Input
                        type="date"
                        className="w-fit"
                        value={task.deadline}
                        onChange={(e) => updateTask({ ...task, deadline: e.target.value })}
                      />
                      <Button
                        size="sm"
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => deleteTask(task._id!)}
                      >
                        <CheckCircle size={16} />
                        Завершить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
