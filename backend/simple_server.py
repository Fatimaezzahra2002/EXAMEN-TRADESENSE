import json
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import hashlib
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import cgi

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
        
        connection.commit()
        cursor.close()
        connection.close()
        print("Tables initialisées avec succès")
        return True
    except Error as e:
        print(f"Erreur lors de l'initialisation des tables: {e}")
        return False

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        if self.path == '/api/login':
            self.handle_login()
        elif self.path == '/api/register':
            self.handle_register()
        elif self.path == '/api/trade':
            self.handle_add_trade()
        else:
            self.send_error(404)

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.split('/')
        
        if len(path_parts) >= 4 and path_parts[1] == 'api' and path_parts[2] == 'user':
            user_id = int(path_parts[3])
            if len(path_parts) >= 5 and path_parts[4] == 'challenges':
                self.handle_get_user_challenges(user_id)
            elif len(path_parts) >= 5 and path_parts[4] == 'trades':
                self.handle_get_user_trades(user_id)
            else:
                self.send_error(404)
        else:
            self.send_error(404)

    def do_PUT(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.split('/')
        
        if len(path_parts) >= 4 and path_parts[1] == 'api' and path_parts[2] == 'challenge':
            challenge_id = int(path_parts[3])
            self.handle_update_challenge(challenge_id)
        else:
            self.send_error(404)

    def handle_login(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        email = data.get('email')
        password = data.get('password')
        
        connection = get_db_connection()
        if connection is None:
            self._set_headers()
            response = {'success': False, 'error': 'Impossible de se connecter à la base de données'}
            self.wfile.write(json.dumps(response).encode())
            return
            
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, email, name, password_hash, role, created_at, updated_at FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        
        if user:
            # Vérifier le mot de passe (simulé)
            if password == 'password':
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
                
                self._set_headers()
                response = {'success': True, 'user': updated_user}
                self.wfile.write(json.dumps(response).encode())
            else:
                cursor.close()
                connection.close()
                self._set_headers()
                response = {'success': False, 'error': 'Mot de passe invalide'}
                self.wfile.write(json.dumps(response).encode())
        else:
            cursor.close()
            connection.close()
            self._set_headers()
            response = {'success': False, 'error': 'Email invalide'}
            self.wfile.write(json.dumps(response).encode())

    def handle_register(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        connection = get_db_connection()
        if connection is None:
            self._set_headers()
            response = {'success': False, 'error': 'Impossible de se connecter à la base de données'}
            self.wfile.write(json.dumps(response).encode())
            return
            
        cursor = connection.cursor()
        
        # Vérifier si l'email existe déjà
        check_query = "SELECT id FROM users WHERE email = %s"
        cursor.execute(check_query, (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            connection.close()
            self._set_headers()
            response = {'success': False, 'error': 'Email déjà utilisé'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Insérer le nouvel utilisateur
        insert_query = """
            INSERT INTO users (email, name, password_hash, role, created_at, updated_at) 
            VALUES (%s, %s, %s, 'user', NOW(), NOW())
        """
        cursor.execute(insert_query, (email, name, 'hashed_password'))
        user_id = cursor.lastrowid
        connection.commit()
        
        cursor.close()
        connection.close()
        
        self._set_headers()
        response = {'success': True, 'userId': user_id}
        self.wfile.write(json.dumps(response).encode())

    def handle_get_user_challenges(self, user_id):
        connection = get_db_connection()
        if connection is None:
            self._set_headers()
            response = {'error': 'Impossible de se connecter à la base de données'}
            self.wfile.write(json.dumps(response).encode())
            return
            
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
        
        self._set_headers()
        self.wfile.write(json.dumps(challenges).encode())

    def handle_get_user_trades(self, user_id):
        connection = get_db_connection()
        if connection is None:
            self._set_headers()
            response = {'error': 'Impossible de se connecter à la base de données'}
            self.wfile.write(json.dumps(response).encode())
            return
            
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
        
        self._set_headers()
        self.wfile.write(json.dumps(trades).encode())

    def handle_update_challenge(self, challenge_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        updates = {k: v for k, v in data.items() if k != 'id'}
        
        if not updates:
            self._set_headers()
            response = {'success': False, 'error': 'Aucune donnée à mettre à jour'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        connection = get_db_connection()
        if connection is None:
            self._set_headers()
            response = {'success': False, 'error': 'Impossible de se connecter à la base de données'}
            self.wfile.write(json.dumps(response).encode())
            return
            
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
        
        self._set_headers()
        response = {'success': success}
        self.wfile.write(json.dumps(response).encode())

    def handle_add_trade(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        user_id = data.get('userId')
        challenge_id = data.get('challengeId')
        symbol = data.get('symbol')
        trade_type = data.get('type')
        price = data.get('price')
        quantity = data.get('quantity')
        pnl = data.get('pnl', 0)
        
        connection = get_db_connection()
        if connection is None:
            self._set_headers()
            response = {'success': False, 'error': 'Impossible de se connecter à la base de données'}
            self.wfile.write(json.dumps(response).encode())
            return
            
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
        
        self._set_headers()
        response = {'success': success}
        self.wfile.write(json.dumps(response).encode())

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Server démarré sur le port {port}')
    print('Appuyez sur Ctrl+C pour arrêter le serveur')
    httpd.serve_forever()

if __name__ == '__main__':
    # Initialiser les tables au démarrage
    if initialize_tables():
        # Démarrer le serveur
        run()
    else:
        print("Impossible d'initialiser la base de données. Vérifiez votre configuration MySQL.")