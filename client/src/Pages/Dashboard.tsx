import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'

interface ProjectField {
  name: string
  key: string
  type: string
}

interface Project {
  _id: string
  name: string
  description: string
  custom: Record<string, unknown>
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [fields, setFields] = useState<ProjectField[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  const fetchProjects = async () => {
    const res = await axios.get<Project[]>('/api/projects', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    setProjects(res.data)
  }

  const fetchFields = async () => {
    const res = await axios.get<ProjectField[]>('/api/settings/fields', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    setFields(res.data)
  }

  const createProject = async () => {
    await axios.post(
      '/api/projects',
      { name, description, custom: {} },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    setName('')
    setDescription('')
    fetchProjects()
  }

  const deleteProject = async (id: string) => {
    await axios.delete(`/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    fetchProjects()
  }

  useEffect(() => {
    fetchProjects()
    fetchFields()
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-3xl font-bold">Мои проекты</h1>

        {/* Форма добавления */}
        <Card>
          <CardHeader>
            <CardTitle>Добавить проект</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название проекта"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              onClick={createProject}
              className="w-full"
              disabled={!name.trim()}
            >
              Добавить
            </Button>
          </CardContent>
        </Card>

        {/* Таблица */}
        <Card>
          <CardHeader>
            <CardTitle>Список проектов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[320px] overflow-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-muted text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-2 py-1">ID</th>
                    <th className="px-2 py-1">Название</th>
                    {fields.map((f) => (
                      <th key={f.key} className="px-2 py-1">
                        {f.name}
                      </th>
                    ))}
                    <th className="px-2 py-1">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b hover:bg-accent transition"
                    >
                      <td className="px-2 py-1">{p._id.slice(-6)}</td>
                      <td className="px-2 py-1">
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/project/${p._id}`)}
                        >
                          {p.name}
                        </Button>
                      </td>
                      {fields.map((f) => {
                        const value = p.custom?.[f.key]
                        let display = '-'

                        if (f.type === 'date' && value) {
                          const date = new Date(value as string)
                          display = isNaN(date.getTime())
                            ? '-'
                            : date.toLocaleDateString()
                        } else if (value !== undefined && value !== null) {
                          display = String(value)
                        }

                        return (
                          <td key={f.key} className="px-2 py-1">
                            {display}
                          </td>
                        )
                      })}
                      <td className="flex gap-2 px-2 py-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/edit/${p._id}`)}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProject(p._id)}
                        >
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Dashboard
