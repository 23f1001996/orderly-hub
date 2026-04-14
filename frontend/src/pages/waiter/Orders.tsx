import { useEffect, useState } from 'react';
import { Plus, Minus, Send } from 'lucide-react';
import { apiGetMenu, apiGetTables, apiCreateOrder, apiAddOrderItem, apiUpdateTable, MenuItem, Table } from '@/services/api';

interface CartItem { id: number; name: string; price: number; qty: number; }

const WaiterOrders = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiGetMenu(), apiGetTables()])
      .then(([m, t]) => {
        setMenuItems(m.menu.filter(i => i.available));
        setTables(t.tables);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = menuItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const addItem = (item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(o => o.id === item.id);
      if (existing) return prev.map(o => o.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setOrderItems(prev => prev.map(o => o.id === id ? { ...o, qty: Math.max(0, o.qty + delta) } : o).filter(o => o.qty > 0));
  };

  const handleSend = async () => {
    if (!selectedTable) { setError('Select a table first'); return; }
    if (orderItems.length === 0) { setError('Add at least one item'); return; }
    setSending(true);
    setError('');
    try {
      const { order_id } = await apiCreateOrder(Number(selectedTable));
      await Promise.all(orderItems.map(item => apiAddOrderItem(order_id, item.id, item.qty)));
      await apiUpdateTable(Number(selectedTable), { status: 'occupied' });
      setOrderItems([]);
      setSelectedTable('');
      setSuccess(`Order #${order_id} sent to kitchen!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send order');
    } finally {
      setSending(false);
    }
  };

  const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Create Order</h1>

      {success && <div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">{success}</div>}
      {error && <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu items…"
              className="flex-1 rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <select value={selectedTable} onChange={e => setSelectedTable(e.target.value === '' ? '' : Number(e.target.value))}
              className="rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select table…</option>
              {tables.map(t => <option key={t.id} value={t.id}>Table {t.id} ({t.status})</option>)}
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading menu…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(item => (
                <div key={item.id} className="section-card flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => addItem(item)}>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.price.toFixed(2)}</p>
                  </div>
                  <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-card self-start sticky top-20">
          <h3 className="text-lg font-display mb-4">Current Order</h3>
          {orderItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Add items to the order</p>
          ) : (
            <div className="space-y-3">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium flex-1 truncate mr-2">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="text-sm tabular-nums w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                    <span className="text-sm tabular-nums font-medium w-16 text-right">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span><span className="tabular-nums">₹{total.toFixed(2)}</span>
              </div>
              <button onClick={handleSend} disabled={sending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                <Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send to Kitchen'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaiterOrders;
