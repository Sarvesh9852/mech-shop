const Furniture = require("../models/furniture");

// Create a new Furniture with improved validation and error handling
    const createFurniture = async (req, res) => {
    const { name, type, dimensions, description, stock, images } = req.body;

    try {
        // Input validation
        if (!name || !type || !dimensions || !images || dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
        return res.status(400).json({ error: 'Please provide valid name, type, and positive dimensions (length, width, height).' });
        }

        // If 'type' is invalid, return an error
        const validTypes = ['Chair', 'Table', 'Window', 'Bed', 'Rack', 'Custom'];
        if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Allowed types are: ${validTypes.join(', ')}` });
        }

        // Validate stock is non-negative
        if (stock < 0) {
        return res.status(400).json({ error: 'Stock cannot be negative.' });
        }

        // Create new furniture instance
        const furniture = new Furniture({
        name,
        type,
        dimensions,
        description: description || '', // Optional description
        stock: stock || 0, // Default stock to 0 if not provided
        images,
        });

        // Save the furniture to the database
        await furniture.save();

        // Return response with created furniture object
        res.status(201).json({
        message: 'Furniture created successfully',
        data: {
            id: furniture._id,
            name: furniture.name,
            type: furniture.type,
            dimensions: furniture.dimensions,
            stock: furniture.stock,
            createdAt: furniture.createdAt,
        },
        });
    } catch (error) {
        // Catch and handle any errors
        console.error(error);
        res.status(500).json({ error: 'Something went wrong while creating furniture. Please try again.' });
    }
    };


// Get all Furniture
const getAllFurniture = async (req, res) => {
    try {
      const furnitureList = await Furniture.find();
      res.status(200).json(furnitureList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get a single Furniture by ID
  const getFurnitureById = async (req, res) => {
    try {
      const furniture = await Furniture.findById(req.params.id);
      if (!furniture) {
        return res.status(404).json({ message: 'Furniture not found' });
      }
      res.status(200).json(furniture);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update Furniture by ID
  const updateFurniture = async (req, res) => {
    try {
      const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return updated document
        runValidators: true, // Enforce schema validation
      });
      if (!furniture) {
        return res.status(404).json({ message: 'Furniture not found' });
      }
      res.status(200).json({ message: 'Furniture updated successfully', data: furniture });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Delete Furniture by ID
  const deleteFurniture = async (req, res) => {
    try {
      const furniture = await Furniture.findByIdAndDelete(req.params.id);
      if (!furniture) {
        return res.status(404).json({ message: 'Furniture not found' });
      }
      res.status(200).json({ message: 'Furniture deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get Furniture by type (filter)
  const getFurnitureByType = async (req, res) => {
    try {
      const { type } = req.query; // Query parameter
      const furnitureList = await Furniture.find({ type: type });
      res.status(200).json(furnitureList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update stock for Furniture
  const updateStock = async (req, res) => {
    try {
      const { stock } = req.body;
      const furniture = await Furniture.findByIdAndUpdate(
        req.params.id,
        { stock: stock },
        { new: true, runValidators: true }
      );
      if (!furniture) {
        return res.status(404).json({ message: 'Furniture not found' });
      }
      res.status(200).json({ message: 'Stock updated successfully', data: furniture });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Export all controllers
  module.exports = {
    createFurniture,
    getAllFurniture,
    getFurnitureById,
    updateFurniture,
    deleteFurniture,
    getFurnitureByType,
    updateStock,
  };


