const express = require('express');
const router = express.Router();

// Mock In-Memory Database
let coupons = [];
let nextId = 1;

// Helper to check status dynamically
const getStatus = (expiryDate) => {
  const currentDate = new Date();
  return new Date(expiryDate) >= currentDate ? 'Active' : 'Expired';
};

// GET all coupons
router.get('/', (req, res) => {
  try {
    // Return with dynamic status evaluation
    const sortedCoupons = [...coupons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const processed = sortedCoupons.map(c => ({
      ...c,
      status: getStatus(c.expiryDate)
    }));
    res.json(processed);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST new coupon
router.post('/', (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;
    
    // Check if code exists
    const existing = coupons.find(c => c.code === code.toUpperCase());
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const newCoupon = {
      _id: nextId.toString(),
      code: code.toUpperCase(),
      discount: Number(discount),
      expiryDate: new Date(expiryDate).toISOString(),
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    
    coupons.push(newCoupon);
    nextId++;

    res.status(201).json({ ...newCoupon, status: getStatus(newCoupon.expiryDate) });
  } catch (error) {
    res.status(400).json({ message: 'Error creating coupon', error: error.message });
  }
});

// DELETE a coupon
router.delete('/:id', (req, res) => {
  try {
    const initialLength = coupons.length;
    coupons = coupons.filter(c => c._id !== req.params.id);
    
    if (coupons.length === initialLength) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Analytics Route
router.get('/analytics', (req, res) => {
  try {
    const totalCoupons = coupons.length;
    
    const currentDate = new Date();
    const activeCoupons = coupons.filter(c => new Date(c.expiryDate) >= currentDate).length;
    const expiredCoupons = coupons.filter(c => new Date(c.expiryDate) < currentDate).length;
    
    // calculate total usage
    const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0);

    res.json({
      total: totalCoupons,
      active: activeCoupons,
      expired: expiredCoupons,
      totalUsage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST increment usage
router.post('/:id/use', (req, res) => {
  try {
    const couponIndex = coupons.findIndex(c => c._id === req.params.id);
    if (couponIndex === -1) return res.status(404).json({ message: 'Coupon not found' });

    const coupon = coupons[couponIndex];
    if (getStatus(coupon.expiryDate) === 'Expired') {
      return res.status(400).json({ message: 'Cannot use expired coupon' });
    }

    coupons[couponIndex].usageCount += 1;
    res.json({ message: 'Coupon usage recorded', coupon: coupons[couponIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
