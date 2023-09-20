// routes/transferRoutes.js
const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const authMiddleware = require('../middleware/auth'); // Middleware otentikasi
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * /api/transfers/create:
 *   post:
 *     summary: Create a new transfer request
 *     description: Create a new transfer request with specified details. This endpoint is used by "makers" to create transfer requests.
 *     tags:
 *       - Transfers
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *                 required:
 *                   - username
 *                   - role
 *               transferRequest:
 *                 type: object
 *                 properties:
 *                   senderAccount:
 *                     type: string
 *                   recipientAccount:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                 required:
 *                   - senderAccount
 *                   - recipientAccount
 *                   - amount
 *                   - status
 *     responses:
 *       201:
 *         description: Transfer request created successfully
 *       400:
 *         description: Bad request, invalid input data or user not found
 *       403:
 *         description: Not authorized to create transfer requests
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/transfers/list:
 *   get:
 *     summary: Get a list of transfer requests
 *     description: Get a list of all transfer requests.
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       403:
 *         description: Forbidden, user not authorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/transfers/approve/{id}:
 *   put:
 *     summary: Approve or reject a transfer request
 *     description: Approve or reject a transfer request with the specified ID.
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transfer request to approve or reject
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *             example:
 *               id: 65099bd15a1b5803ebd7a138
 *               status: approved
 *               user:
 *                 username: approver1
 *                 role: approver
 *     responses:
 *       200:
 *         description: Transfer request approved/rejected successfully
 *       400:
 *         description: Bad request, invalid input data
 *       403:
 *         description: Forbidden, user not authorized
 *       500:
 *         description: Internal server error
 */



// Rute untuk membuat permintaan transfer baru
router.post(
  '/create',
  [
    // Menentukan aturan validasi menggunakan express-validator
    body('user.username').notEmpty().withMessage('Username is required'),
    body('user.role').notEmpty().withMessage('User role is required'),
    body('transferRequest.senderAccount').notEmpty().withMessage('Sender account is required'),
    body('transferRequest.recipientAccount').notEmpty().withMessage('Recipient account is required'),
    body('transferRequest.amount').isNumeric().withMessage('Amount must be a number'),
    // Tambahkan aturan validasi lain sesuai kebutuhan
  ],
  authMiddleware, // Tambahkan middleware otentikasi di sini
  (req, res) => {
    // Memeriksa hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Jika validasi berhasil, lanjutkan ke kontroler
    transferController.createTransferRequest(req, res);
  }
);


// Rute untuk mendapatkan daftar permintaan transfer
router.get('/list/:role', authMiddleware, transferController.getTransferRequests);

// Rute untuk menyetujui atau menolak permintaan transfer
router.put('/approve/:id', authMiddleware, transferController.approveOrRejectTransferRequest);

// Rute-rute lain sesuai kebutuhan

module.exports = router;
