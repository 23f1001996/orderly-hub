import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { apiGetOrders, apiCompleteOrder, Order } from '@/services/api';

const WaiterBilling = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiGetOrders()
      .then(r => setOrders(r.orders.filter(o => o.status !== 'completed')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleClose = async (id: number) => {
    try {
      await apiCompleteOrder(id);
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Billing</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading active orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No active orders to bill</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map(order => (
            <div key={order.id} className="section-card">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-display text-lg">Order #{order.id}</h3>
                  <p className="text-xs text-muted-foreground">Table {order.table_id ?? '—'}</p>
                </div>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-semibold tabular-nums">₹{(order.total ?? 0).toFixed(2)}</span>
                <div className="flex gap-2">
                  <button onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button onClick={() => handleClose(order.id)}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Close Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaiterBilling;
