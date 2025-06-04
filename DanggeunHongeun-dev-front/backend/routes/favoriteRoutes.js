const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// 찜 토글
router.post('/favorites/toggle', async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existing.length > 0) {
      // 이미 존재 → 삭제
      await pool.query(
        'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        [user_id, product_id]
      );
      return res.json({ message: '찜 취소됨' });
    } else {
      // 없으면 → 추가
      await pool.query(
        'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        [user_id, product_id]
      );
      return res.status(201).json({ message: '찜 완료' });
    }
  } catch (err) {
    console.error('찜 토글 실패:', err);
    res.status(500).json({ message: '찜 토글 실패' });
  }
});


// 찜 삭제
router.delete('/favorites', async (req, res) => {
  const { user_id, product_id } = req.query;
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );
    res.json({ message: '찜 취소 완료' });
  } catch (err) {
    console.error('찜 취소 실패:', err);
    res.status(500).json({ message: '찜 취소 실패' });
  }
});

// 찜 목록 조회
router.get('/favorites', async (req, res) => {
  const { user_id } = req.query;
  try {
    const [favorites] = await pool.query(
      `SELECT p.* FROM favorites f 
       JOIN products p ON f.product_id = p.id 
       WHERE f.user_id = ?`,
      [user_id]
    );
    res.json(favorites);
  } catch (err) {
    console.error('찜 목록 조회 실패:', err);
    res.status(500).json({ message: '찜 목록 조회 실패' });
  }
});

// /favorites/:userId - 찜 목록 조회 (파라미터 방식)
router.get('/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [favorites] = await pool.query(
      `SELECT p.* FROM favorites f 
       JOIN products p ON f.product_id = p.id 
       WHERE f.user_id = ?`,
      [userId]
    );
    res.json(favorites);
  } catch (err) {
    console.error('찜 목록 조회 실패:', err);
    res.status(500).json({ message: '찜 목록 조회 실패' });
  }
});


module.exports = router;
