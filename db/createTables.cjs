const mysql = require('mysql2/promise');

async function createTables() {
  let connection = null;
  
  try {
    console.log('Connexion à la base de données...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456'
    });
    
    console.log('Création de la base de données...');
    await connection.query('CREATE DATABASE IF NOT EXISTS examen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    await connection.query('USE examen;');
    
    console.log('Création de la table users...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS users (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'email VARCHAR(255) UNIQUE NOT NULL,' +
      'name VARCHAR(255) NOT NULL,' +
      'password_hash VARCHAR(255) NOT NULL,' +
      "role ENUM('user', 'admin', 'super_admin') DEFAULT 'user'," +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' +
      ');'
    );
    
    console.log('Création de la table challenges...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS challenges (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'initial_balance DECIMAL(15, 2) NOT NULL,' +
      'current_balance DECIMAL(15, 2) NOT NULL,' +
      "status ENUM('active', 'failed', 'passed') DEFAULT 'active'," +
      'max_daily_loss DECIMAL(10, 2) NOT NULL,' +
      'max_total_loss DECIMAL(10, 2) NOT NULL,' +
      'profit_target DECIMAL(10, 2) NOT NULL,' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Création de la table trades...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS trades (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'challenge_id INT NOT NULL,' +
      'symbol VARCHAR(50) NOT NULL,' +
      "type ENUM('BUY', 'SELL') NOT NULL," +
      'price DECIMAL(10, 5) NOT NULL,' +
      'quantity DECIMAL(10, 2) NOT NULL,' +
      'pnl DECIMAL(10, 2) DEFAULT NULL,' +
      'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,' +
      'FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Création de la table ai_signals...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS ai_signals (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'symbol VARCHAR(50) NOT NULL,' +
      "direction ENUM('BUY', 'SELL', 'NEUTRAL') NOT NULL," +
      'confidence DECIMAL(3, 2) NOT NULL,' +
      'entry_point DECIMAL(10, 5) DEFAULT NULL,' +
      'stop_loss DECIMAL(10, 5) DEFAULT NULL,' +
      'take_profit DECIMAL(10, 5) DEFAULT NULL,' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
      ');'
    );
    
    console.log('Création de la table portfolios...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS portfolios (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'name VARCHAR(255) NOT NULL,' +
      'description TEXT,' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Création de la table positions...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS positions (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'portfolio_id INT,' +
      'symbol VARCHAR(50) NOT NULL,' +
      "type ENUM('LONG', 'SHORT') NOT NULL," +
      'quantity DECIMAL(15, 8) NOT NULL,' +
      'entry_price DECIMAL(10, 5) NOT NULL,' +
      'current_price DECIMAL(10, 5) NOT NULL,' +
      'unrealized_pnl DECIMAL(15, 2) DEFAULT 0.00,' +
      'realized_pnl DECIMAL(15, 2) DEFAULT 0.00,' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,' +
      'FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL' +
      ');'
    );
    
    console.log('Création de la table user_sessions...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS user_sessions (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'session_token VARCHAR(255) UNIQUE NOT NULL,' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'expires_at TIMESTAMP NOT NULL,' +
      'is_active BOOLEAN DEFAULT TRUE,' +
      'ip_address VARCHAR(45),' +
      'user_agent TEXT,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Création de la table challenge_history...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS challenge_history (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'challenge_id INT NOT NULL,' +
      'initial_balance DECIMAL(15, 2) NOT NULL,' +
      'final_balance DECIMAL(15, 2) NOT NULL,' +
      'profit DECIMAL(15, 2) NOT NULL,' +
      'profit_percentage DECIMAL(5, 2) NOT NULL,' +
      'start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'end_date TIMESTAMP NULL,' +
      "status ENUM('active', 'failed', 'passed') NOT NULL," +
      'notes TEXT,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,' +
      'FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Création de la table user_preferences...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS user_preferences (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT UNIQUE NOT NULL,' +
      "language VARCHAR(10) DEFAULT 'en'," +
      "theme ENUM('light', 'dark', 'auto') DEFAULT 'dark'," +
      'notifications_enabled BOOLEAN DEFAULT TRUE,' +
      'email_notifications BOOLEAN DEFAULT FALSE,' +
      'sms_notifications BOOLEAN DEFAULT FALSE,' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Création de la table user_achievements...');
    await connection.query(
      'CREATE TABLE IF NOT EXISTS user_achievements (' +
      'id INT AUTO_INCREMENT PRIMARY KEY,' +
      'user_id INT NOT NULL,' +
      'achievement_type VARCHAR(100) NOT NULL,' +
      'achievement_name VARCHAR(255) NOT NULL,' +
      'description TEXT,' +
      'earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,' +
      'points INT DEFAULT 0,' +
      'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE' +
      ');'
    );
    
    console.log('Toutes les tables ont été créées avec succès!');
    
    // Vérifions les tables créées
    const [tables] = await connection.query('SHOW TABLES;');
    console.log('\nTables créées:');
    tables.forEach(table => {
      console.log('- ' + Object.values(table)[0]);
    });
    
    await connection.end();
    console.log('\nConnexion fermée.');
    
  } catch (error) {
    console.error('Erreur:', error);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Erreur lors de la fermeture de la connexion:', closeError);
      }
    }
  }
}

createTables();