import express from 'express';

const router = express.Router();

// Route untuk mengambil data pasar saat ini
router.get('/market', async (req, res) => {
  try {
    // Menggunakan API gratis dari CoinGecko
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari CoinGecko');
    }

    const data = await response.json();
    
    res.status(200).json({
      message: 'Data pasar berhasil diambil',
      data: data
    });
  } catch (error) {
    console.error('DETAIL ERROR CRYPTO:', error);
    res.status(500).json({ error: 'Gagal mengambil data pasar crypto.' });
  }
});

export default router;
