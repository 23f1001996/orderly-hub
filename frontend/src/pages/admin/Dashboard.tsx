import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSalesData } from '@/data/mockData';
import { apiGetOrders, apiGetMenu, Order } from '@/services/api';

const iconMap: Record<string, React.ElementType> = { IndianRupee, ShoppingBag, Users, TrendingUp };

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuCount, setMenuCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetOrders(), apiGetMenu()])
      .then(([ordersRes, menuRes]) => {
        setOrders(ordersRes.orders);
        setMenuCount(menuRes.menu.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const stats = [
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, trend: 12.5, icon: 'IndianRupee' },
    { label: 'Total Orders', value: String(orders.length), trend: 8.3, icon: 'ShoppingBag' },
    { label: 'Menu Items', value: String(menuCount), trend: 2.0, icon: 'Users' },
    { label: 'Completed', value: String(completedOrders), trend: 5.0, icon: 'TrendingUp' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-display font-bold tabular-nums">{loading ? '…' : stat.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.trend > 0 ? 'text-success' : 'text-destructive'}`}>
                {stat.trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(stat.trend)}% vs last week
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-card">
        <h3 className="text-lg font-display mb-4">Weekly Revenue</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(value: number) => [`₹${value}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '13px' }} />
              <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section-card">
        <h3 className="text-lg font-display mb-4">Recent Orders</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Table</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">#{order.id}</td>
                    <td>Table {order.table_id ?? '—'}</td>
                    <td className="tabular-nums font-medium">₹{(order.total ?? 0).toFixed(2)}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
