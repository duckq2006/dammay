const express = require('express');
const path = require('node:path');
const { getPool, isConfigured } = require('./db');
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/health', async (req, res) => {
  if (!isConfigured()) return res.json({ status: 'OK', mode: 'demo', database: 'Not configured' });
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS OK');
    res.json({ status: 'OK', mode: 'demo', database: 'Connected' });
  } catch (error) {
    console.error('Database health check failed:', error.code || 'UNKNOWN');
    res.status(503).json({ error: 'Chưa kết nối được cơ sở dữ liệu.' });
  }
});
app.use('/api', (req, res) => res.status(404).json({ error: 'API không tồn tại.' }));
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Dữ liệu JSON không hợp lệ.' });
  if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Dữ liệu gửi lên quá lớn.' });
  console.error('Request failed:', error.code || 'UNKNOWN');
  res.status(500).json({ error: 'Không thể xử lý yêu cầu.' });
});
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => console.log('WeWine: http://localhost:' + port));
}
module.exports = app;