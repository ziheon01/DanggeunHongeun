const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../db');

// 🔧 Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 업로드 경로
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});
const upload = multer({ storage });

// ✅ 테스트 라우트
router.get('/test', (req, res) => {
  res.send("✅ 테스트 라우트 작동!");
});

// ✅ 1. 상품 목록 조회
router.get('/products', async (req, res) => {
  const keyword = req.query.keyword;
  let query = 'SELECT * FROM products';
  let params = [];

  if (keyword) {
    query += ' WHERE title LIKE ? OR description LIKE ?';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  try {
    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (err) {
    console.error('상품 목록 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 내 상품만 조회
router.get('/products/mine', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('내 상품 조회 실패:', err);
    res.status(500).json({ error: 'DB 오류' });
  }
});

// ✅ 검색
router.get('/products/search', async (req, res) => {
  const q = req.query.q;
  const query = `
    SELECT * FROM products 
    WHERE title LIKE ? OR description LIKE ?
  `;
  try {
    const [rows] = await pool.query(query, [`%${q}%`, `%${q}%`]);
    res.json(rows);
  } catch (err) {
    console.error("🔍 검색 오류:", err);
    res.status(500).json({ message: "검색 실패" });
  }
});

// ✅ 2. 상품 상세 조회
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await pool.query(`
      SELECT p.*, u.username AS sellerName
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(product[0]);
  } catch (err) {
    console.error('상품 상세 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 3. 상품 등록 (파일 포함)
router.post('/products', upload.single('image'), async (req, res) => {
  const { title, description, price, category_id, user_id, location, status_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await pool.query(
      'INSERT INTO products (title, description, price, image_url, category_id, user_id, location, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, image_url, category_id, user_id, location, status_id]
    );
    res.status(201).json({ message: '상품 등록 완료' });
  } catch (err) {
    console.error('상품 등록 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 4. 거래 상태 변경
router.patch('/products/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  try {
    await pool.query('UPDATE products SET status_id = ? WHERE id = ?', [status_id, id]);
    res.json({ message: '상태 변경 완료' });
  } catch (err) {
    console.error('상품 상태 변경 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
