import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, LogOut } from 'lucide-react';

const CustomerLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <NavLink to="/customer" className="font-display text-xl font-bold text-foreground">
            Lumiere
          </NavLink>
          <div className="flex items-center gap-2">
            <NavLink to="/customer/cart" className="relative rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </NavLink>
            <button onClick={handleLogout} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto flex gap-1 px-4 pb-2">
          <NavLink to="/customer" end className={({ isActive }) => `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
            Menu
          </NavLink>
          <NavLink to="/customer/orders" className={({ isActive }) => `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
            My Orders
          </NavLink>
          <NavLink to="/customer/feedback" className={({ isActive }) => `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
            Feedback
          </NavLink>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default CustomerLayout;
