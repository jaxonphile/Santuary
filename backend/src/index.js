const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mulaiPool, ambilKoneksi } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

function verifikasiToken(req, res, next) {
    const header = req.headers.authorization || '';
    const [skema, token] = header.split(' ');

    if (skema !== 'Bearer' || !token) {
        return res.status(401).json({
            status: 'error',
            pesan: 'Token tidak diberikan'
        });
    }

    try {
        req.pengguna = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.log('JWT error:', err.message);
        return res.status(401).json({
            status: 'error',
            pesan: 'Token tidak valid atau kedaluwarsa'
        });
    }
}

const NAMA_KATEGORI = {
    verbal: 'Perundungan verbal',
    fisik: 'Perundungan fisik',
    siber: 'Perundungan siber',
    seksual: 'Pelecehan seksual',
    sosial: 'Pengucilan sosial'
};

const KATEGORI_KEY = Object.fromEntries(
    Object.entries(NAMA_KATEGORI).map(([kunci, nama]) => [nama, kunci])
);

function waktuRelatif(tanggal) {
    const menit = Math.floor((Date.now() - new Date(tanggal).getTime()) / 60000);
    if (menit < 1) return 'baru saja';
    if (menit < 60) return menit + ' menit lalu';
    const jam = Math.floor(menit / 60);
    if (jam < 24) return jam + ' jam lalu';
    return Math.floor(jam / 24) + ' hari lalu';
}

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

app.get('/api/auth/saya', verifikasiToken, (req, res) => {
    res.status(200).json({
        status: 'ok',
        pengguna: req.pengguna
    });
});

app.post('/api/cerita', verifikasiToken, async (req, res) => {
    let conn;
    try {
        const { judul, isi, kategori, tingkat, sensitif } = req.body;
        const privasi = req.body.privasi || 'PUBLIK';

        if (!judul || !isi || !kategori || !tingkat) {
            return res.status(400).json({
                status: 'error',
                pesan: 'judul, isi, kategori, dan tingkat wajib diisi'
            });
        }
        if (!['BERCERITA', 'DUKUNGAN', 'LAPORAN'].includes(tingkat)) {
            return res.status(400).json({
                status: 'error',
                pesan: 'tingkat tidak dikenal'
            });
        }
        if (!['PUBLIK', 'TERBATAS'].includes(privasi)) {
            return res.status(400).json({
                status: 'error',
                pesan: 'privasi tidak dikenal'
            });
        }

        const namaKategori = NAMA_KATEGORI[kategori];
        if (!namaKategori) {
            return res.status(400).json({
                status: 'error',
                pesan: 'kategori tidak dikenal'
            });
        }

        conn = await ambilKoneksi();
        const kat = await conn.execute(
            `SELECT id AS "id" FROM kategori_bullying WHERE nama_kategori = :nama`,
            { nama: namaKategori }
        );

        if (!kat.rows[0]) {
            return res.status(500).json({
                status: 'error',
                pesan: 'Kategori belum ada di database'
            });
        }

        await conn.execute(
            `INSERT INTO cerita
                (pengguna_id, kategori_id, judul, isi,
                tingkat_keterlibatan, label_sensitif, status_moderasi)
            VALUES
                (:pengguna, :kategori, :judul, :isi,
                :tingkat, :sensitif, 'MENUNGGU')`,
            {
                pengguna: req.pengguna.id,
                kategori: kat.rows[0].id,
                judul: judul,
                isi: isi,
                tingkat: tingkat,
                sensitif: sensitif === true || sensitif === 'true' ? 1 : 0
            },
            { autoCommit: true }
        );

        res.status(201).json({
            status: 'ok',
            pesan: 'Cerita berhasil dikirim dan menunggu moderasi'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            pesan: 'Gagal membuat cerita'
        });
    } finally {
        if (conn) await conn.close();
    }
});

app.post('/api/cerita/:id/komentar', verifikasiToken, async (req, res) => {
    let conn;
    try {
        const { isi } = req.body;
        const ceritaId = Number(req.params.id);

        if (!isi || String(isi).trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                pesan: 'isi komentar wajib diisi'
            });
        }
        if (String(isi).length > 1000) {
            return res.status(400).json({
                status: 'error',
                pesan: 'isi komentar maksimal 1000 karakter'
            });
        }

        conn = await ambilKoneksi();
        const cek = await conn.execute(
            `SELECT id AS "id" FROM cerita
             WHERE id = :id AND status_moderasi = 'DISETUJUI'`,
            { id: ceritaId }
        );

        if (!cek.rows[0]) {
            return res.status(404).json({
                status: 'error',
                pesan: 'Cerita tidak ditemukan atau belum disetujui'
            });
        }

        await conn.execute(
            `INSERT INTO komentar (cerita_id, pengguna_id, isi)
             VALUES (:cerita, :pengguna, :isi)`,
            {
                cerita: ceritaId,
                pengguna: req.pengguna.id,
                isi: String(isi).trim()
            },
            { autoCommit: true }
        );

        res.status(201).json({
            status: 'ok',
            pesan: 'Komentar dukungan berhasil dikirim'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            pesan: 'Gagal mengirim komentar'
        });
    } finally {
        if (conn) await conn.close();
    }
});

app.post('/api/laporan-konten', verifikasiToken, async (req, res) => {
    let conn;
    try {
        const { alasan } = req.body;
        const ceritaId = req.body.cerita_id ? Number(req.body.cerita_id) : null;
        const komentarId = req.body.komentar_id ? Number(req.body.komentar_id) : null;

        if (!alasan || String(alasan).trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                pesan: 'alasan wajib diisi'
            });
        }
        if (!ceritaId && !komentarId) {
            return res.status(400).json({
                status: 'error',
                pesan: 'cerita_id atau komentar_id wajib diisi'
            });
        }

        conn = await ambilKoneksi();
        const cek = ceritaId
            ? await conn.execute(
                `SELECT id AS "id" FROM laporan_konten
                 WHERE pelapor_id = :pelapor AND cerita_id = :target`,
                { pelapor: req.pengguna.id, target: ceritaId }
            )
            : await conn.execute(
                `SELECT id AS "id" FROM laporan_konten
                 WHERE pelapor_id = :pelapor AND komentar_id = :target`,
                { pelapor: req.pengguna.id, target: komentarId }
            );

        if (cek.rows[0]) {
            return res.status(409).json({
                status: 'error',
                pesan: 'Konten ini sudah kamu laporkan'
            });
        }

        await conn.execute(
            `INSERT INTO laporan_konten
                (pelapor_id, cerita_id, komentar_id, alasan)
             VALUES
                (:pelapor, :cerita, :komentar, :alasan)`,
            {
                pelapor: req.pengguna.id,
                cerita: ceritaId,
                komentar: komentarId,
                alasan: String(alasan).trim().slice(0, 255)
            },
            { autoCommit: true }
        );

        res.status(201).json({
            status: 'ok',
            pesan: 'Laporan terkirim. Moderator akan meninjaunya.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            pesan: 'Gagal mengirim laporan'
        });
    } finally {
        if (conn) await conn.close();
    }
});

app.get('/api/cerita', async (req, res) => {
    let conn;
    try {
        conn = await ambilKoneksi();
        const hasil = await conn.execute(
            `SELECT c.id AS "id",
                    c.judul AS "judul",
                    c.isi AS "isi",
                    u.nama_samaran AS "nama",
                    k.nama_kategori AS "nama_kategori",
                    c.tingkat_keterlibatan AS "tingkat",
                    c.label_sensitif AS "label_sensitif",
                    c.dibuat_pada AS "dibuat_pada",
                    (SELECT COUNT(*) FROM komentar km
                     WHERE km.cerita_id = c.id) AS "dukungan"
             FROM cerita c
             JOIN pengguna u ON u.id = c.pengguna_id
             JOIN kategori_bullying k ON k.id = c.kategori_id
             WHERE c.status_moderasi = 'DISETUJUI'
             ORDER BY c.dibuat_pada DESC
             FETCH FIRST 20 ROWS ONLY`
        );

        const data = hasil.rows.map((baris) => ({
            id: baris.id,
            judul: baris.judul,
            isi: baris.isi,
            nama: baris.nama,
            kategori: KATEGORI_KEY[baris.nama_kategori] || 'verbal',
            tingkat: baris.tingkat,
            sensitif: Number(baris.label_sensitif) === 1,
            dukungan: Number(baris.dukungan),
            waktu: waktuRelatif(baris.dibuat_pada)
        }));

        res.status(200).json({ status: 'ok', data: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            pesan: 'Gagal memuat cerita'
        });
    } finally {
        if (conn) await conn.close();
    }
});

const PORT = process.env.PORT || 3000;

mulaiPool().then(() => {
    app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
});