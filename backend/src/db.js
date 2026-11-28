const path = require('path');
const oracledb = require('oracledb');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.DB_TYPE_CLOB];

let pool = null;

async function mulaiPool() {
    pool = await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING
    });

    console.log('Pool database berhasil dibuat');
}

async function ambilKoneksi() {
    if (!pool) {
        throw new Error('Pool database belum siap. Panggil mulaiPool() dulu');
    }

    return pool.getConnection();
}

module.exports = { mulaiPool, ambilKoneksi };