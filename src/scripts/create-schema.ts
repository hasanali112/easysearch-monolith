import 'dotenv/config';
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config.js';

async function createSchema() {
  console.log('🔧 Connecting to database...');
  const orm = await MikroORM.init(config);

  try {
    const generator = orm.getSchemaGenerator();
    
    console.log('📋 Dropping existing schema (if any)...');
    await generator.dropSchema();
    
    console.log('✨ Creating new schema...');
    await generator.createSchema();
    
    console.log('✅ Schema created successfully!');
    console.log('\n📊 Created tables:');
    console.log('  - user');
    console.log('  - admin');
    console.log('  - host');
    console.log('  - customer');
    console.log('  - doctor');
    console.log('  - category');
    console.log('  - house_rent');
    console.log('  - hostel_rent');
    console.log('  - blog');
  } catch (error) {
    console.error('❌ Error creating schema:', error);
    throw error;
  } finally {
    await orm.close(true);
    console.log('\n🔌 Database connection closed');
  }
}

createSchema()
  .then(() => {
    console.log('\n✅ Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  });
