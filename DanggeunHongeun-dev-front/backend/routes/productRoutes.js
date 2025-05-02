// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/products/search', async (req, res) => {
  const query = req.query.q;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE title LIKE ? OR description LIKE ?",
      [`%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("검색 실패:", err);
    res.status(500).json({ message: "검색 실패" });
  }
});

// ✅ 1. 상품 목록 조회 (검색 포함)
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

// ✅ 3. 상품 등록
router.post('/products', async (req, res) => {
  const { title, description, price, image_url, category_id, user_id, location_id, status_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO products (title, description, price, image_url, category_id, user_id, location_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, image_url, category_id, user_id, location_id, status_id]
    );
    res.status(201).json({ message: '상품 등록 완료' });
  } catch (err) {
    console.error('상품 등록 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 4. 상품 상태 변경
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
