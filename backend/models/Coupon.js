const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  discount: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [1, 'Discount cannot be less than 1%'],
    max: [100, 'Discount cannot be more than 100%']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for active status
couponSchema.virtual('status').get(function() {
  const currentDate = new Date();
  return this.expiryDate >= currentDate ? 'Active' : 'Expired';
});

// Ensure virtuals are included in toJSON outputs
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Coupon', couponSchema);
