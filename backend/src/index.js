const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

app.post('/api/auth/daftar', async (req, res) => {
    let conn;
    try {
        const { nama_samaran, email, password } = req.body;

        if (!nama_samaran || !email || !password) {
            return res.status(400).json({
                status: 'error',
                pesan: 'nama_samaran, email, dan password wajib diisi'
            });
        }

        const hash = await bcrypt.hash(password, 10);

        conn = await ambilKoneksi();
        await conn.execute(
            `INSERT INTO pengguna (nama_samaran, email, password_hash)
            VALUES (:nama, :email, :hash)`,
            { nama: nama_samaran, email: email, hash: hash },
            { autoCommit: true }
        );

        res.status(201).json({
            status: 'ok',
            pesan: 'Akun samaran berhasil dibuat'
        });
    } catch (err) {
        if (err.errorNum == 1) {
            return res.status(409).json({
                status: 'error',
                pesan: 'Email sudah terdaftar'
            });
        }

        console.error(err);
        res.status(500).json({
            status: 'error',
            pesan: 'Gagal membuat akun'
        });
    } finally {
        if (conn) await conn.close()
    }
});

app.post('/api/auth/masuk', async (req, res) => {
    let conn;
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                pesan: 'email dan password wajib diisi'
            });
        }

        conn = await ambilKoneksi();
        const hasil = await conn.execute(
            `SELECT id AS "id",
                    nama_samaran AS "nama_samaran",
                    password_hash AS "password_hash",
                    peran AS "peran"
            FROM pengguna
            WHERE email = :email`,
            { email }
        );

        const baris = hasil.rows[0];
        if (!baris) {
            return res.status(401).json({
                status: 'error',
                pesan: 'Email atau password salah'
            });
        }

        const cocok = await bcrypt.compare(password, baris.password_hash);
        if (!cocok) {
            return res.status(401).json({
                status: 'error',
                pesan: 'Email atau password salah'
            });
        }

        const token = jwt.sign(
            { id: baris.id, nama: baris.nama_samaran, peran: baris.peran },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            status: 'ok',
            token: token,
            pengguna: {
                id: baris.id,
                nama_samaran: baris.nama_samaran
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            pesan: 'Gagal masuk'
        });
    } finally {
        if (conn) await conn.close();
    }
});

const PORT = process.env.PORT || 3000;

mulaiPool().then(() => {
    app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
});