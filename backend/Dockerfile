# backend/Dockerfile
FROM node:20-alpine

# Installation de nest cli globalement
RUN npm install -g @nestjs/cli

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code
COPY . .

# Port exposé par NestJS par défaut
EXPOSE 4000

# Commande pour lancer en mode développement avec auto-reload
CMD ["npm", "run", "start:dev"]