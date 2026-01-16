from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes cross-origin

# Configuration de la base de données
DB_CONFIG = {
    'host': 'localhost',
    'database': 'examen',
    'user': 'root',
    'password': '123456'
}

def get_db_connection():
    """Obtenir une connexion à la base de données"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Erreur de connexion à MySQL: {e}")
        return None

def initialize_tables():
    """Initialiser les tables de la base de données si elles n'existent pas"""
    try:
        connection = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = connection.cursor()
        
        # Sélectionner la base de données
        cursor.execute(f"USE {DB_CONFIG['database']};")
        
        # Créer la table users si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        """)
        
        # Créer la table challenges si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS challenges (
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
            );
        """)
        
        # Créer la table trades si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trades (
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
            );
        """)
        
        # Créer la table user_sessions si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)
        
        # Créer la table challenge_history si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS challenge_history (
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
            );
        """)
        
        # Créer la table user_preferences si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                language VARCHAR(10) DEFAULT 'fr',
                theme VARCHAR(20) DEFAULT 'dark',
                notifications_enabled BOOLEAN DEFAULT TRUE,
                risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)
        
        # Créer la table user_achievements si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_achievements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                achievement_type VARCHAR(100) NOT NULL,
                achievement_name VARCHAR(255) NOT NULL,
                description TEXT,
                earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                progress_percentage INT DEFAULT 0,
                is_completed BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)
        
        connection.commit()
        cursor.close()
        connection.close()
        print("Tables initialisées avec succès")
    except Error as e:
        print(f"Erreur lors de l'initialisation des tables: {e}")

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        connection = get_db_connection()
        if connection is None:
            return jsonify({'success': False, 'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, email, name, password_hash, role, created_at, updated_at FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        
        if user:
            # Vérifier le mot de passe
            if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                # Mettre à jour updated_at
                update_query = "UPDATE users SET updated_at = NOW() WHERE id = %s"
                cursor.execute(update_query, (user['id'],))
                connection.commit()
                
                # Récupérer l'utilisateur mis à jour
                cursor.execute(query, (email,))
                updated_user = cursor.fetchone()
                
                # Formater les dates
                updated_user['created_at'] = updated_user['created_at'].isoformat() if updated_user['created_at'] else None
                updated_user['updated_at'] = updated_user['updated_at'].isoformat() if updated_user['updated_at'] else None
                
                # Retirer le hash du mot de passe pour le frontend
                del updated_user['password_hash']
                
                cursor.close()
                connection.close()
                
                return jsonify({
                    'success': True,
                    'user': updated_user
                })
            else:
                cursor.close()
                connection.close()
                return jsonify({'success': False, 'error': 'Mot de passe invalide'}), 401
        else:
            cursor.close()
            connection.close()
            return jsonify({'success': False, 'error': 'Email invalide'}), 401
            
    except Exception as e:
        print(f"Erreur de login: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        connection = get_db_connection()
        if connection is None:
            return jsonify({'success': False, 'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor()
        
        # Vérifier si l'email existe déjà
        check_query = "SELECT id FROM users WHERE email = %s"
        cursor.execute(check_query, (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            connection.close()
            return jsonify({'success': False, 'error': 'Email déjà utilisé'}), 400
        
        # Hacher le mot de passe
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insérer le nouvel utilisateur
        insert_query = """
            INSERT INTO users (email, name, password_hash, role, created_at, updated_at) 
            VALUES (%s, %s, %s, 'user', NOW(), NOW())
        """
        cursor.execute(insert_query, (email, name, hashed_password))
        user_id = cursor.lastrowid
        connection.commit()
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'userId': user_id
        })
        
    except Exception as e:
        print(f"Erreur d'inscription: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

@app.route('/api/user/<int:user_id>/challenges', methods=['POST'])
def create_challenge(user_id):
    try:
        data = request.json
        initial_balance = data.get('initialBalance')
        current_balance = data.get('currentBalance', initial_balance)
        status = data.get('status', 'active')
        max_daily_loss = data.get('maxDailyLoss')
        max_total_loss = data.get('maxTotalLoss')
        profit_target = data.get('profitTarget')
        
        connection = get_db_connection()
        if connection is None:
            return jsonify({'success': False, 'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor(dictionary=True)
        
        insert_query = """
            INSERT INTO challenges (user_id, initial_balance, current_balance, status, 
                                    max_daily_loss, max_total_loss, profit_target, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """
        cursor.execute(insert_query, (user_id, initial_balance, current_balance, status, max_daily_loss, max_total_loss, profit_target))
        challenge_id = cursor.lastrowid
        connection.commit()
        
        select_query = """
            SELECT id, user_id, initial_balance, current_balance, status, 
                   max_daily_loss, max_total_loss, profit_target, created_at, updated_at
            FROM challenges
            WHERE id = %s
        """
        cursor.execute(select_query, (challenge_id,))
        challenge = cursor.fetchone()
        
        if challenge:
            challenge['created_at'] = challenge['created_at'].isoformat() if challenge['created_at'] else None
            challenge['updated_at'] = challenge['updated_at'].isoformat() if challenge['updated_at'] else None
        
        cursor.close()
        connection.close()
        
        return jsonify({'success': True, 'challenge': challenge})
        
    except Exception as e:
        print(f"Erreur de création de défi: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

@app.route('/api/user/<int:user_id>/challenges', methods=['GET'])
def get_user_challenges(user_id):
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT id, user_id, initial_balance, current_balance, status, 
                   max_daily_loss, max_total_loss, profit_target, created_at, updated_at
            FROM challenges 
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        cursor.execute(query, (user_id,))
        challenges = cursor.fetchall()
        
        # Formater les dates
        for challenge in challenges:
            challenge['created_at'] = challenge['created_at'].isoformat() if challenge['created_at'] else None
            challenge['updated_at'] = challenge['updated_at'].isoformat() if challenge['updated_at'] else None
        
        cursor.close()
        connection.close()
        
        return jsonify(challenges)
        
    except Exception as e:
        print(f"Erreur de récupération des défis: {e}")
        return jsonify({'error': 'Erreur serveur'}), 500

@app.route('/api/user/<int:user_id>/trades', methods=['GET'])
def get_user_trades(user_id):
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT id, user_id, challenge_id, symbol, type, price, quantity, timestamp, pnl
            FROM trades
            WHERE user_id = %s
            ORDER BY timestamp DESC
        """
        cursor.execute(query, (user_id,))
        trades = cursor.fetchall()
        
        # Formater les dates
        for trade in trades:
            trade['timestamp'] = trade['timestamp'].isoformat() if trade['timestamp'] else None
        
        cursor.close()
        connection.close()
        
        return jsonify(trades)
        
    except Exception as e:
        print(f"Erreur de récupération des trades: {e}")
        return jsonify({'error': 'Erreur serveur'}), 500

@app.route('/api/challenge/<int:challenge_id>', methods=['PUT'])
def update_challenge(challenge_id):
    try:
        data = request.json
        updates = {k: v for k, v in data.items() if k != 'id'}
        
        if not updates:
            return jsonify({'success': False, 'error': 'Aucune donnée à mettre à jour'}), 400
        
        connection = get_db_connection()
        if connection is None:
            return jsonify({'success': False, 'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor()
        
        # Construire la requête de mise à jour
        set_clause = []
        values = []
        for field, value in updates.items():
            if field == 'initialBalance':
                db_field = 'initial_balance'
            elif field == 'currentBalance':
                db_field = 'current_balance'
            elif field == 'maxDailyLoss':
                db_field = 'max_daily_loss'
            elif field == 'maxTotalLoss':
                db_field = 'max_total_loss'
            elif field == 'profitTarget':
                db_field = 'profit_target'
            else:
                db_field = field
            set_clause.append(f"{db_field} = %s")
            values.append(value)
        
        values.append(challenge_id)
        query = f"UPDATE challenges SET {', '.join(set_clause)} WHERE id = %s"
        
        cursor.execute(query, values)
        connection.commit()
        
        success = cursor.rowcount > 0
        
        cursor.close()
        connection.close()
        
        return jsonify({'success': success})
        
    except Exception as e:
        print(f"Erreur de mise à jour du défi: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

@app.route('/api/trade', methods=['POST'])
def add_trade():
    try:
        data = request.json
        user_id = data.get('userId')
        challenge_id = data.get('challengeId')
        symbol = data.get('symbol')
        trade_type = data.get('type')
        price = data.get('price')
        quantity = data.get('quantity')
        pnl = data.get('pnl', 0)
        
        connection = get_db_connection()
        if connection is None:
            return jsonify({'success': False, 'error': 'Impossible de se connecter à la base de données'}), 500
            
        cursor = connection.cursor()
        
        query = """
            INSERT INTO trades (user_id, challenge_id, symbol, type, price, quantity, pnl)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, challenge_id, symbol, trade_type, price, quantity, pnl))
        connection.commit()
        
        success = cursor.rowcount > 0
        
        cursor.close()
        connection.close()
        
        return jsonify({'success': success})
        
    except Exception as e:
        print(f"Erreur d'ajout de trade: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

if __name__ == '__main__':
    # Initialiser les tables au démarrage
    initialize_tables()
    # Démarrer le serveur
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
