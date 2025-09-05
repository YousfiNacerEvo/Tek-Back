const productService = require('../services/productService');

async function listProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(Number(id));
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await productService.updateProduct(Number(id), req.body);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function removeProduct(req, res, next) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
};

