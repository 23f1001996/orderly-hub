import { useEffect, useState } from 'react';
import { CheckCircle, Clock, UtensilsCrossed } from 'lucide-react';
import { apiGetOrders, Order } from '@/services/api';

const stepIcon = (done: boolean, current?: boolean) => {
  if (done && !current) return <CheckCircle className="h-5 w-5 text-success" />;
  if (current) return <UtensilsCrossed className="h-5 w-5 text-warning animate-pulse" />;
  return <Clock className="h-5 w-5 text-border" />;
};

const statusToSteps = (status: string) => {
  const steps = ['pending', 'preparing', 'served', 'completed'];
  const idx = steps.indexOf(status);
  return [
    { label: 'Order Placed', done: idx >= 0 },
    { label: 'Preparing', done: idx >= 1, current: idx === 1 },
    { label: 'Served', done: idx >= 2, current: idx === 2 },
    { label: 'Completed', done: idx >= 3 },
  ];
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetOrders()
      .then(r => setOrders(r.orders))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Auto-refresh every 15s so status updates are visible
    const id = setInterval(() => {
      apiGetOrders().then(r => setOrders(r.orders)).catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Order Status</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No orders found. Place an order from the menu!</p>
      ) : orders.map(order => (
        <div key={order.id} className="section-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg">Order #{order.id}</h3>
            <span className={`status-badge status-${order.status}`}>{order.status}</span>
          </div>

          <div className="flex items-start justify-between mb-6">
            {statusToSteps(order.status).map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                {stepIcon(step.done, step.current)}
                <span className={`text-xs text-center ${step.done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
              </div>
            ))}
          </div>

          <p className="font-semibold tabular-nums text-sm">Total: ₹{(order.total ?? 0).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
