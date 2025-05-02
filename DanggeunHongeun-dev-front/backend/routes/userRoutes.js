const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// 회원가입 API
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
