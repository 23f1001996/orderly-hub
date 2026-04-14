import { useEffect, useState } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users?role=customer', {
      headers: { 'Authentication-Token': localStorage.getItem('auth_token') ?? '' },
    })
      .then(r => r.json())
      .then(d => setCustomers(d.users ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Customers</h1>
      <div className="section-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center text-muted-foreground py-8 text-sm">Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={3} className="text-center text-muted-foreground py-8 text-sm">No customers registered yet</td></tr>
            ) : customers.map(c => (
              <tr key={c.id}>
                <td className="font-medium">{c.name}</td>
                <td className="text-muted-foreground">{c.email}</td>
                <td><span className={`status-badge ${c.active ? 'status-available' : 'status-occupied'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
