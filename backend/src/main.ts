import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Autoriser Next.js (Local ET Production) à venir lire les données
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Utiliser le port fourni par Vercel, sinon le port 3001 en local
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend prêt sur le port ${port}`);
}
bootstrap();