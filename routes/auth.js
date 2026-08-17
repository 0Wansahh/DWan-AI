import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = express.Router();

// Setup Driver Adapter Prisma
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Setup Transporter Nodemailer untuk Kirim Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. ROUTE REGISTER (Dilengkapi Pembuatan Kode OTP & Kirim Email)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar!' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Buat kode verifikasi acak 6 digit
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        verification_code: code,
        is_verified: false,
      },
    });

    // Kirim Email Berisi Kode OTP
    await transporter.sendMail({
      from: '"DWan AI Crypto" <noreply@dwan.ai>',
      to: email,
      subject: 'Kode Verifikasi Akun DWan AI',
      text: `Halo ${name},\n\nTerima kasih telah mendaftar di DWan AI Crypto.\nKode verifikasi kamu adalah: ${code}\n\nMasukkan kode ini di aplikasi untuk mengaktifkan akunmu.`,
    });

    res.status(201).json({
      message: 'Registrasi berhasil! Silakan cek email kamu untuk kode verifikasi.',
    });
  } catch (error) {
    console.error('DETAIL ERROR REGISTER:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan internal pada server.' });
  }
});

// 2. ROUTE LOGIN (Cek Email, Password, dan Status Verifikasi)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Email atau password salah!' });
    }

    // Periksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email atau password salah!' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'rahasia_default',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('DETAIL ERROR LOGIN:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan internal pada server.' });
  }
});

// 3. ROUTE VERIFIKASI OTP
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email tidak ditemukan!' });
    }

    // Cek apakah akun sudah diverifikasi sebelumnya
    if (user.is_verified) {
      return res.status(400).json({ error: 'Akun ini sudah diverifikasi sebelumnya.' });
    }

    // Cocokkan kode OTP
    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Kode verifikasi salah atau tidak valid!' });
    }

    // Jika cocok, update status akun menjadi TERVERIFIKASI
    await prisma.user.update({
      where: { email },
      data: { 
        is_verified: true, 
        verification_code: null 
      },
    });

    res.status(200).json({ message: 'Verifikasi berhasil! Silakan login.' });
  } catch (error) {
    console.error('DETAIL ERROR VERIFY:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan server.' });
  }
});

export default router;
