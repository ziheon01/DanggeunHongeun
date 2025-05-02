const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');

const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터
app.use('/api', favoriteRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);


// 기본 라우트
app.get('/', (req, res) => {
  res.send('백엔드 서버 정상 작동 중!');
});

// 서버 실행 + DB 초기화
app.listen(PORT, async () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
  await initializeDatabase();  // DB 테이블 생성
});
