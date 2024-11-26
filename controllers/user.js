const bcryptjs = require("bcryptjs") 
const jwt = require('jsonwebtoken');
const User = require("../models/user");


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Send a success response (avoid returning the password)
        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Error creating user.",
            error: error.message,
        });
    }
};

module.exports = register;

// Get user by ID
// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id); // Fetch user by ID
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json(user); // Return user in response
//   } catch (error) {
//     res.status(500).json({ error: 'Something went wrong while fetching the user.' });
//   }
// };

// // Export controllers
// module.exports = {
  
//   getUserById,
// };







const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify the password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "your-secret-key", // Replace with your secret key
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Send success response
        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            message: "Error logging in user.",
            error: error.message,
        });
    }
};

module.exports = login;

module.exports = { register,login };
