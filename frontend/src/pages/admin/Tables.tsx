import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { apiGetTables, apiCreateTable, apiUpdateTable, apiDeleteTable, Table } from '@/services/api';

const statusColor = { available: 'status-available', occupied: 'status-occupied', reserved: 'status-reserved' };

const AdminTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [capacity, setCapacity] = useState('4');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    apiGetTables()
      .then(r => setTables(r.tables))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiCreateTable(Number(capacity));
      setShowForm(false);
      setCapacity('4');
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create table');
    } finally {
      setSaving(false);
    }
  };

  const cycleStatus = async (table: Table) => {
    const next: Record<string, string> = { available: 'occupied', occupied: 'reserved', reserved: 'available' };
    try {
      await apiUpdateTable(table.id, { status: next[table.status] });
      load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this table?')) return;
    try {
      await apiDeleteTable(id);
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display">Tables Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Occupied</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Reserved</span>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Table'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="section-card animate-fade-in">
          <h3 className="text-lg font-display mb-4">New Table</h3>
          {error && <p className="text-sm text-destructive mb-3">{error}</p>}
          <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1.5">Capacity (seats)</label>
              <input type="number" min="1" max="20" value={capacity} onChange={e => setCapacity(e.target.value)}
                className="rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32" required />
            </div>
            <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Table'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading tables…</p>
      ) : tables.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No tables found. Add one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div key={table.id} className={`section-card text-center hover:shadow-md transition-shadow cursor-pointer ${table.status === 'occupied' ? 'border-primary' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`status-badge ${statusColor[table.status]}`}>{table.status}</span>
                <span className="text-xs text-muted-foreground">#{table.id}</span>
              </div>
              <h3 className="text-lg font-display my-2">Table {table.id}</h3>
              <p className="text-xs text-muted-foreground mb-3">{table.capacity} seats</p>
              <button onClick={() => cycleStatus(table)}
                className={`w-full mt-1 rounded-lg py-2 text-xs font-semibold transition-opacity ${table.status === 'available' ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border border-primary text-primary hover:bg-primary/5'}`}>
                {table.status === 'available' ? 'Open Table' : 'Manage'}
              </button>
              <button onClick={() => handleDelete(table.id)}
                className="w-full mt-1 rounded-lg border border-destructive/40 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTables;
