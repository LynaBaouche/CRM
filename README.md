# 🚀 Veloria CRM - Plateforme de Gestion Commerciale

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**Veloria CRM** est une application web moderne de gestion de la relation client (CRM). Développée pour répondre aux besoins d'une équipe commerciale dynamique, cette plateforme centralise la gestion des prospects, le suivi des ventes, l'envoi de campagnes marketing et l'administration de l'équipe.

🔗 **Lien du projet en ligne :** ([https://veloria-crm.vercel.app](https://crm-veloria-f.vercel.app/))

---

## 🏢 Contexte de l'entreprise (Veloria)
**Veloria** est une entreprise B2B/B2C en pleine croissance, spécialisée dans le développement de sites web et la formation technique. Face à l'augmentation de son volume d'affaires, l'équipe commerciale avait besoin d'un outil sur-mesure, rapide et intuitif pour remplacer des processus manuels obsolètes.

**L'objectif de ce CRM :**
- **Centraliser** la base de données clients et entreprises.
- **Accélérer** la conversion des prospects via un pipeline visuel.
- **Automatiser** la communication avec des campagnes d'emails groupés (Brevo API).
- **Sécuriser** les accès avec une gestion fine des rôles (Standard vs Administrateur).

---

## ✨ Fonctionnalités Clés
* 📊 **Tableau de Bord (Dashboard) :** Suivi des indicateurs clés de performance (KPIs) en temps réel.
* 👥 **Gestion des Contacts & Entreprises :** Centralisation des données et historique des prospects.
* 📈 **Pipeline de Ventes :** Suivi visuel de l'avancement des négociations (Drag & Drop).
* 📣 **Campagnes Marketing :** Création et envoi automatisé d'emails via l'API Brevo.
* 🛡️ **Gestion d'Équipe :** Système de rôles et de notifications internes pour l'administration.
* ⚙️ **Paramètres :** Gestion du profil utilisateur et préférences d'interface.

---

## 🛠️ Stack Technique
* **Frontend :** Next.js (App Router), React, Tailwind CSS, Lucide Icons.
* **Backend :** NestJS (Node.js), TypeScript.
* **Base de Données :** PostgreSQL (Hébergé sur Neon) avec Prisma ORM.
* **Conteneurisation :** Docker & Docker Compose pour un environnement de développement reproductible.
* **Services :** Brevo API (Emailing), JWT (Authentification).

---

## 🚀 Installation et Lancement

### 1. Cloner le projet
```bash
git clone [https://github.com/LynaBaouche/CRM.git](https://github.com/LynaBaouche/CRM.git)
cd CRM
```
## 2. Lancement rapide avec Docker (Recommandé)

Le projet inclut une configuration Docker Compose pour lancer l'ensemble de la stack en une commande :

```bash
docker-compose up --build
```
Le frontend sera accessible sur **http://localhost:3000** et le backend sur **http://localhost:3001**.
---

## 3. Lancement manuel

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
