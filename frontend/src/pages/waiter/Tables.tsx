import { useEffect, useState } from 'react';
import { apiGetTables, apiUpdateTable, Table } from '@/services/api';

const WaiterTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiGetTables()
      .then(r => setTables(r.tables))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markOccupied = async (table: Table) => {
    if (table.status !== 'available') return;
    try {
      await apiUpdateTable(table.id, { status: 'occupied' });
      load();
    } catch (e) { console.error(e); }
  };

  const markAvailable = async (table: Table) => {
    if (table.status === 'available') return;
    try {
      await apiUpdateTable(table.id, { status: 'available' });
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Service Grid</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading tables…</p>
      ) : tables.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No tables assigned. Ask admin to add tables.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tables.map(table => (
            <div key={table.id} className={`section-card text-center cursor-pointer hover:shadow-md transition-shadow ${table.status === 'occupied' ? 'border-primary' : ''}`}>
              <div className="flex justify-between mb-2">
                <span className={`status-badge ${table.status === 'available' ? 'status-available' : table.status === 'occupied' ? 'status-occupied' : 'status-reserved'}`}>{table.status}</span>
                <span className="text-xs text-muted-foreground">{table.capacity} seats</span>
              </div>
              <h3 className="text-lg font-display my-3">Table {table.id}</h3>
              {table.status === 'available' ? (
                <button onClick={() => markOccupied(table)} className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Open Table</button>
              ) : table.status === 'occupied' ? (
                <button onClick={() => markAvailable(table)} className="w-full rounded-lg border border-primary py-2 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors">Clear Table</button>
              ) : (
                <button disabled className="w-full rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground">Reserved</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaiterTables;
