// Import dependensi yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); // Jika Anda menggunakan dotenv untuk mengakses variabel lingkungan
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Inisialisasi Express
const app = express();

// Menggunakan middleware
app.use(bodyParser.json());
app.use(cors());

// Mengakses variabel lingkungan jika menggunakan dotenv
dotenv.config();

// Menghubungkan ke MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Definisikan konfigurasi Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Versi OpenAPI (bisa disesuaikan)
    info: {
      title: 'Transfer Request Management API',
      description: 'API for managing transfer requests',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // Daftar file rute yang berisi dokumentasi Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Gunakan middleware untuk menampilkan UI Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Definisikan rute-rute API
const transferRoutes = require('./src/routes/transferRoutes');
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/transfers', transferRoutes);
app.use('/api/users', userRoutes);

// Menjalankan server Express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
