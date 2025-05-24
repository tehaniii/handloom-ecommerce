import express from 'express';
import {
  createCheckoutSession,
  stripeWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
