import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Initialiser la connexion Postgres classique
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Créer l'adaptateur pour Prisma 7
const adapter = new PrismaPg(pool);

// 3. Donner l'adaptateur au client
const prisma = new PrismaClient({ adapter });

async function main() {
  // L'import dynamique de faker
  const { faker } = await import('@faker-js/faker');

  console.log('🌱 Début du remplissage de la base...');

  // 1. Créer 5 entreprises
  for (let i = 0; i < 5; i++) {
    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        industry: faker.company.buzzAdjective(),
        website: faker.internet.url(),
      },
    });

    // 2. Créer 3 contacts pour chaque entreprise
    for (let j = 0; j < 3; j++) {
      await prisma.contact.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          companyId: company.id,
        },
      });
    }
  }

  console.log('✅ Base de données Neon remplie avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // ⚠️ Très important pour ne pas bloquer le terminal à la fin
  });