const User=require('../models/User')
const jwt = require('jsonwebtoken');

// Helper function to create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if role is provided and valid
    const validRoles = ['user', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    const user = await User.create({ 
      username, 
      email, 
      password, 
      role: userRole 
    });

    const token = createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ... rest of the code remains the same

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists and if the password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    // Create a JWT token
    const token = createToken(user._id);

    // Set the JWT token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,       // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
      sameSite: 'strict',   // Prevents CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration (30 days)
    });

    // Return user data in the response (without the token)
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 });
  res.json({ message: 'Logged out successfully' });
};
