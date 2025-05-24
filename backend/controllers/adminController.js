import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const getAdminSummary = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({ isAdmin: false });
  const orderCount = await Order.countDocuments();
  const productCount = await Product.countDocuments();
  const orders = await Order.find();

  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const bestSellers = await Product.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'orderItems.product',
        as: 'orderRefs',
      },
    },
    {
      $addFields: {
        totalSold: { $size: '$orderRefs' },
      },
    },
    {
      $project: {
        name: 1,
        totalSold: 1,
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    userCount,
    orderCount,
    productCount,
    totalSales,
    bestSellers,
    dailyRevenue,
  });
});

export { getAdminSummary };
