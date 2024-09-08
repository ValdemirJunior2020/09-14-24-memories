// controllers/user.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Ensure the path is correct

const secret = 'test'; // Use a secure secret key in production

// Signin controller function
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    console.log('Signin error:', err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Signup controller function with detailed error logging
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  console.log('Received signup data:', req.body); // Debug received data

  // Check for missing fields
  if (!email || !password || !firstName || !lastName) {
    console.error('Missing required fields:', { email, password, firstName, lastName });
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      console.error('User already exists:', email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    // Generate JWT token
    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

    res.status(201).json({ result, token });
  } catch (error) {
    console.error('Signup error:', error); // Detailed error logging
    res.status(500).json({ message: "Something went wrong" });
  }
};
