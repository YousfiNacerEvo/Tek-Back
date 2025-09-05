const express = require('express');
const { body, param, validationResult } = require('express-validator');
const controller = require('../controllers/productController');

const router = express.Router();

const idParam = [param('id').isInt({ gt: 0 }).toInt()];

const createValidations = [
  body('name').isString().trim().notEmpty(),
  body('price').isFloat({ gt: 0 }).toFloat(),
  body('description').optional().isString(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
];

const updateValidations = [
  body('name').optional().isString().trim().notEmpty(),
  body('price').optional().isFloat({ gt: 0 }).toFloat(),
  body('description').optional().isString(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
];

function runValidations(validations) {
  return [
    ...validations,
    (req, res, next) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const err = new Error('Validation failed');
        err.status = 400;
        err.details = result.array();
        return next(err);
      }
      return next();
    },
  ];
}

router.get('/', controller.listProducts);
router.get('/:id', runValidations(idParam), controller.getProduct);
router.post('/', runValidations(createValidations), controller.createProduct);
router.put('/:id', runValidations([...idParam, ...updateValidations]), controller.updateProduct);
router.delete('/:id', runValidations(idParam), controller.removeProduct);

module.exports = router;

