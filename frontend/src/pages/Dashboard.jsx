import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, totalUsage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/coupons/analytics');
      setStats(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Coupons', value: stats.total, icon: Tag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Active Offers', value: stats.active, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Expired Offers', value: stats.expired, icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { title: 'Total Usage', value: stats.totalUsage, icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Monitor your coupon performance and overall metrics.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-panel p-6 h-32 animate-pulse bg-slate-800/40"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="glass-panel p-8 mt-12 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <Tag className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Ready to run a new campaign?</h2>
        <p className="text-slate-400 max-w-md mb-6">Create promotional offers and boost your sales instantly. Track their performance right here.</p>
        <button onClick={() => window.location.href='/offers'} className="btn-primary flex items-center gap-2">
          Manage Offers
        </button>
      </div>
    </div>
  );
}
