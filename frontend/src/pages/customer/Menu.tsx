import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetMenu, apiGetCategories, MenuItem, Category } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem { id: number; name: string; price: number; qty: number; }

const CART_KEY = 'orderly_cart';
export const loadCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'); } catch { return []; }
};
export const saveCart = (items: CartItem[]) => localStorage.setItem(CART_KEY, JSON.stringify(items));

const CustomerMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(loadCart());
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([apiGetMenu(), apiGetCategories()])
      .then(([m, c]) => {
        setItems(m.menu.filter(i => i.available));
        setCategories(c.categories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (item: MenuItem) => {
    const updated = (() => {
      const existing = cart.find(c => c.id === item.id);
      if (existing) return cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...cart, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    })();
    setCart(updated);
    saveCart(updated);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const filtered = cat ? items.filter(i => i.category_id === cat) : items;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display">Welcome, {user?.name ?? 'Guest'}</h1>
          <p className="text-muted-foreground text-sm">Browse our menu</p>
        </div>
        {cartCount > 0 && (
          <button onClick={() => navigate('/customer/cart')}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Cart ({cartCount})
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setCat(null)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{c.name}</button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading menu…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="section-card flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                <p className="tabular-nums font-semibold text-sm mt-1">₹{item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => addToCart(item)}
                className="h-8 w-8 flex-shrink-0 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No items available</p>}
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
