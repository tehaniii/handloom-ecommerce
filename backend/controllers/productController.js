import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc Fetch all products (with pagination, search, category filter)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const filter = { ...keyword, ...category };
  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc Get unique product categories
// @route GET /api/products/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Toggle like/dislike on a review
// @route PATCH /api/products/reviews/:reviewId/:type
// @access Private
const toggleReviewReaction = asyncHandler(async (req, res) => {
  const { reviewId, type } = req.params;
  const userId = req.user._id;

  const product = await Product.findOne({ 'reviews._id': reviewId });

  if (!product) {
    res.status(404);
    throw new Error('Review not found');
  }

  const review = product.reviews.id(reviewId);
  const isLiked = review.likes?.includes(userId);
  const isDisliked = review.dislikes?.includes(userId);

  if (type === 'like') {
    if (isLiked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
      if (isDisliked) review.dislikes.pull(userId);
    }
  } else if (type === 'dislike') {
    if (isDisliked) {
      review.dislikes.pull(userId);
    } else {
      review.dislikes.push(userId);
      if (isLiked) review.likes.pull(userId);
    }
  } else {
    res.status(400);
    throw new Error('Invalid reaction type');
  }

  await product.save();
  res.json({ message: 'Reaction updated' });
});

// @desc Admin reply to a review
// @route POST /api/products/reviews/:reviewId/reply
// @access Private/Admin
const replyToReview = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { reviewId } = req.params;

  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Only admins can reply to reviews');
  }

  const product = await Product.findOne({ 'reviews._id': reviewId });

  if (!product) {
    res.status(404);
    throw new Error('Review not found');
  }

  const review = product.reviews.id(reviewId);

  if (review.adminReply?.comment) {
    res.status(400);
    throw new Error('Review already has a reply');
  }

  review.adminReply = {
    comment,
    repliedAt: new Date(),
  };

  await product.save();
  res.status(200).json({ message: 'Reply added successfully' });
});

// @desc Delete a review completely
// @route DELETE /api/products/reviews/:reviewId
// @access Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ 'reviews._id': req.params.reviewId });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.reviews.pull({ _id: req.params.reviewId });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, review) => review.rating + acc, 0) / (product.reviews.length || 1);

  await product.save();
  res.json({ message: 'Review deleted' });
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
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
};
