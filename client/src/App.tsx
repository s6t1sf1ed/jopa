import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Pages/Dashboard';
import ProjectPage from './Pages/ProjectPage';
import SettingsPage from './Pages/SettingsPage';
import EditProject from '@/Pages/EditProject';
import TasksPage from './Pages/TaskPage';

const App = () => {
  const token = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/edit/:id" element={<EditProject />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/project/:id" element={token ? <ProjectPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<h1 className="text-white p-6">Страница не найдена</h1>} />
    </Routes>
  );
};

export default App;
