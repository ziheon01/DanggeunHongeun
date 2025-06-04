// 📄 userRoutes.js - 사용자 인증 및 승인 관련 기능 포함
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const multer = require('multer');
const path = require('path');

// ✅ 파일 업로드 설정 (uploads 폴더에 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// ✅ 회원가입 API (합격증 + 지갑 주소 포함)
router.post('/register', upload.single('proof'), async (req, res) => {
  const { username, email, password, university, walletAddress } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: '합격증 파일이 필요합니다.' });
  }

  // 🆕 지갑 주소 필수 확인
  if (!walletAddress) {
    return res.status(400).json({ message: 'MetaMask 지갑 연결이 필요합니다.' });
  }

  // 🆕 대학교 정보 필수 확인
  if (!university) {
    return res.status(400).json({ message: '대학교 정보가 필요합니다.' });
  }

  const proofUrl = `/uploads/${file.filename}`;

  try {
    // 기존 사용자 확인 (이메일, 닉네임, 지갑 주소)
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ? OR wallet_address = ?',
      [email, username, walletAddress]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        message: '이미 존재하는 사용자입니다. (이메일, 닉네임, 또는 지갑 주소 중복)' 
      });
    }

    // 🆕 대학교와 지갑 주소 포함하여 사용자 등록
    await pool.query(
      `INSERT INTO users 
       (username, email, password, university, wallet_address, is_verified, proof_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password, university, walletAddress, false, proofUrl]
    );

    res.status(201).json({ 
      message: '회원가입 요청 완료. 관리자 승인 후 블록체인에 인증 정보가 기록됩니다.',
      walletAddress: walletAddress
    });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 로그인 API (is_verified 체크 포함)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = users[0];

    if (!user.is_verified && !user.is_admin) {
      return res.status(403).json({ message: '아직 관리자의 승인이 필요합니다.' });
    }

    res.status(200).json({
      message: '로그인 성공!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_verified: user.is_verified,
        proof_url: user.proof_url
      }
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 관심 지역 업데이트 API
router.patch('/updateLocation', async (req, res) => {
  const { userId, location } = req.body;

  if (!userId || !location) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    await pool.query(
      'UPDATE users SET location = ? WHERE id = ?',
      [location, userId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('관심 지역 업데이트 오류:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// ✅ 관리자: 승인 대기 중 사용자 목록 조회 (수정된 버전)
router.get('/pending-users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, university, wallet_address, proof_url, created_at FROM users WHERE is_verified = false'
    );
    res.json(users);
  } catch (err) {
    console.error('승인 대기 사용자 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 관리자: 특정 사용자 승인
router.patch('/approve-user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'UPDATE users SET is_verified = true WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json({ message: '사용자 승인 완료' });
  } catch (err) {
    console.error('사용자 승인 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 관리자: 사용자 삭제 (승인 거절 포함)
router.delete('/reject-user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json({ message: '사용자 삭제 완료' });
  } catch (err) {
    console.error('사용자 삭제 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 사용자 본인 프로필 수정
router.patch('/update-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email,location } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email,location, id]
    );

    res.json({ message: '프로필 업데이트 완료' });
  } catch (err) {
    console.error('프로필 업데이트 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 사용자 탈퇴 API
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ message: '회원 탈퇴 완료' });
  } catch (err) {
    console.error('회원 탈퇴 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// userRoutes.js에 추가할 API

// ✅ 블록체인 정보 업데이트 API
router.patch('/update-blockchain-info/:id', async (req, res) => {
  const { id } = req.params;
  const { blockchain_verified, verification_tx_hash } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE users SET blockchain_verified = ?, verification_tx_hash = ? WHERE id = ?',
      [blockchain_verified, verification_tx_hash, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ 
      message: '블록체인 정보 업데이트 완료',
      txHash: verification_tx_hash 
    });
  } catch (err) {
    console.error('블록체인 정보 업데이트 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 블록체인 인증 상태 조회 API
router.get('/blockchain-status/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const [users] = await pool.query(
      'SELECT id, username, blockchain_verified, verification_tx_hash FROM users WHERE wallet_address = ?',
      [walletAddress]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('블록체인 상태 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});


module.exports = router;
