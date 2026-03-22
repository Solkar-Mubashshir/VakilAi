const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');// this line

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, language } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Please provide name, email, and password');
  }
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('User already exists with this email'); }
  const user = await User.create({ name, email, password, language: language || 'english' });
  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, language: user.language },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Please provide email and password'); }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  res.json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, language: user.language },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

const updateLanguage = asyncHandler(async (req, res) => {
  const { language } = req.body;
  if (!['english', 'hindi'].includes(language)) {
    res.status(400); throw new Error('Language must be "english" or "hindi"');
  }
  req.user.language = language;
  await req.user.save();
  res.json({ success: true, language });
});

module.exports = { registerUser, loginUser, getMe, updateLanguage };