// db.js
const mysql = require('mysql2/promise');

// MySQL 연결 설정
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dbs1242!',  // ← 반드시 수정
  database: 'danggeun',      // ← 반드시 생성되어 있어야 함
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 테이블 생성 함수
async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('🔌 DB 연결 성공, 테이블을 생성합니다...');

    // users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    // locations (예: 홍은1동, 연희동 등)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    // user_locations (동네 설정, 여러 개 가능)
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

    // product_status (판매중, 예약중, 거래완료)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE
      );
    `);

    // products
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

    // product_images (추가 이미지)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    // favorites (찜)
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

    // chats (채팅방)
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

    // messages (채팅 메시지)
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
