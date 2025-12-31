import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { User, Admin, Host, Customer, Doctor, Category, HouseRent, HostelRent, Blog } from './entities';

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: [User, Admin, Host, Customer, Doctor, Category, HouseRent, HostelRent, Blog],
  debug: process.env.NODE_ENV !== 'production',
  driverOptions: {
    connection: {
      ssl: { rejectUnauthorized: false }
    }
  },
  extensions: [Migrator, EntityGenerator, SeedManager],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
});