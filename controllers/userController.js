// controllers/userController.js

const User   = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

//
// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
//
exports.registerController = async (req, res, next) => {
  console.log('→ [register] payload:', req.body);

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    console.warn('→ Missing fields:', { name, email, password });
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn('→ Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ name, email, password: hash });

    console.log('→ Registration successful:', user._id);
    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('🔥 registerController error:', err);
    return next(err);
  }
};

//
// @desc    Authenticate a user & return a JWT
// @route   POST /api/v1/users/login
// @access  Public
//
exports.loginController = async (req, res, next) => {
  console.log('→ [login] payload:', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.warn('→ Missing login fields:', { email, password });
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.warn('→ Login failed, no such user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('→ Login failed, wrong password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('→ Login successful:', user._id);
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('🔥 loginController error:', err);
    return next(err);
  }
};
