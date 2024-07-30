const jwt = require('jsonwebtoken');

const userMiddleWare = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    if (isValid.role != 'user') {
      return res.json({ msg: 'Access restriced' });
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

module.exports = userMiddleWare;
