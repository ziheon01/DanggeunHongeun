// ✅ index.js (수정된 버전)
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./db');

const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

app.use(cors());
app.use(express.json());

// ✅ 업로드된 파일 정적 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 라우터 등록
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', favoriteRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('백엔드 서버 정상 작동 중!');
});

// 디버깅용 라우트 출력 함수
function printRoutes(app) {
  try {
    if (!app._router || !app._router.stack) {
      console.log("❌ 등록된 라우트가 없습니다.");
      return;
    }

    console.log("✅ 등록된 라우트:");
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log("📌", middleware.route.path);
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route && handler.route.path) {
            console.log("📌", '/api' + handler.route.path);
          }
        });
      }
    });
  } catch (err) {
    console.error("❌ 라우트 출력 중 오류:", err);
  }
}

// 서버 실행
app.listen(PORT, async () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
  await initializeDatabase();
  printRoutes(app);
});
