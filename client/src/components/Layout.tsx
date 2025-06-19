import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
};
