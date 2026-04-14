import { useEffect, useState } from 'react';
import { Plus, Edit2, X, Trash2, Tag } from 'lucide-react';
import {
  apiGetMenu, apiGetCategories, apiCreateMenuItem, apiUpdateMenuItem, apiDeleteMenuItem,
  apiCreateCategory, apiDeleteCategory, MenuItem, Category,
} from '@/services/api';

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newCatName, setNewCatName] = useState('');

  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', is_available: 'true',
  });

  const load = () => {
    setLoading(true);
    Promise.all([apiGetMenu(), apiGetCategories()])
      .then(([menuRes, catRes]) => {
        setItems(menuRes.menu);
        setCategories(catRes.categories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // When categories load and form has no category selected, default to first
  useEffect(() => {
    if (categories.length > 0 && !form.category_id) {
      setForm(f => ({ ...f, category_id: String(categories[0].id) }));
    }
  }, [categories]);

  const openAdd = () => {
    setEditItem(null);
    setForm({
      name: '', description: '', price: '',
      category_id: categories[0] ? String(categories[0].id) : '',
      is_available: 'true',
    });
    setShowForm(true);
    setError('');
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      category_id: String(item.category_id ?? (categories[0]?.id ?? '')),
      is_available: item.available ? 'true' : 'false',
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) { setError('Please add a category first'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category_id: Number(form.category_id),
        is_available: form.is_available === 'true',
      };
      if (editItem) {
        await apiUpdateMenuItem(editItem.id, payload);
      } else {
        await apiCreateMenuItem(payload);
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await apiCreateCategory(newCatName.trim());
      setNewCatName('');
      setShowCatForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category? Items in it will lose their category.')) return;
    try { await apiDeleteCategory(id); load(); } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try { await apiDeleteMenuItem(id); load(); } catch (e) { console.error(e); }
  };

  const filtered = selectedCategory
    ? items.filter(i => i.category_id === selectedCategory)
    : items;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display">Menu Management</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowCatForm(!showCatForm); setShowForm(false); }}
            className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors">
            <Tag className="h-4 w-4" />
            {showCatForm ? 'Cancel' : 'Manage Categories'}
          </button>
          <button onClick={showForm ? () => setShowForm(false) : openAdd}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>
      </div>

      {/* Category Management Panel */}
      {showCatForm && (
        <div className="section-card animate-fade-in space-y-4">
          <h3 className="text-lg font-display">Categories</h3>
          <form onSubmit={handleAddCategory} className="flex gap-3">
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
              placeholder="New category name (e.g. Starters)"
              className="flex-1 rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            <button type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
              Add
            </button>
          </form>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet — add one above before creating menu items.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center gap-1.5 rounded-full bg-muted pl-3 pr-2 py-1 text-sm">
                  {c.name}
                  <button onClick={() => handleDeleteCategory(c.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Item Form */}
      {showForm && (
        <div className="section-card animate-fade-in">
          <h3 className="text-lg font-display mb-4">{editItem ? 'Edit Menu Item' : 'New Menu Item'}</h3>
          {error && <p className="text-sm text-destructive mb-3">{error}</p>}
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You need at least one category before adding items.{' '}
              <button onClick={() => { setShowCatForm(true); setShowForm(false); }} className="text-primary underline">Add a category</button>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Dish name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Price (₹)</label>
                <input type="number" min="0" step="0.01" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required>
                  {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Availability</label>
                <select value={form.is_available} onChange={e => setForm(f => ({ ...f, is_available: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2} placeholder="Brief description…" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Saving…' : editItem ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedCategory(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
          All
        </button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading menu…</p>
      ) : (
        <div className="section-card overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </div>
                  </td>
                  <td className="tabular-nums font-medium">₹{item.price.toFixed(2)}</td>
                  <td><span className={`status-badge ${item.available ? 'status-available' : 'status-occupied'}`}>{item.available ? 'Available' : 'Unavailable'}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-primary transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted-foreground py-8 text-sm">No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;