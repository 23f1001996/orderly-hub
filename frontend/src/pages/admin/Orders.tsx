import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { apiGetOrders, apiCompleteOrder, Order } from '@/services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiGetOrders()
      .then(r => setOrders(r.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleComplete = async (id: number) => {
    try {
      await apiCompleteOrder(id);
      load();
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (e) { console.error(e); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Orders Management</h1>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'preparing', 'served', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading orders…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 section-card overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Table</th><th>Total</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted-foreground py-8 text-sm">No orders</td></tr>
                ) : filtered.map(order => (
                  <tr key={order.id} className={selectedOrder?.id === order.id ? '!bg-muted/50' : ''}>
                    <td className="font-medium">#{order.id}</td>
                    <td>Table {order.table_id ?? '—'}</td>
                    <td className="tabular-nums font-medium">₹{(order.total ?? 0).toFixed(2)}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)} className="text-muted-foreground hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section-card self-start">
            {selectedOrder ? (
              <div className="animate-fade-in">
                <h3 className="text-lg font-display mb-1">Order #{selectedOrder.id}</h3>
                <p className="text-sm text-muted-foreground mb-1">Table {selectedOrder.table_id ?? '—'}</p>
                <p className="text-sm text-muted-foreground mb-4">Status: <span className={`status-badge status-${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                <div className="border-t border-border pt-3 flex justify-between font-semibold mb-4">
                  <span>Total</span>
                  <span className="tabular-nums">₹{(selectedOrder.total ?? 0).toFixed(2)}</span>
                </div>
                {selectedOrder.status !== 'completed' && (
                  <button onClick={() => handleComplete(selectedOrder.id)}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Mark as Completed
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">Select an order to view details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
