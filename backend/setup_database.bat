@echo off
echo Setting up the database for TradeSense AI application...
echo.

REM Check if mysql command is available
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: MySQL command line tool is not found in your system PATH.
    echo Please make sure MySQL is installed and the bin directory is added to your PATH.
    echo.
    echo Typical MySQL installation paths:
    echo - Windows: C:\Program Files\MySQL\MySQL Server 8.0\bin
    echo - Or check your MySQL installation directory for the bin folder
    pause
    exit /b 1
)

echo Creating database and tables...
echo.

REM Execute MySQL commands
mysql -h localhost -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS examen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% neq 0 (
    echo Error creating database
    pause
    exit /b 1
)

echo Database 'examen' created successfully!

echo Creating tables...
mysql -h localhost -u root -p123456 examen -e "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    initial_balance DECIMAL(15, 2) NOT NULL,
    current_balance DECIMAL(15, 2) NOT NULL,
    profit_target DECIMAL(15, 2) NOT NULL,
    max_total_loss DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    type ENUM('BUY', 'SELL') NOT NULL,
    price DECIMAL(15, 6) NOT NULL,
    quantity DECIMAL(15, 6) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_challenge_user ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_user ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_challenge ON trades(challenge_id);

INSERT IGNORE INTO users (username, email, password, role) VALUES 
('admin_user', 'admin@example.com', 'password123', 'ADMIN'),
('super_admin_user', 'superadmin@example.com', 'password123', 'SUPER_ADMIN'),
('john_doe', 'john@example.com', 'password123', 'USER');
"

if %errorlevel% equ 0 (
    echo.
    echo Database setup completed successfully!
    echo Database: examen
    echo Tables created: users, challenges, trades
    echo Sample data inserted for testing
    echo.
    echo You can now see these tables in MySQL Workbench under the 'examen' database.
) else (
    echo Error creating tables
)

pause