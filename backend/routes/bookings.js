const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/bookings - Get all bookings (with filters) - Admin only
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { 
      status, 
      userId, 
      page = 1, 
      limit = 10,
      startDate,
      endDate
    } = req.query;

    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`b.status = $${paramIndex}`);
      queryParams.push(status.toUpperCase());
      paramIndex++;
    }

    if (userId) {
      whereConditions.push(`b.buyer_party_id = $${paramIndex}`);
      queryParams.push(userId);
      paramIndex++;
    }

    if (startDate) {
      whereConditions.push(`b.created_at >= $${paramIndex}`);
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereConditions.push(`b.created_at <= $${paramIndex}`);
      queryParams.push(endDate);
      paramIndex++;
    }

    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);

    const bookingsQuery = `
      SELECT 
        b.*,
        p.full_name as buyer_name,
        p.email as buyer_email,
        p.phone_number as buyer_phone,
        COUNT(bi.id) as item_count,
        SUM(bi.total_price) as calculated_total
      FROM bookings b
      LEFT JOIN parties p ON b.buyer_party_id = p.id
      LEFT JOIN booking_items bi ON b.id = bi.booking_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY b.id, p.full_name, p.email, p.phone_number
      ORDER BY b.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      WHERE ${whereConditions.join(' AND ')}
    `;

    const [bookingsResult, countResult] = await Promise.all([
      query(bookingsQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2))
    ]);

    const bookings = bookingsResult.rows;
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/:id - Get booking by ID - Authenticated users
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Get booking basic info
    const bookingQuery = `
      SELECT 
        b.*,
        p.full_name as buyer_name,
        p.email as buyer_email,
        p.phone_number as buyer_phone
      FROM bookings b
      LEFT JOIN parties p ON b.buyer_party_id = p.id
      WHERE b.id = $1
    `;

    const bookingResult = await query(bookingQuery, [id]);
    
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const booking = bookingResult.rows[0];

    // Get booking items
    const itemsQuery = `
      SELECT 
        bi.*,
        s.name as service_name,
        s.service_type,
        sv.name as variant_name,
        sa.start_datetime,
        sa.end_datetime
      FROM booking_items bi
      LEFT JOIN services s ON bi.service_id = s.id
      LEFT JOIN service_variants sv ON bi.variant_id = sv.id
      LEFT JOIN service_availabilities sa ON bi.availability_id = sa.id
      WHERE bi.booking_id = $1
    `;
    const itemsResult = await query(itemsQuery, [id]);

    // Get booking participants
    const participantsQuery = `
      SELECT 
        bp.*,
        p.full_name as participant_name,
        p.email as participant_email,
        p.phone_number as participant_phone
      FROM booking_participants bp
      LEFT JOIN parties p ON bp.participant_party_id = p.id
      WHERE bp.booking_item_id IN (
        SELECT id FROM booking_items WHERE booking_id = $1
      )
    `;
    const participantsResult = await query(participantsQuery, [id]);

    // Get ticket serials
    const ticketsQuery = `
      SELECT ts.*
      FROM ticket_serials ts
      WHERE ts.booking_participant_id IN (
        SELECT bp.id FROM booking_participants bp
        WHERE bp.booking_item_id IN (
          SELECT id FROM booking_items WHERE booking_id = $1
        )
      )
    `;
    const ticketsResult = await query(ticketsQuery, [id]);

    const bookingData = {
      ...booking,
      items: itemsResult.rows,
      participants: participantsResult.rows,
      tickets: ticketsResult.rows
    };

    res.json({
      success: true,
      data: bookingData
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// POST /api/bookings - Create new booking - Authenticated users
router.post('/', authenticate, async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    const {
      buyerInfo,
      items,
      participants,
      totalAmount,
      currency = 'VND'
    } = req.body;

    // Generate booking code
    const bookingCode = 'HST' + Date.now().toString().slice(-8);

    // 1. Create or get buyer party
    let buyerPartyId;
    const existingPartyQuery = `
      SELECT id FROM parties 
      WHERE email = $1 AND party_type = 'PERSON'
    `;
    const existingParty = await client.query(existingPartyQuery, [buyerInfo.email]);

    if (existingParty.rows.length > 0) {
      buyerPartyId = existingParty.rows[0].id;
      
      // Update party info
      await client.query(`
        UPDATE parties 
        SET full_name = $1, phone_number = $2, updated_at = NOW()
        WHERE id = $3
      `, [buyerInfo.fullName, buyerInfo.phone, buyerPartyId]);
    } else {
      // Create new party
      const newPartyResult = await client.query(`
        INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified)
        VALUES ('PERSON', $1, $2, $3, false)
        RETURNING id
      `, [buyerInfo.fullName, buyerInfo.email, buyerInfo.phone]);
      
      buyerPartyId = newPartyResult.rows[0].id;
    }

    // 2. Create booking
    const bookingResult = await client.query(`
      INSERT INTO bookings (booking_code, buyer_party_id, total_amount, currency, status)
      VALUES ($1, $2, $3, $4, 'PENDING')
      RETURNING id
    `, [bookingCode, buyerPartyId, totalAmount, currency]);

    const bookingId = bookingResult.rows[0].id;

    // 3. Create booking items
    for (const item of items) {
      const itemResult = await client.query(`
        INSERT INTO booking_items (
          booking_id, service_id, variant_id, availability_id, 
          quantity, unit_price, currency, note
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        bookingId, item.serviceId, item.variantId, item.availabilityId,
        item.quantity, item.unitPrice, currency, item.note || null
      ]);

      const bookingItemId = itemResult.rows[0].id;

      // 4. Create booking participants for this item
      for (const participant of item.participants || []) {
        let participantPartyId = null;
        
        if (participant.partyId) {
          participantPartyId = participant.partyId;
        } else {
          // Create new participant party
          const participantResult = await client.query(`
            INSERT INTO parties (party_type, full_name, email, phone_number)
            VALUES ('PERSON', $1, $2, $3)
            RETURNING id
          `, [participant.fullName, participant.email || null, participant.phone || null]);
          
          participantPartyId = participantResult.rows[0].id;
        }

        await client.query(`
          INSERT INTO booking_participants (
            booking_item_id, participant_party_id, participant_info, notes
          )
          VALUES ($1, $2, $3, $4)
        `, [
          bookingItemId, 
          participantPartyId, 
          JSON.stringify(participant),
          participant.notes || null
        ]);
      }
    }

    await client.query('COMMIT');

    // Get the complete booking data
    const completeBookingQuery = `
      SELECT * FROM bookings WHERE id = $1
    `;
    const completeBooking = await query(completeBookingQuery, [bookingId]);

    res.status(201).json({
      success: true,
      data: {
        booking: completeBooking.rows[0],
        message: 'Booking created successfully'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  } finally {
    client.release();
  }
});

// PUT /api/bookings/:id/status - Update booking status - Admin only
router.put('/:id/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'COMPLETED'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const updateQuery = `
      UPDATE bookings 
      SET status = $1, note = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await query(updateQuery, [status, note, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
});

// GET /api/bookings/:id/complete - Get complete order info (order + items + payments + summary)
router.get('/:id/complete', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order with buyer info
    const orderQuery = `
      SELECT 
        b.*,
        p.full_name as buyer_name,
        p.email as buyer_email,
        p.phone_number as buyer_phone
      FROM bookings b
      LEFT JOIN parties p ON b.buyer_party_id = p.id
      WHERE b.id = $1
    `;
    const orderResult = await query(orderQuery, [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    const booking = orderResult.rows[0];
    
    // Get items with service info (including service_type for classification)
    const itemsQuery = `
      SELECT 
        bi.*,
        s.name as service_name,
        s.service_type,
        s.description as service_description,
        sv.name as variant_name,
        sv.description as variant_description,
        sa.start_datetime,
        sa.end_datetime
      FROM booking_items bi
      LEFT JOIN services s ON bi.service_id = s.id
      LEFT JOIN service_variants sv ON bi.variant_id = sv.id
      LEFT JOIN service_availabilities sa ON bi.availability_id = sa.id
      WHERE bi.booking_id = $1
    `;
    const itemsResult = await query(itemsQuery, [id]);
    
    // Get payments
    const paymentsQuery = `
      SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC
    `;
    const paymentsResult = await query(paymentsQuery, [id]);
    
    // Calculate payment summary
    const totalAmount = parseFloat(booking.total_amount);
    const successfulPayments = paymentsResult.rows.filter(p => p.status === 'SUCCESS');
    const paidAmount = successfulPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const remainingAmount = totalAmount - paidAmount;
    
    const paymentSummary = {
      total_amount: totalAmount,
      paid_amount: paidAmount,
      remaining_amount: remainingAmount,
      payment_status: paidAmount >= totalAmount ? 'PAID_FULL' : 'PAID_PARTIAL',
      payment_percentage: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : 0,
      successful_payments_count: successfulPayments.length,
      total_payments_count: paymentsResult.rows.length
    };
    
    res.json({
      success: true,
      data: {
        order: {
          id: booking.id,
          booking_code: booking.booking_code,
          total_amount: booking.total_amount,
          currency: booking.currency,
          status: booking.status,
          note: booking.note,
          created_at: booking.created_at,
          updated_at: booking.updated_at,
          buyer: {
            name: booking.buyer_name,
            email: booking.buyer_email,
            phone: booking.buyer_phone
          },
          items: itemsResult.rows.map(item => ({
            id: item.id,
            service_id: item.service_id,
            service_name: item.service_name,
            service_type: item.service_type, // TOUR/FLIGHT/HOTEL/COMBO
            service_description: item.service_description,
            variant_id: item.variant_id,
            variant_name: item.variant_name,
            variant_description: item.variant_description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            currency: item.currency,
            availability: {
              start: item.start_datetime,
              end: item.end_datetime
            },
            note: item.note
          }))
        },
        payments: paymentsResult.rows.map(payment => ({
          id: payment.id,
          payment_method: payment.payment_method,
          transaction_id: payment.transaction_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          paid_at: payment.paid_at,
          metadata: payment.metadata,
          created_at: payment.created_at
        })),
        payment_summary: paymentSummary
      }
    });
    
  } catch (error) {
    console.error('Error fetching complete booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch complete booking information'
    });
  }
});

module.exports = router;
