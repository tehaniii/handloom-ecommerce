import express from 'express';
const router = express.Router();

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  toggleReviewReaction,
  replyToReview,
  deleteReview, 
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.get('/categories', getCategories);
router.get('/top', getTopProducts);

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

router.patch('/reviews/:reviewId/:type', protect, toggleReviewReaction);

router.post('/reviews/:reviewId/reply', protect, admin, replyToReview);

router.delete('/reviews/:reviewId', protect, admin, deleteReview);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
