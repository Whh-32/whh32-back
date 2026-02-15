require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const sql = require('mssql');
const logger = require('../../utils/logger');

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
};

async function runMigrations() {
  let pool;
  
  try {
    console.log('Connecting to database...');
    pool = await sql.connect(config);
    console.log('Connected successfully!');

    const migrationsDir = __dirname;
    const files = await fs.readdir(migrationsDir);
    
    // Filter and sort SQL files
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${sqlFiles.length} migration file(s)`);

    for (const file of sqlFiles) {
      console.log(`\nRunning migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql_script = await fs.readFile(filePath, 'utf8');
      
      await pool.request().query(sql_script);
      console.log(`✓ Migration ${file} completed successfully`);
    }

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run migrations
runMigrations()
  .then(() => {
    console.log('\n=== Migration process completed ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n=== Migration process failed ===');
    console.error(error);
    process.exit(1);
  });
