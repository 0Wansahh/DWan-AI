import 'dotenv/config'; // <-- Ini wajib ditaruh di baris paling atas!
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// DAFTAR RUTE API (ROUTES)
// ==========================================
app.use('/api/auth', authRoutes);

// Route Test Dasar
app.get('/', (req, res) => {
  res.send('Backend AI Trade Crypto DWan Berjalan Lancar! 🚀');
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
