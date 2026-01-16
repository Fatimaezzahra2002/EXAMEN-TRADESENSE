import dbConfig from '../config/dbConfig';

export class DbSetup {
  // Fonction pour vérifier si les tables existent et les créer si nécessaire
  static async initializeTables(): Promise<void> {
    try {
      console.log('Checking database tables...');
      
      // Vérifier si la table users existe
      const usersTableExists = await this.checkTableExists('users');
      if (!usersTableExists) {
        console.log('Creating users table...');
        await this.createUsersTable();
      } else {
        console.log('Users table already exists');
      }
      
      // Vérifier si la table challenges existe
      const challengesTableExists = await this.checkTableExists('challenges');
      if (!challengesTableExists) {
        console.log('Creating challenges table...');
        await this.createChallengesTable();
      } else {
        console.log('Challenges table already exists');
      }
      
      // Vérifier si la table trades existe
      const tradesTableExists = await this.checkTableExists('trades');
      if (!tradesTableExists) {
        console.log('Creating trades table...');
        await this.createTradesTable();
      } else {
        console.log('Trades table already exists');
      }
      
      // Vérifier si la table user_sessions existe
      const userSessionsTableExists = await this.checkTableExists('user_sessions');
      if (!userSessionsTableExists) {
        console.log('Creating user_sessions table...');
        await this.createUserSessionsTable();
      } else {
        console.log('User_sessions table already exists');
      }
      
      // Vérifier si la table challenge_history existe
      const challengeHistoryTableExists = await this.checkTableExists('challenge_history');
      if (!challengeHistoryTableExists) {
        console.log('Creating challenge_history table...');
        await this.createChallengeHistoryTable();
      } else {
        console.log('Challenge_history table already exists');
      }
      
      // Vérifier si la table user_preferences existe
      const userPreferencesTableExists = await this.checkTableExists('user_preferences');
      if (!userPreferencesTableExists) {
        console.log('Creating user_preferences table...');
        await this.createUserPreferencesTable();
      } else {
        console.log('User_preferences table already exists');
      }
      
      // Vérifier si la table user_achievements existe
      const userAchievementsTableExists = await this.checkTableExists('user_achievements');
      if (!userAchievementsTableExists) {
        console.log('Creating user_achievements table...');
        await this.createUserAchievementsTable();
      } else {
        console.log('User_achievements table already exists');
      }
      
      console.log('Database initialization completed.');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  
  private static async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const [rows] = await dbConfig.execute(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
        [tableName]
      );
      return Array.isArray(rows) && rows.length > 0;
    } catch (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
  }
  
  private static async createUsersTable(): Promise<void> {
    const query = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await dbConfig.execute(query);
  }
  
  private static async createChallengesTable(): Promise<void> {
    const query = `
      CREATE TABLE challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        initial_balance DECIMAL(15,2) NOT NULL,
        current_balance DECIMAL(15,2) NOT NULL,
        status ENUM('active', 'passed', 'failed') DEFAULT 'active',
        max_daily_loss DECIMAL(15,2) NOT NULL,
        max_total_loss DECIMAL(15,2) NOT NULL,
        profit_target DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await dbConfig.execute(query);
  }
  
  private static async createTradesTable(): Promise<void> {
    const query = `
      CREATE TABLE trades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        type ENUM('BUY', 'SELL') NOT NULL,
        price DECIMAL(15,5) NOT NULL,
        quantity INT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        pnl DECIMAL(15,2) DEFAULT 0.00,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      )
    `;
    await dbConfig.execute(query);
  }
  
  private static async createUserSessionsTable(): Promise<void> {
    const query = `
      CREATE TABLE user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await dbConfig.execute(query);
  }
  
  private static async createChallengeHistoryTable(): Promise<void> {
    const query = `
      CREATE TABLE challenge_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        initial_balance DECIMAL(15,2) NOT NULL,
        final_balance DECIMAL(15,2) NOT NULL,
        status ENUM('passed', 'failed') NOT NULL,
        duration_days INT,
        profit_amount DECIMAL(15,2),
        profit_percentage DECIMAL(5,2),
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      )
    `;
    await dbConfig.execute(query);
  }
  
  private static async createUserPreferencesTable(): Promise<void> {
    const query = `
      CREATE TABLE user_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        language VARCHAR(10) DEFAULT 'fr',
        theme VARCHAR(20) DEFAULT 'dark',
        notifications_enabled BOOLEAN DEFAULT TRUE,
        risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await dbConfig.execute(query);
  }
  
  private static async createUserAchievementsTable(): Promise<void> {
    const query = `
      CREATE TABLE user_achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        achievement_type VARCHAR(100) NOT NULL,
        achievement_name VARCHAR(255) NOT NULL,
        description TEXT,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        progress_percentage INT DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await dbConfig.execute(query);
  }
}