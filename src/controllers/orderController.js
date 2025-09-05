const orderService = require('../services/orderService');

async function create(req, res, next) {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
};


