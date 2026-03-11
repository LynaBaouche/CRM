# 🚀 Veloria CRM - Plateforme de Gestion Commerciale

**Veloria CRM** est une application web moderne de gestion de la relation client (CRM). Développée pour répondre aux besoins d'une équipe commerciale dynamique, cette plateforme centralise la gestion des prospects, le suivi des ventes, l'envoi de campagnes marketing et l'administration de l'équipe.

🔗 **Lien du projet en ligne  :** [https://veloria-crm.vercel.app](https://crm-veloria.vercel.app/)

---

## 🏢 Contexte de l'entreprise (Veloria)
**Veloria** est une entreprise B2B/B2C spécialisé dans le développement de sites webe et offre également des formations liées au développement web qui est  en pleine croissance. Face à l'augmentation de son volume d'affaires, l'équipe commerciale avait besoin d'un outil sur-mesure, rapide et intuitif pour remplacer des processus manuels obsolètes. 

**L'objectif de ce CRM :**
- **Centraliser** la base de données clients.
- **Accélérer** la conversion des prospects via un pipeline visuel.
- **Automatiser** la communication avec des campagnes d'emails groupés.
- **Sécuriser** les accès avec une gestion fine des rôles (Standard vs Administrateur).

---

## ✨ Fonctionnalités Clés

* 📊 **Tableau de Bord (Dashboard) :** Suivi des indicateurs clés de performance (KPIs) en temps réel.
* 👥 **Gestion des Contacts :** Ajout, modification et suivi de l'historique des prospects.
* 📈 **Pipeline de Ventes :** Suivi de l'état d'avancement des négociations (Nouveau, En cours, Conclu, Perdu).
* 📣 **Campagnes Marketing :** Création et envoi groupé d'emails automatisés (via l'API Brevo) avec suivi du taux d'ouverture.
* 🛡️ **Gestion d'Équipe & Rôles :** Espace collaboratif avec un système de demande de droits Administrateur.
* 🔔 **Système de Notifications :** Alertes internes en temps réel lors de l'attribution de nouveaux droits.
* ⚙️ **Paramètres Profil :** Gestion des informations personnelles et des préférences utilisateurs (Mode Sombre, alertes).

---

## 🛠️ Stack Technique

Ce projet a été développé avec des technologies modernes et robustes :

**Frontend :**
* **Framework :** Next.js (App Router) / React
* **Stylisation :** Tailwind CSS
* **Icônes :** Lucide React
* **Hébergement :** Vercel

**Backend :**
* **Framework :** NestJS (TypeScript)
* **ORM :** Prisma
* **Base de données :** PostgreSQL (Hébergée sur le cloud Neon)
* **Service d'Emailing :** Brevo API

---

## 🚀 Installation et Lancement en local

Si vous souhaitez faire tourner le projet sur votre propre machine, voici les étapes à suivre.

### 1. Cloner le projet
```bash
git clone [https://github.com/LynaBaouche/CRM.git](https://github.com/LynaBaouche/CRM.git)
cd CRM
