const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    const user = new User({ username, email, password, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token, user: { id: user._id, username, email, role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
  } catch (err) {
    next(err);
  }
};