import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Setup Driver Adapter Prisma
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-cadangan';

// ==========================================
// ENDPOINT 1: REGISTER (Mendaftar Akun Baru)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Cek apakah email sudah dipakai sebelumnya
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar!' });
    }

    // 2. Enkripsi (Hash) password menggunakan bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 3. Simpan user baru ke dalam database melalui Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });

    // 4. Kirim respons sukses (tanpa mengembalikan password hash)
    res.status(201).json({ 
      message: 'Registrasi berhasil!', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    });
  } catch (error) {
    console.error('Error saat register:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal pada server.' });
  }
});

// ==========================================
// ENDPOINT 2: LOGIN (Masuk ke Akun)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email di database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah!' });
    }

    // 2. Cek apakah password yang dimasukkan cocok dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah!' });
    }

    // 3. Buat token JWT yang membungkus ID dan Role user
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Token akan kedaluwarsa dalam 1 hari
    );

    // 4. Kirim respons sukses beserta tokennya
    res.json({ 
      message: 'Login berhasil!', 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal pada server.' });
  }
});

// Pastikan baris ini ada agar rute bisa dipanggil oleh index.js
export default router;
