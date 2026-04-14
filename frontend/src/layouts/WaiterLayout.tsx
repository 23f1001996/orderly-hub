import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Grid3X3, ClipboardList, UtensilsCrossed, Receipt, LogOut, Menu, X } from 'lucide-react';

const waiterLinks = [
  { to: '/waiter', icon: Grid3X3, label: 'Tables', end: true },
  { to: '/waiter/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/waiter/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/waiter/billing', icon: Receipt, label: 'Billing' },
];

const WaiterLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <nav className={`fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar p-5 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8">
          <h4 className="text-sidebar-primary-foreground font-display text-xl font-bold">Lumiere</h4>
          <p className="text-xs text-sidebar-foreground mt-0.5">Waiter Panel</p>
        </div>
        <div className="flex-1 space-y-1">
          {waiterLinks.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon className="h-4 w-4" />{label}
            </NavLink>
          ))}
        </div>
        <button onClick={handleLogout} className="nav-item mt-auto hover:text-destructive">
          <LogOut className="h-4 w-4" />Logout
        </button>
      </nav>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0] || 'W'}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default WaiterLayout;
