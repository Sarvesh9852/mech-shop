const express = require('express');
const {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
  getFurnitureByType,
  updateStock,
} = require('../controllers/furniture');

const router = express.Router();

// Route to create new furniture
router.route('/').post(createFurniture);

// Route to get all furniture
router.route('/').get(getAllFurniture);

// Route to get a single piece of furniture by ID
router.route('/:id').get(getFurnitureById);

// Route to update furniture by ID
router.route('/:id').put(updateFurniture);

// Route to delete furniture by ID
router.route('/:id').delete(deleteFurniture);

// Route to get furniture by type (filter)
router.route('/type').get(getFurnitureByType);

// Route to update stock of furniture by ID
router.route('/:id/stock').put(updateStock);

module.exports = router;
