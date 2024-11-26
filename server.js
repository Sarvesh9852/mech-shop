const express = require('express');
const app = express();
require('dotenv').config();
const userRoute = require("./routes/userRouts"); // Correct import of user routes
const furnitureRoute = require("./routes/furnitureRoutes"); // Correct import of user routes
const orderRoutes = require("./routes/orderRoutes"); // Correct import of user routes


const bodyParser = require('body-parser');
const connectDB = require('./db/db');

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Connect Routes
app.use("/api/user", userRoute); // Use the correct route
app.use("/api/furniture", furnitureRoute); // Use the correct route
app.use("/api/order", orderRoutes); // Use the correct route

// Define PORT
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
    connectDB(); // Call to connect the database
    console.log(`Server is running on port ${PORT}`);
});
    