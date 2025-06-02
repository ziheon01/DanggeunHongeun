const mysql = require('mysql2/promise');

// MySQL 연결 설정 (조원이 당신의 IP로 접속)
const pool = mysql.createPool({
  host: '0.tcp.jp.ngrok.io',  // 너 ngrok 주소
  port: //공유받은 포트 주소소 ,                // ngrok 포트 
  user: 'teamuser',           
  password: 'team1234!',      
  database: 'danggeun',       // ✅ 쉼표 추가
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 테이블 생성 함수
async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('🔌 DB 연결 성공, 테이블을 생성합니다...');

    // ✅ 백틱(`)으로 SQL 쿼리를 문자열로 감싸기
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        location_id INT NOT NULL,
        is_primary BOOLEAN DEFAULT false,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (location_id) REFERENCES locations(id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        image_url VARCHAR(255),
        category_id INT,
        user_id INT,
        location_id INT,
        status_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (location_id) REFERENCES locations(id),
        FOREIGN KEY (status_id) REFERENCES product_status(id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE KEY unique_favorite (user_id, product_id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        buyer_id INT NOT NULL,
        seller_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users(id),
        FOREIGN KEY (seller_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chat_id INT NOT NULL,
        sender_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_id) REFERENCES chats(id),
        FOREIGN KEY (sender_id) REFERENCES users(id)
      );
    `);

    console.log('✅ 모든 테이블이 생성되었습니다!');
  } catch (error) {
    console.error('❌ 테이블 생성 중 오류 발생:', error);
  } finally {
    connection.release();
  }
}

// 외부에서 사용 가능하도록 내보내기
module.exports = {
  pool,
  initializeDatabase,
};