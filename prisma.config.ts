import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Memaksa sistem membaca file .env
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
