import dbConfig from '../config/dbConfig';

async function testConnection() {
  try {
    console.log('Tentative de connexion à la base de données...');
    
    // Test de connexion en exécutant une requête simple
    const connection = await dbConfig.getConnection();
    console.log('Connexion à la base de données réussie !');
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Résultat de la requête de test:', rows);
    
    connection.release();
    console.log('Connexion relâchée avec succès.');
    
    // Fermeture du pool de connexions
    await dbConfig.end();
    console.log('Pool de connexions fermé.');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  }
}

// Exécuter le test
testConnection();