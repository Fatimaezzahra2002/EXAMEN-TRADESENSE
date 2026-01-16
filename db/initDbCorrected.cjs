const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initializeDatabase() {
  let connection = null;
  
  try {
    console.log('Connexion à la base de données...');
    
    // Se connecter sans spécifier la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456'
    });
    
    console.log('Connexion réussie. Création de la base de données si elle n\'existe pas...');
    
    // Créer la base de données si elle n'existe pas
    await connection.query('CREATE DATABASE IF NOT EXISTS examen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    
    // Utiliser la base de données
    await connection.query('USE examen;');
    
    console.log('Base de données examen sélectionnée.');
    
    // Lire le fichier de schéma SQL
    const schemaSql = await fs.readFile('db/schema.sql', 'utf8');
    
    console.log('Fichier de schéma lu. Exécution des requêtes individuelles...');
    
    // Diviser les requêtes et les exécuter une par une
    const queries = schemaSql
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));
    
    for (const query of queries) {
      if (query.trim()) {
        console.log(`Exécution: ${query.substring(0, 60)}...`);
        await connection.query(query);
      }
    }
    
    console.log('Schéma de base de données créé avec succès !');
    
    // Fermer la connexion
    await connection.end();
    console.log('Connexion fermée.');
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    
    if (connection) {
      try {
        await connection.end();
        console.log('Connexion fermée suite à une erreur.');
      } catch (closeError) {
        console.error('Erreur lors de la fermeture de la connexion:', closeError);
      }
    }
  }
}

// Exécuter l'initialisation
initializeDatabase();