import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import threading
import time
import os

# Fichier pour stocker les données de manière persistante
DATA_FILE = 'users_data.json'

# Charger les données depuis le fichier ou initialiser avec des données par défaut
def load_data():
    global users_db, challenges_db, trades_db, next_id
    
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                users_db = data.get('users', {})
                challenges_db = data.get('challenges', {})
                trades_db = data.get('trades', {})
                next_id = data.get('next_id', 1)
                
                # Convertir les clés en entiers
                users_db = {int(k): v for k, v in users_db.items()}
                challenges_db = {int(k): v for k, v in challenges_db.items()}
                trades_db = {int(k): v for k, v in trades_db.items()}
                
                print("Données chargées depuis le fichier")
        except Exception as e:
            print(f"Erreur lors du chargement des données: {e}")
            initialize_default_data()
    else:
        initialize_default_data()
        save_data()

def initialize_default_data():
    global users_db, challenges_db, trades_db, next_id
    users_db = {}
    challenges_db = {}
    trades_db = {}
    next_id = 1
    
    # Ajouter les utilisateurs de démonstration
    demo_users = [
        {
            'id': 1,
            'email': 'admin@example.com',
            'name': 'Admin User',
            'role': 'admin',
            'password': 'password',  # Note: In real app, this would be hashed
            'created_at': '2024-01-01T00:00:00',
            'updated_at': '2024-01-01T00:00:00'
        },
        {
            'id': 2,
            'email': 'superadmin@example.com',
            'name': 'Super Admin User',
            'role': 'super_admin',
            'password': 'password',
            'created_at': '2024-01-01T00:00:00',
            'updated_at': '2024-01-01T00:00:00'
        },
        {
            'id': 3,
            'email': 'user@example.com',
            'name': 'Regular User',
            'role': 'user',
            'password': 'password',
            'created_at': '2024-01-01T00:00:00',
            'updated_at': '2024-01-01T00:00:00'
        }
    ]
    
    for user in demo_users:
        user_id = user['id']
        users_db[user_id] = user
        
        # Créer des défis initiaux
        challenges_db[user_id] = [
            {
                'id': user_id * 10 + 1,
                'user_id': user_id,
                'initial_balance': 10000,
                'current_balance': 10000,
                'status': 'active',
                'max_daily_loss': 500,
                'max_total_loss': 1000,
                'profit_target': 1000,
                'created_at': '2024-01-01T00:00:00',
                'updated_at': '2024-01-01T00:00:00'
            }
        ]

def save_data():
    try:
        data = {
            'users': users_db,
            'challenges': challenges_db,
            'trades': trades_db,
            'next_id': next_id
        }
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        print("Données sauvegardées dans le fichier")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde des données: {e}")

# Charger les données au démarrage
load_data()

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
            try:
                user_id = int(path_parts[3])
                if len(path_parts) >= 5 and path_parts[4] == 'challenges':
                    self.handle_get_user_challenges(user_id)
                elif len(path_parts) >= 5 and path_parts[4] == 'trades':
                    self.handle_get_user_trades(user_id)
                else:
                    self.send_error(404)
            except ValueError:
                self.send_error(400)
        else:
            self.send_error(404)

    def do_PUT(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.split('/')
        
        if len(path_parts) >= 4 and path_parts[1] == 'api' and path_parts[2] == 'challenge':
            try:
                challenge_id = int(path_parts[3])
                self.handle_update_challenge(challenge_id)
            except ValueError:
                # Handle non-numeric challenge IDs gracefully
                self._set_headers()
                response = {'success': False, 'error': 'Invalid challenge ID'}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_error(404)

    def handle_login(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        email = data.get('email')
        password = data.get('password')
        
        # Vérifier dans la base de données
        user_found = None
        for user in users_db.values():
            if user['email'] == email and user.get('password') == password:
                user_found = user
                break
        
        if user_found:
            user_data = {
                'id': user_found['id'],
                'email': user_found['email'],
                'name': user_found['name'],
                'role': user_found['role'],
                'created_at': user_found['created_at'],
                'updated_at': user_found['updated_at']
            }
            
            # Créer des défis initiaux si nécessaire
            user_id = user_data['id']
            if user_id not in challenges_db:
                challenges_db[user_id] = [
                    {
                        'id': user_id * 10 + 1,
                        'user_id': user_id,
                        'initial_balance': 10000,
                        'current_balance': 10000,
                        'status': 'active',
                        'max_daily_loss': 500,
                        'max_total_loss': 1000,
                        'profit_target': 1000,
                        'created_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
                        'updated_at': time.strftime('%Y-%m-%dT%H:%M:%S')
                    }
                ]
                save_data()
            
            print(f"Connexion réussie pour l'utilisateur: {user_data['email']}")
            self._set_headers()
            response = {'success': True, 'user': user_data}
            self.wfile.write(json.dumps(response).encode())
        else:
            print(f"Tentative de connexion échouée pour: {email}")
            self._set_headers()
            response = {'success': False, 'error': 'Email ou mot de passe invalide'}
            self.wfile.write(json.dumps(response).encode())

    def handle_register(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        # Validation des données
        if not name or not email or not password:
            self._set_headers()
            response = {'success': False, 'error': 'Tous les champs sont requis'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Vérifier si l'email existe déjà
        if any(user['email'] == email for user in users_db.values()):
            self._set_headers()
            response = {'success': False, 'error': 'Email déjà utilisé'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Créer un nouvel utilisateur
        global next_id
        user_id = next_id
        next_id += 1
        
        user_data = {
            'id': user_id,
            'email': email,
            'name': name,
            'role': 'user',
            'password': password,  # Note: In real app, this would be hashed
            'created_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
            'updated_at': time.strftime('%Y-%m-%dT%H:%M:%S')
        }
        
        users_db[user_id] = user_data
        print(f"Nouvel utilisateur enregistré: {name} ({email}) avec ID: {user_id}")
        
        # Créer des défis initiaux
        challenge_id = user_id * 10 + 1
        challenges_db[user_id] = [
            {
                'id': challenge_id,
                'user_id': user_id,
                'initial_balance': 10000,
                'current_balance': 10000,
                'status': 'active',
                'max_daily_loss': 500,
                'max_total_loss': 1000,
                'profit_target': 1000,
                'created_at': time.strftime('%Y-%m-%dT%H:%M:%S'),
                'updated_at': time.strftime('%Y-%m-%dT%H:%M:%S')
            }
        ]
        
        # Sauvegarder les données
        save_data()
        
        self._set_headers()
        response = {
            'success': True, 
            'userId': user_id,
            'user': {
                'id': user_id,
                'email': email,
                'name': name,
                'role': 'user',
                'created_at': user_data['created_at'],
                'updated_at': user_data['updated_at']
            },
            'message': 'Utilisateur enregistré avec succès'
        }
        self.wfile.write(json.dumps(response).encode())

    def handle_get_user_challenges(self, user_id):
        challenges = challenges_db.get(user_id, [])
        
        self._set_headers()
        self.wfile.write(json.dumps(challenges).encode())

    def handle_get_user_trades(self, user_id):
        trades = []
        for trade_list in trades_db.values():
            trades.extend([t for t in trade_list if t['user_id'] == user_id])
        
        self._set_headers()
        self.wfile.write(json.dumps(trades).encode())

    def handle_update_challenge(self, challenge_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Trouver et mettre à jour le défi
        updated = False
        for user_challenges in challenges_db.values():
            for challenge in user_challenges:
                if challenge['id'] == challenge_id:
                    for key, value in data.items():
                        if key == 'initialBalance':
                            challenge['initial_balance'] = value
                        elif key == 'currentBalance':
                            challenge['current_balance'] = value
                        elif key == 'status':
                            challenge['status'] = value
                        elif key == 'maxDailyLoss':
                            challenge['max_daily_loss'] = value
                        elif key == 'maxTotalLoss':
                            challenge['max_total_loss'] = value
                        elif key == 'profitTarget':
                            challenge['profit_target'] = value
                    
                    challenge['updated_at'] = time.strftime('%Y-%m-%dT%H:%M:%S')
                    updated = True
                    break
            if updated:
                break
        
        if updated:
            save_data()
        
        self._set_headers()
        response = {'success': updated}
        self.wfile.write(json.dumps(response).encode())

    def handle_add_trade(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        global next_id
        trade_id = next_id
        next_id += 1
        
        trade_data = {
            'id': trade_id,
            'user_id': data.get('userId'),
            'challenge_id': data.get('challengeId'),
            'symbol': data.get('symbol'),
            'type': data.get('type'),
            'price': data.get('price'),
            'quantity': data.get('quantity'),
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%S'),
            'pnl': data.get('pnl', 0)
        }
        
        # Stocker le trade
        user_id = data.get('userId')
        if user_id not in trades_db:
            trades_db[user_id] = []
        trades_db[user_id].append(trade_data)
        
        # Sauvegarder les données
        save_data()
        
        self._set_headers()
        response = {'success': True}
        self.wfile.write(json.dumps(response).encode())

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Serveur backend démarré sur le port {port}')
    print('Serveur en cours d\'exécution...')
    print('Appuyez sur Ctrl+C pour arrêter le serveur')
    httpd.serve_forever()

if __name__ == '__main__':
    run()