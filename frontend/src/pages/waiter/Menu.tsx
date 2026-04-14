import { useEffect, useState } from 'react';
import { apiGetMenu, apiGetCategories, MenuItem, Category } from '@/services/api';

const WaiterMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetMenu(), apiGetCategories()])
      .then(([m, c]) => { setItems(m.menu); setCategories(c.categories); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = cat ? items.filter(i => i.category_id === cat) : items;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Menu</h1>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setCat(null)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{c.name}</button>
        ))}
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading menu…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="section-card">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <span className={`status-badge ${item.available ? 'status-available' : 'status-occupied'}`}>{item.available ? 'In Stock' : 'Out'}</span>
              </div>
              {item.description && <p className="text-xs text-muted-foreground mb-2">{item.description}</p>}
              <p className="tabular-nums font-semibold">₹{item.price.toFixed(2)}</p>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No items in this category</p>}
        </div>
      )}
    </div>
  );
};

export default WaiterMenu;
