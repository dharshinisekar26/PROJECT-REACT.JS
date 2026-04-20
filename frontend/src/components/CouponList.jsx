import { Trash2, TrendingUp, Calendar as CalIcon, Percent } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function CouponList({ coupons, onRefresh }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`http://localhost:5000/api/coupons/${id}`);
        toast.success('Coupon deleted');
        onRefresh();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleUse = async (id, status) => {
    if (status === 'Expired') {
      toast.error('Cannot simulate usage on an expired coupon');
      return;
    }
    
    try {
      await axios.post(`http://localhost:5000/api/coupons/${id}/use`);
      toast.success('Coupon use recorded');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update usage');
    }
  };

  if (!coupons || coupons.length === 0) {
    return (
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No coupons found</h3>
        <p className="text-slate-400">There are no coupons matching your criteria. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {coupons.map((coupon) => {
        const isExpired = coupon.status === 'Expired';
        
        return (
          <div 
            key={coupon._id} 
            className={`glass-panel p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group hover:shadow-xl ${
              isExpired ? 'opacity-70 grayscale-[30%] hover:grayscale-0' : 'hover:-translate-y-1'
            }`}
          >
            {/* Background Glow */}
            {!isExpired && (
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-colors"></div>
            )}
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-300">
                <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                {coupon.status}
              </div>
              <button 
                onClick={() => handleDelete(coupon._id)}
                className="text-slate-500 hover:text-red-400 transition-colors bg-slate-800/50 p-2 rounded-full border border-white/5"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6 relative z-10">
              <h3 className="text-3xl font-extrabold tracking-tight mb-2 text-white bg-clip-text text-transparent">{coupon.code}</h3>
              <div className="flex items-center gap-2 text-secondary font-bold text-xl">
                <Percent className="w-5 h-5" />
                {coupon.discount}% OFF
              </div>
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CalIcon className="w-4 h-4" />
                <span>Expires: <span className={isExpired ? 'text-red-400 font-medium' : 'text-slate-200'}>{format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span>Usage count: <span className="text-slate-200">{coupon.usageCount}</span></span>
              </div>
            </div>

            <button 
              onClick={() => handleUse(coupon._id, coupon.status)}
              disabled={isExpired}
              className={`w-full py-2.5 rounded-xl font-medium transition-all ${
                isExpired 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20'
              }`}
            >
              Simulate Usage
            </button>
          </div>
        );
      })}
    </div>
  );
}
