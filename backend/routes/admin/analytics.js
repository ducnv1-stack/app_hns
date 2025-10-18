const express = require('express');
const router = express.Router();
const { query } = require('../../config/database');
const { authenticate, authorize } = require('../../middleware/auth');

// Apply admin authentication
router.use(authenticate);
router.use(authorize(['admin']));

// GET /api/admin/analytics/overview - Get overall statistics
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (startDate && endDate) {
      dateFilter = 'AND created_at BETWEEN $1 AND $2';
      queryParams = [startDate, endDate];
    }

    // Product statistics
    const productStatsQuery = `
      SELECT 
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_products,
        COUNT(*) FILTER (WHERE service_type = 'TOUR') as tour_count,
        COUNT(*) FILTER (WHERE service_type = 'FLIGHT') as flight_count,
        COUNT(*) FILTER (WHERE service_type = 'HOTEL_ROOM') as hotel_count,
        COUNT(*) FILTER (WHERE service_type = 'COMBO') as combo_count
      FROM services
    `;

    // Order statistics
    const orderStatsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'CONFIRMED') as confirmed_orders,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_orders,
        COUNT(*) FILTER (WHERE status = 'CANCELED') as cancelled_orders,
        COUNT(*) FILTER (WHERE status = 'EXPIRED') as expired_orders,
        COALESCE(SUM(total_amount), 0) as total_order_value,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM bookings
      WHERE 1=1 ${dateFilter}
    `;

    // Payment statistics
    const paymentStatsQuery = `
      SELECT 
        COUNT(*) as total_payments,
        COUNT(*) FILTER (WHERE status = 'SUCCESS') as successful_payments,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_payments,
        COUNT(*) FILTER (WHERE status = 'FAILED') as failed_payments,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_paid_amount,
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END), 0) as pending_payment_amount
      FROM payments
      WHERE 1=1 ${dateFilter}
    `;

    // Unpaid orders (orders without successful payment)
    let unpaidDateFilter = '';
    if (dateFilter) {
      unpaidDateFilter = dateFilter.replace('created_at', 'b.created_at');
    }
    
    const unpaidOrdersQuery = `
      SELECT 
        COUNT(DISTINCT b.id) as unpaid_orders_count,
        COALESCE(SUM(b.total_amount), 0) as unpaid_amount
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'SUCCESS'
      WHERE p.id IS NULL ${unpaidDateFilter}
    `;

    // Product views (if tracking table exists)
    const productViewsQuery = `
      SELECT 
        COALESCE(SUM(view_count), 0) as total_views
      FROM (
        SELECT COUNT(*) as view_count
        FROM services
        WHERE 1=1
      ) as views
    `;

    const [
      productStats,
      orderStats,
      paymentStats,
      unpaidOrders,
      productViews
    ] = await Promise.all([
      query(productStatsQuery),
      query(orderStatsQuery, queryParams),
      query(paymentStatsQuery, queryParams),
      query(unpaidOrdersQuery, queryParams),
      query(productViewsQuery)
    ]);

    res.json({
      success: true,
      data: {
        products: productStats.rows[0],
        orders: orderStats.rows[0],
        payments: paymentStats.rows[0],
        unpaid: unpaidOrders.rows[0],
        views: productViews.rows[0]
      }
    });

  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics overview'
    });
  }
});

// GET /api/admin/analytics/products - Product analytics
router.get('/products', async (req, res) => {
  try {
    const productsQuery = `
      SELECT 
        s.id,
        s.name,
        s.service_type,
        s.status,
        COUNT(DISTINCT bi.id) as order_count,
        COALESCE(SUM(bi.quantity), 0) as total_quantity_sold,
        COALESCE(SUM(bi.total_price), 0) as total_revenue
      FROM services s
      LEFT JOIN booking_items bi ON s.id = bi.service_id
      LEFT JOIN bookings b ON bi.booking_id = b.id
      GROUP BY s.id, s.name, s.service_type, s.status
      ORDER BY total_revenue DESC
      LIMIT 20
    `;

    const result = await query(productsQuery);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product analytics'
    });
  }
});

// GET /api/admin/analytics/orders-by-status - Orders grouped by status
router.get('/orders-by-status', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (startDate && endDate) {
      dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
      queryParams = [startDate, endDate];
    }

    const ordersQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as total_amount
      FROM bookings
      ${dateFilter}
      GROUP BY status
      ORDER BY count DESC
    `;

    const result = await query(ordersQuery, queryParams);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders by status'
    });
  }
});

// GET /api/admin/analytics/revenue-by-period - Revenue over time
router.get('/revenue-by-period', async (req, res) => {
  try {
    const { period = 'day', startDate, endDate } = req.query;
    
    let dateFormat;
    switch (period) {
      case 'hour':
        dateFormat = 'YYYY-MM-DD HH24:00';
        break;
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'week':
        dateFormat = 'IYYY-IW';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
    }

    let dateFilter = '';
    let queryParams = [];
    
    if (startDate && endDate) {
      dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
      queryParams = [startDate, endDate];
    }

    const revenueQuery = `
      SELECT 
        TO_CHAR(created_at, '${dateFormat}') as period,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM bookings
      ${dateFilter}
      GROUP BY period
      ORDER BY period DESC
      LIMIT 30
    `;

    const result = await query(revenueQuery, queryParams);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching revenue by period:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue by period'
    });
  }
});

// GET /api/admin/analytics/payment-methods - Payment methods breakdown
router.get('/payment-methods', async (req, res) => {
  try {
    const paymentMethodsQuery = `
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) as successful_amount,
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status = 'FAILED' THEN amount ELSE 0 END), 0) as failed_amount
      FROM payments
      GROUP BY payment_method
      ORDER BY count DESC
    `;

    const result = await query(paymentMethodsQuery);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment methods'
    });
  }
});

module.exports = router;
