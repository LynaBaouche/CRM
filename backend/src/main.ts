import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Autoriser Next.js à venir lire les données
  app.enableCors({
    origin: 'http://localhost:3000', // front
    credentials: true,
  });

  // 2. On lance NestJS sur le port 3001
  await app.listen(3001);
  console.log('🚀 Backend prêt sur http://localhost:3001');
}
bootstrap();