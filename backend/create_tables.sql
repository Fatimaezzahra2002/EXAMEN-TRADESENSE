-- Create the examen database if it doesn't exist
CREATE DATABASE IF NOT EXISTS examen;
USE examen;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table
CREATE TABLE challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    initial_balance DECIMAL(15, 2) NOT NULL,
    current_balance DECIMAL(15, 2) NOT NULL,
    profit_target DECIMAL(15, 2) NOT NULL,
    max_total_loss DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create trades table
CREATE TABLE trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    type ENUM('BUY', 'SELL') NOT NULL,
    price DECIMAL(15, 6) NOT NULL,
    quantity DECIMAL(15, 6) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
);

-- Insert sample data for testing
INSERT INTO users (username, email, password, role) VALUES
('admin_user', 'admin@example.com', 'hashed_password_123', 'ADMIN'),
('super_admin_user', 'superadmin@example.com', 'hashed_password_123', 'SUPER_ADMIN'),
('john_doe', 'john@example.com', 'hashed_password_123', 'USER'),
('jane_smith', 'jane@example.com', 'hashed_password_123', 'USER');

-- Insert sample challenges
INSERT INTO challenges (name, user_id, initial_balance, current_balance, profit_target, max_total_loss, status) VALUES
('Demo Challenge 1', 3, 10000.00, 10000.00, 1000.00, 500.00, 'ACTIVE'),
('Demo Challenge 2', 4, 5000.00, 5000.00, 500.00, 250.00, 'ACTIVE'),
('Completed Challenge', 3, 10000.00, 11000.00, 1000.00, 500.00, 'PASSED'),
('Failed Challenge', 4, 5000.00, 4500.00, 500.00, 500.00, 'FAILED');

-- Insert sample trades
INSERT INTO trades (user_id, challenge_id, symbol, type, price, quantity) VALUES
(3, 1, 'BTC-USD', 'BUY', 65000.00, 0.1),
(3, 1, 'ETH-USD', 'SELL', 3200.00, 0.2),
(4, 2, 'AAPL', 'BUY', 185.50, 10),
(3, 1, 'MSFT', 'BUY', 420.75, 5);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_challenge_user ON challenges(user_id);
CREATE INDEX idx_trade_user ON trades(user_id);
CREATE INDEX idx_trade_challenge ON trades(challenge_id);
CREATE INDEX idx_trade_timestamp ON trades(timestamp);

-- View to get user details with their challenges
CREATE VIEW user_challenges_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.role,
    c.id as challenge_id,
    c.name as challenge_name,
    c.initial_balance,
    c.current_balance,
    c.status as challenge_status,
    c.created_at as challenge_created
FROM users u
LEFT JOIN challenges c ON u.id = c.user_id;

-- View to get challenge details with recent trades
CREATE VIEW challenge_trades_view AS
SELECT 
    c.id as challenge_id,
    c.name as challenge_name,
    u.username,
    t.id as trade_id,
    t.symbol,
    t.type,
    t.price,
    t.quantity,
    t.timestamp
FROM challenges c
JOIN users u ON c.user_id = u.id
LEFT JOIN trades t ON c.id = t.challenge_id
ORDER BY t.timestamp DESC;