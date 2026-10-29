const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const sql = require('mssql');
function isConfigured() {
  return ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'].every(key => Boolean(process.env[key]));
}
let connection;
function getPool() {
  if (!isConfigured()) return Promise.reject(Object.assign(new Error('SQL configuration is missing.'), { code: 'ENOCONFIG' }));
  if (!connection) {
    connection = (async () => {
      const pool = new sql.ConnectionPool({
        user: process.env.DB_USER, password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER, database: process.env.DB_NAME, port: 1433,
        options: { encrypt: true, trustServerCertificate: false },
        pool: { max: 5, min: 0, idleTimeoutMillis: 60000 },
        connectionTimeout: 15000, requestTimeout: 15000
      });
      pool.on('error', error => console.error('SQL pool error:', error.code || 'UNKNOWN'));
      try { await pool.connect(); return pool; }
      catch (error) { await pool.close().catch(() => {}); throw error; }
    })().catch(error => { connection = undefined; throw error; });
  }
  return connection;
}
module.exports = { sql, getPool, isConfigured };