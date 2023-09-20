const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization'); // Token JWT biasanya dikirim melalui header 'Authorization'

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  try {
    // Memeriksa apakah token dimulai dengan "Bearer "
    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Mengambil bagian token setelah "Bearer "
    const tokenValue = token.substring(7);

    // Verifikasi token
    const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decodedToken; // Menambahkan informasi pengguna ke objek permintaan
    next();
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
