// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi untuk mendaftarkan pengguna baru
exports.registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Periksa apakah username kosong (blank) atau hanya mengandung spasi
    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username can not be blank' });
    }

    // Periksa apakah pengguna dengan username yang sama sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Periksa apakah kata sandi memenuhi persyaratan
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain both letters and numbers'
      });
    }

    // Periksa apakah peran yang dipilih adalah salah satu dari 'maker' atau 'approver' (case-insensitive)
    if (!['maker', 'approver'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role. Role must be "maker" or "approver"' });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna ke database
    const user = new User({ username, password: hashedPassword, role });

    // Simpan ke database
    await user.save();

    // Buat token JWT untuk otentikasi
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Fungsi untuk masuk (login) pengguna
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari pengguna berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Periksa kata sandi
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Buat token JWT untuk otentikasi
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
