import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

const items = [
  { name: 'Проекты', path: '/dashboard' },
  { name: 'Задачи', path: '/tasks' },
  { name: 'Сотрудники', path: '/users' },
  { name: 'Настройки', path: '/settings' }
]

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-muted border-r p-4 space-y-4 text-foreground">
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path

          return (
            <Button
              key={item.path}
              variant={isActive ? 'secondary' : 'ghost'}
              className={clsx('w-full justify-start', isActive && 'ring-2 ring-ring bg-accent text-accent-foreground')}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </Button>
          )
        })}
      </nav>

      <hr className="my-4 border-border" />

      <Button
        variant="destructive"
        className="w-full"
        onClick={logout}
      >
        Выйти
      </Button>
    </aside>
  )
}
