import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import CouponList from '../components/CouponList';
import CouponForm from '../components/CouponForm';

export default function Offers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/coupons');
      setCoupons(res.data);
    } catch (error) {
      toast.error('Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || coupon.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Manage Offers</h1>
          <p className="text-slate-400 mt-2">Create, track, and manage your promotional coupons.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search coupon codes..."
            className="glass-input w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select 
            className="glass-input w-full pl-10 appearance-none bg-slate-900 [&>option]:bg-slate-900"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Expired">Expired Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="glass-panel h-64 bg-slate-800/40"></div>)}
        </div>
      ) : (
        <CouponList coupons={filteredCoupons} onRefresh={fetchCoupons} />
      )}

      {showModal && <CouponForm onClose={() => setShowModal(false)} onRefresh={fetchCoupons} />}
    </div>
  );
}
