const User=require('../models/User')
const jwt = require('jsonwebtoken');


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    
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
            secure: false,
            maxAge:24*60*60*1000 ,
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



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user._id);
    
   
    console.log('Setting token:', token);

    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      
      maxAge: 24 * 60 * 60 * 1000 ,
    });

    
    console.log('Response cookies:', res.getHeader('Set-Cookie'));

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
};


exports.logout = (req, res) => {
  
  console.log('Incoming cookies:', req.cookies);
  console.log('Incoming token:', req.cookies.token);
  
  
  res.cookie('token', '', {
    httpOnly: true,
    secure: false, 
  
    maxAge: 0
  });

  res.status(200).json({ message: 'Logout successful' });
};
exports.checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded.id });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};