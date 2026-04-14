import { useEffect, useState } from 'react';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  roles: string[];
  active: boolean;
}

const roleLabel = (roles: string[]) => {
  if (roles.includes('owner')) return 'Admin';
  if (roles.includes('server')) return 'Waiter';
  return roles[0] ?? '—';
};

const AdminStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    // Fetch owners + servers (exclude customers)
    Promise.all([
      fetch('/api/users?role=owner', {
        headers: { 'Authentication-Token': localStorage.getItem('auth_token') ?? '' },
      }).then(r => r.json()),
      fetch('/api/users?role=server', {
        headers: { 'Authentication-Token': localStorage.getItem('auth_token') ?? '' },
      }).then(r => r.json()),
    ])
      .then(([owners, servers]) => {
        const combined = [...(owners.users ?? []), ...(servers.users ?? [])];
        // Deduplicate by id
        const seen = new Set<number>();
        setStaff(combined.filter(u => { if (seen.has(u.id)) return false; seen.add(u.id); return true; }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Staff Management</h1>
      <div className="section-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center text-muted-foreground py-8 text-sm">Loading…</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-muted-foreground py-8 text-sm">No staff registered yet</td></tr>
            ) : staff.map(s => (
              <tr key={s.id}>
                <td className="font-medium">{s.name}</td>
                <td className="text-muted-foreground">{s.email}</td>
                <td className="capitalize">{roleLabel(s.roles)}</td>
                <td><span className={`status-badge ${s.active ? 'status-available' : 'status-reserved'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStaff;
