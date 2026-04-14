import { useEffect, useState } from 'react';
import { Star, Send } from 'lucide-react';
import { apiPostFeedback, apiGetMenu, MenuItem } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const CustomerFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [menuItemId, setMenuItemId] = useState<number | ''>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    apiGetMenu().then(r => setMenuItems(r.menu)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setSubmitting(true);
    setError('');
    try {
      await apiPostFeedback(
        Number(user?.id ?? 0),
        menuItemId === '' ? null : Number(menuItemId),
        rating,
        comment,
      );
      setRating(0);
      setComment('');
      setMenuItemId('');
      setSuccess('Thank you for your feedback!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display">Leave Feedback</h1>
      <div className="section-card">
        <h3 className="font-display text-lg mb-4">Rate Your Experience</h3>

        {success && <div className="mb-4 rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">{success}</div>}
        {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <button type="button" key={i} onMouseEnter={() => setHover(i + 1)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i + 1)}>
                <Star className={`h-7 w-7 transition-colors ${(hover || rating) > i ? 'fill-warning text-warning' : 'text-border'}`} />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Select Dish (optional)</label>
            <select value={menuItemId} onChange={e => setMenuItemId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Overall experience</option>
              {menuItems.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Your Review</label>
            <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tell us about your experience…" />
          </div>

          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            <Send className="h-4 w-4" /> {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFeedback;
