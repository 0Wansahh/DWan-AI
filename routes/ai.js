import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/predict', async (req, res) => {
  try {
    // 1. Ambil data harga dari CoinGecko
    const coinUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true';
    const coinRes = await fetch(coinUrl);
    const marketData = await coinRes.json();

    // 2. Siapkan Prompt
    const prompt = `
    Analisis data harga crypto berikut dan berikan pandangan trading singkat:
    Bitcoin: $${marketData.bitcoin.usd} (${marketData.bitcoin.usd_24h_change}%),
    Ethereum: $${marketData.ethereum.usd} (${marketData.ethereum.usd_24h_change}%),
    Solana: $${marketData.solana.usd} (${marketData.solana.usd_24h_change}%)
    Berikan saran singkat dalam 2 paragraf saja.
    `;

    // 3. Daftar model yang pasti ada di akunmu
    const modelsToTry = [
        'gemini-3.5-flash-lite',   // Coba yang versi ringan dan cepat dulu
        'gemini-3.1-pro-preview'   // Kalau gagal, coba versi pro
    ];
    
    let text = "";
    let lastError = "";

    // 4. Sistem mencoba model satu per satu
    for (const modelName of modelsToTry) {
        try {
            console.log(`Mencoba AI model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            text = result.response.text();
            
            console.log(`BERHASIL menggunakan model: ${modelName}!`);
            break; // Stop mencoba jika sudah berhasil
        } catch (err) {
            console.log(`Gagal model ${modelName}:`, err.message.substring(0, 80));
            lastError = err.message;
        }
    }

    if (!text) {
        throw new Error("Kedua model gagal diakses. Error terakhir: " + lastError);
    }

    // 5. Kirim hasil
    res.status(200).json({ prediction: text });
  } catch (error) {
    console.error('ERROR GEMINI:', error);
    res.status(500).json({ error: 'Gagal memanggil AI: ' + error.message });
  }
});

export default router;
