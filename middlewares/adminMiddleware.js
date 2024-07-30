const jwt = require('jsonwebtoken');

const adminMiddleWare = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    if (isValid.role != 'admin') {
      return res.json({ msg: 'Access restricted' });
    }
    req.body.email = isValid.email;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    return res.json({ msg: 'Internal server error' });
  }
};

module.exports = adminMiddleWare;
