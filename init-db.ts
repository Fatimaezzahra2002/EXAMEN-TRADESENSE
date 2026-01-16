import { DbSetup } from './services/dbSetup.js'; // Ajout de l'extension .js

// Initialiser la base de données
console.log('Initializing database...');
DbSetup.initializeTables()
  .then(() => {
    console.log('Database initialized successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });