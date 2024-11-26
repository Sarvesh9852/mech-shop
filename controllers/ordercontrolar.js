const Furniture = require("../models/furniture");
const Order = require("../models/orders");
const User = require("../models/user");


// Create a new order
const createOrder = async (req, res) => {
  const { userId, price, customization, quantity, furnitureIds } = req.body;

  try {
    // Input validation
    if (!userId || !price || !quantity || !furnitureIds || furnitureIds.length === 0) {
      return res.status(400).json({ error: "Please provide all necessary fields: userId, price, quantity, and furnitureIds." });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate furniture items exist
    const furnitureItems = await Furniture.find({ '_id': { $in: furnitureIds } });
    if (furnitureItems.length !== furnitureIds.length) {
      return res.status(404).json({ error: "One or more furniture items not found." });
    }

    // Validate quantity for each furniture item (if needed)
    for (let i = 0; i < furnitureItems.length; i++) {
      if (furnitureItems[i].stock < quantity) {
        return res.status(400).json({ error: `Not enough stock for ${furnitureItems[i].name}. Available: ${furnitureItems[i].stock}` });
      }
    }

    // Create the order
    const order = new Order({
      user: userId,
      price,
      customization: customization || '', // Optional customization
      quantity,
      furniture: furnitureIds,
    });

    // Save the order to the database
    await order.save();

    // Update user with the new order reference
    user.orders.push(order._id);
    await user.save();

    // Update furniture stock based on order quantity
    for (let i = 0; i < furnitureItems.length; i++) {
      furnitureItems[i].stock -= quantity;
      await furnitureItems[i].save();
    }

    // Return success response
    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order._id,
        user: user.name,
        price: order.price,
        customization: order.customization,
        quantity: order.quantity,
        furniture: order.furniture,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: "Something went wrong while creating the order. Please try again." });
  }
};

module.exports = { createOrder };