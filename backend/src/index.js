const express = require('express');
const cors = require('cors');
const { mulaiPool, ambilKoneksi } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
    let conn;
    try {
        conn = await ambilKoneksi();
        await conn.execute('SELECT 1 FROM dual');
        res.status(200).json({ status: 'ok', database: 'terhubung' });
    } catch (err) {
        console.error(err);
        res.status(503).json({ status: 'error', database: 'tidak terhubung' });
    } finally {
        if (conn) await conn.close();
    }
});

app.get('/api/layanan', (req, res) => {
    res.status(200).json({
        status: 'ok',
        data: [
            { nama: '119 ekstensi 8', keterangan: 'Krisis psikologis' },
            { nama: 'SAPA 129', keterangan: 'Kekerasan dan perlindungan' }
        ]
    });
});

const PORT = process.env.PORT || 3000;

mulaiPool().then(() => {
    app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
});