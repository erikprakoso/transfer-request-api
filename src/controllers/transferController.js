// controllers/transferController.js
const TransferRequest = require('../models/TransferRequest');
const User = require('../models/User'); // Jika perlu mengakses informasi pengguna

// Fungsi untuk membuat permintaan transfer baru
// ...
exports.createTransferRequest = async (req, res) => {
  try {
    // Dapatkan data permintaan transfer dari body permintaan
    const { user, transferRequest } = req.body;

    // Periksa otorisasi pengguna, pastikan hanya "maker" yang dapat membuat permintaan
    const userRole = user.role;
    const username = user.username;

    if (userRole !== 'maker') {
      return res.status(403).json({ message: 'Not authorized to create transfer requests' });
    }

    // Set status permintaan transfer menjadi "pending"
    const { senderAccount, recipientAccount, amount, status } = transferRequest;
    if (status !== 'pending') {
      return res.status(400).json({ message: 'Status must be "pending" for a new transfer request' });
    }

    // Memeriksa apakah username ada di MongoDB

    const existingUser = await User.findOne({ username });

    if (existingUser.role !== 'maker') {
      return res.status(403).json({ message: 'Not authorized to create transfer requests' });
    }

    if (!existingUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Menambahkan ID pengguna dan username ke data permintaan transfer
    const userId = existingUser._id.toString();
    const newTransferRequest = new TransferRequest({ senderAccount, recipientAccount, amount, status, userId });

    // Simpan permintaan transfer ke database
    await newTransferRequest.save();

    res.status(201).json({ message: 'Transfer request created successfully' });
  } catch (error) {
    console.error('Error creating transfer request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ...

  
  // Fungsi untuk mendapatkan daftar permintaan transfer
  // ...
  exports.getTransferRequests = async (req, res) => {
    try {
      // Periksa otorisasi pengguna, pastikan hanya "maker" dan "approver" yang dapat melihat daftar
      const userRole = req.params.role;
  
      if (userRole !== 'maker' && userRole !== 'approver') {
        return res.status(403).json({ message: 'Not authorized to view transfer requests' });
      }
  
      let statusFilter = {};
  
      if (userRole === 'maker') {
        // Jika pengguna adalah "maker," maka tampilkan permintaan dengan status "pending"
        statusFilter = { status: 'pending' };
      } else if (userRole === 'approver') {
        // Jika pengguna adalah "approver," tampilkan permintaan dengan status "approved" atau "rejected"
        statusFilter = { status: { $in: ['approved', 'rejected'] } };
      }
  
      // Dapatkan daftar permintaan transfer sesuai dengan filter status yang diterapkan
      const transferRequests = await TransferRequest.find(statusFilter);
  
      res.status(200).json(transferRequests);
    } catch (error) {
      console.error('Error getting transfer requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// ...

  
  // Fungsi untuk menyetujui atau menolak permintaan transfer
  // ...
exports.approveOrRejectTransferRequest = async (req, res) => {
  try {
    const { user } = req.body;
    const userRole = user.role;
    const status = req.body.status;

    // Jika peran pengguna adalah "approver", maka ini adalah operasi persetujuan atau penolakan.
    if (userRole === 'approver') {
      // Dapatkan ID permintaan transfer dari parameter atau body permintaan
      const transferRequestId = req.params.id || req.body.id;

      if (!transferRequestId) {
        return res.status(400).json({ message: 'Transfer request ID is required' });
      }

      // Lakukan operasi persetujuan atau penolakan di sini.
      // Anda dapat mengubah status permintaan transfer menjadi "approved" atau "rejected" di database.

      // Contoh: Mengganti status permintaan transfer menjadi "approved"
      await TransferRequest.findByIdAndUpdate(transferRequestId, { status: status });

      if (status === 'approved') {
        return res.status(200).json({ message: 'Transfer request approved successfully' });
      } else if (status === 'rejected') {
        return res.status(200).json({ message: 'Transfer request rejected successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid status' });
      }
    }

    // Jika peran pengguna tidak sesuai, kirim respons "Not authorized".
    return res.status(403).json({ message: 'Not authorized for this operation' });
  } catch (error) {
    console.error('Error handling transfer request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// ...

  
  // Fungsi lain sesuai kebutuhan
  