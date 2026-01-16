const mysql = require('mysql2/promise');

async function checkTables() {
  let connection = null;
  
  try {
    console.log('Connexion à la base de données...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'examen'
    });
    
    console.log('Sélection des tables dans la base de données examen...');
    
    const [rows] = await connection.query('SHOW TABLES;');
    
    console.log('Tables trouvées dans la base de données "examen":');
    rows.forEach(row => {
      console.log('- ' + Object.values(row)[0]);
    });
    
    // Afficher le nombre de tables
    console.log('\nNombre total de tables: ' + rows.length);
    
    if (rows.length > 0) {
      console.log('\nDétails des tables:');
      for (const row of rows) {
        const tableName = Object.values(row)[0];
        console.log(`\nStructure de la table "${tableName}":`);
        const [structure] = await connection.query(`DESCRIBE ${tableName};`);
        structure.forEach(column => {
          console.log(`  - ${column.Field} (${column.Type}) ${column.Null} ${column.Key} ${column.Default} ${column.Extra}`);
        });
      }
    }
    
    await connection.end();
    console.log('\nConnexion fermée.');
    
  } catch (error) {
    console.error('Erreur:', error);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Erreur lors de la fermeture de la connexion:', closeError);
      }
    }
  }
}

checkTables();