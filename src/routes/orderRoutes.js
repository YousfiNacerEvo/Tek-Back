const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/orderController');

const router = express.Router();

const createValidations = [
  body('full_name').isString().trim().notEmpty(),
  body('phone').isString().trim().notEmpty(),
  body('state').isString().trim().notEmpty(),
  body('city').isString().trim().notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.produit_id').optional().isInt({ gt: 0 }).toInt(),
  body('items.*.id').optional().isInt({ gt: 0 }).toInt(),
  body('items.*.prix_unitaire').optional().isFloat({ gt: 0 }).toFloat(),
  body('items.*.rawPrice').optional().isFloat({ gt: 0 }).toFloat(),
  body('items.*.quantite').optional().isInt({ gt: 0 }).toInt(),
  body('items.*.qty').optional().isInt({ gt: 0 }).toInt(),
  body('total').optional().isFloat({ gt: 0 }).toFloat(),
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

router.post('/', runValidations(createValidations), controller.create);

module.exports = router;


