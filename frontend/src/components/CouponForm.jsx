import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Calendar, Percent, Hash } from 'lucide-react';

export default function CouponForm({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.discount < 1 || formData.discount > 100) {
      toast.error('Discount must be between 1 and 100%');
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.post('http://localhost:5000/api/coupons', formData);
      toast.success('Coupon created successfully!');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-6 relative animate-in slide-in-from-bottom-8 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Create New Coupon</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Coupon Code</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                name="code"
                required
                className="glass-input w-full pl-10 uppercase"
                placeholder="SUMMER50"
                value={formData.code}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Discount Percentage (%)</label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number" 
                name="discount"
                required
                min="1"
                max="100"
                className="glass-input w-full pl-10"
                placeholder="20"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                name="expiryDate"
                required
                min={new Date().toISOString().split('T')[0]}
                style={{ colorScheme: 'dark' }}
                className="glass-input w-full pl-10"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
