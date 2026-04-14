import { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadCart, saveCart, CartItem } from './Menu';
import { apiGetTables, apiCreateOrder, apiAddOrderItem, apiUpdateTable } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const CustomerCart = () => {
  const [items, setItems] = useState<CartItem[]>(loadCart());
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const updateQty = (id: number, delta: number) => {
    const updated = items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
    setItems(updated);
    saveCart(updated);
  };

  const remove = (id: number) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveCart(updated);
  };

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    setError('');
    try {
      // Pick first available table for the customer's self-service order
      const tablesRes = await apiGetTables();
      const availableTable = tablesRes.tables.find(t => t.status === 'available');
      const tableId = availableTable?.id ?? tablesRes.tables[0]?.id;
      if (!tableId) throw new Error('No tables available. Please ask a waiter for assistance.');

      const { order_id } = await apiCreateOrder(tableId);
      await Promise.all(items.map(item => apiAddOrderItem(order_id, item.id, item.qty)));
      if (availableTable) {
        await apiUpdateTable(tableId, { status: 'occupied' });
      }

      // Clear cart
      saveCart([]);
      navigate('/customer/orders');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Your Cart</h1>

      {error && <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}

      {items.length === 0 ? (
        <div className="section-card text-center py-12 text-muted-foreground text-sm">Your cart is empty</div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="section-card flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="tabular-nums text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                  <span className="tabular-nums text-sm w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                </div>
                <span className="tabular-nums font-semibold text-sm w-16 text-right">₹{(item.price * item.qty).toFixed(2)}</span>
                <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="section-card">
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span><span className="tabular-nums">₹{total.toFixed(2)}</span>
            </div>
            <button onClick={placeOrder} disabled={placing}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
              {placing ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerCart;
