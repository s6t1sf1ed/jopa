import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post('/api/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Регистрация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Почта" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={register}>
            Зарегистрироваться
          </Button>
          <Button variant="ghost" onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Назад
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
