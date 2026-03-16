import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Variable globale pour garder l'application en mémoire entre les requêtes sur Vercel
let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule);
    
    // Autoriser Next.js (Local ET Production) à venir lire les données
    cachedApp.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    await cachedApp.init();
  }
  // On récupère l'instance d'Express utilisée sous le capot par NestJS
  return cachedApp.getHttpAdapter().getInstance();
}

// --- CONFIGURATION VERCEL (Serverless) ---
// Vercel va appeler cette fonction à chaque requête HTTP
export default async function handler(req, res) {
  const expressApp = await bootstrap();
  return expressApp(req, res);
}

// --- CONFIGURATION LOCALE ---
// Si on n'est pas sur Vercel (développement local), on démarre le serveur normalement
if (!process.env.VERCEL) {
  async function startLocalServer() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend local prêt sur le port ${port}`);
  }
  startLocalServer();
}