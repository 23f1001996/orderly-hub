import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { apiGetFeedback, Feedback } from '@/services/api';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetFeedback()
      .then(r => setFeedback(r.feedback))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Customer Feedback</h1>
      <p className="text-sm text-muted-foreground text-center py-12">Loading feedback…</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Customer Feedback</h1>
      {feedback.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No feedback yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map((fb, i) => (
            <div key={i} className="section-card">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Customer</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} className={`h-3.5 w-3.5 ${j < fb.rating ? 'fill-warning text-warning' : 'text-border'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{fb.comment || 'No comment'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
