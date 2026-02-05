const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function migrate() {
    const dbUrl = "postgresql://postgres:qujpSKt0rxU8ZmRQ@db.mzlmnnvbfwnykdcsvjjw.supabase.co:5432/postgres";

    if (!dbUrl) {
        console.error('❌ Error: DATABASE_URL is missing in .env.local');
        console.log('Please add your Supabase connection string to .env.local:');
        console.log('DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"');
        console.log('(You can find this in Supabase Dashboard -> Project Settings -> Database -> Connection string)');
        process.exit(1);
    }

    const client = new Client({
        connectionString: dbUrl,
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('✅ Connected.');

        const sqlPath = path.join(__dirname, 'setup-funnels.sql');
        console.log(`Reading SQL file from: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Running migration...');
        // Split commands if necessary, but client.query usually handles multiple statements if strictly formatted or depending on driver config.
        // pg driver executes multiple statements in a single query string just fine.
        await client.query(sql);

        console.log('✅ Migration completed successfully.');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
