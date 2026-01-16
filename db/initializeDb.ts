import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

async function initializeDatabase() {
  let connection: mysql.Connection | null = null;
  
  try {
    console.log('Connexion à la base de données...');
    
    // Se connecter sans spécifier la base de données
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456"
    });
    
    console.log('Connexion réussie. Création de la base de données si elle n\'existe pas...');
    
    // Créer la base de données si elle n'existe pas
    await connection.query('CREATE DATABASE IF NOT EXISTS examen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    
    // Utiliser la base de données
    await connection.query('USE examen;');
    
    console.log('Base de données examen sélectionnée.');
    
    // Lire le fichier de schéma SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    
    console.log('Fichier de schéma lu. Exécution des requêtes...');
    
    // Exécuter les requêtes du schéma
    await connection.query(schemaSql);
    
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