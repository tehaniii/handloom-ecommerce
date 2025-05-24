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
  getCategories, // ✅ Import for category list
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

// ✅ This route must come BEFORE any dynamic /:id route
router.get('/categories', getCategories);

// ✅ Top-rated products
router.get('/top', getTopProducts);

// ✅ Get all products or create a new product
router.route('/').get(getProducts).post(protect, admin, createProduct);

// ✅ Create a review for a specific product
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

// ✅ Get / Update / Delete a specific product by ID
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
