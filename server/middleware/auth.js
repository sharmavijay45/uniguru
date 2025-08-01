import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  console.log('🔐 Auth Debug:');
  console.log('Headers:', req.headers.authorization ? 'Authorization header present' : 'No authorization header');
  console.log('Cookies:', req.cookies.token ? 'Token cookie present' : 'No token cookie');
  console.log('Origin:', req.headers.origin);

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from Authorization header');
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
    console.log('Token from cookies');
  }

  // Make sure token exists
  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    console.log('🔍 Verifying token...');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified, user ID:', decoded.id);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User authenticated:', req.user.email);
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }

  next();
};

/**
 * Grant access to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};
