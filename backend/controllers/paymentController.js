import Stripe from 'stripe';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// ✅ Create Checkout Session
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { cartItems, orderId } = req.body;

  if (!cartItems || cartItems.length === 0 || !orderId) {
    return res.status(400).json({ message: 'Cart items or order ID missing' });
  }

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    metadata: {
      orderId,
    },
    success_url: `${process.env.FRONTEND_URL}/order/success?orderId=${orderId}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });

  res.status(200).json({ id: session.id });
});

// ✅ Webhook Handler
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: session.payment_intent,
          status: session.payment_status,
          email_address: session.customer_email,
        };
        await order.save();
        console.log(`✅ Order ${orderId} marked as paid`);
      } else {
        console.warn(`Order ${orderId} not found`);
      }
    } catch (err) {
      console.error(`DB update error for order ${orderId}:`, err.message);
    }
  }

  res.status(200).json({ received: true });
});

export { createCheckoutSession, stripeWebhook };
