import express from 'express';
import { getAdminSummary } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, admin, getAdminSummary);

export default router;
