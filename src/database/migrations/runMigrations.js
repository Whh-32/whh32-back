require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log('Connected successfully!');

    const migrationsDir = __dirname;
    const files = await fs.readdir(migrationsDir);
    
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${sqlFiles.length} migration file(s)`);

    await client.query('BEGIN');

    for (const file of sqlFiles) {
      console.log(`\nRunning migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sqlScript = await fs.readFile(filePath, 'utf8');
      
      await client.query(sqlScript);
      console.log(`✓ Migration ${file} completed successfully`);
    }

    await client.query('COMMIT');
    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
    console.log('\nDatabase connection closed');
  }
}

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
