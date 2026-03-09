import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class AuthService {
  private prisma = new PrismaClient({ adapter });

  constructor(private jwtService: JwtService) {}

  // ✉️ EMAIL DE BIENVENUE CLASSIQUE
// ✉️ EMAIL DE BIENVENUE CLASSIQUE
private async sendWelcomeEmail(userEmail: string, firstName: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log("❌ ERREUR : La clé BREVO_API_KEY est introuvable dans le fichier .env !");
    return;
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        // ⚠️ ATTENTION : Cet email DOIT être celui avec lequel tu as créé ton compte Brevo !
        sender: { name: 'CRM Entreprise', email: 'baouchelyna@gmail.com' }, 
        to: [{ email: userEmail }],
        subject: 'Bienvenue sur votre nouveau CRM ! 🎉',
        htmlContent: `<h1>Bonjour ${firstName} !</h1><p>Votre compte a bien été créé.</p>`
      })
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log("✅ SUCCESS: Email de bienvenue envoyé à", userEmail);
    } else {
      console.error("❌ ERREUR BREVO (Bienvenue) :", data);
    }
  } catch (error) { console.error("Erreur réseau Brevo:", error); }
}

// 🚨 EMAIL D'ALERTE POUR L'ADMINISTRATEUR
private async sendAdminAlert(newUserEmail: string, firstName: string, lastName: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Alerte Sécurité CRM', email: 'baouchelyna@gmail.com' },
        to: [{ email: 'baouchelyna@gmail.com' }], 
        subject: '⚠️ Nouvelle demande accès Administrateur',
        htmlContent: `<h1>Demande d'accès Admin</h1>
                      <p>L'utilisateur <strong>${firstName} ${lastName}</strong> (${newUserEmail}) demande les droits d'Administrateur.</p>`
      })
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ SUCCESS: Alerte Admin envoyée à la Boss !");
    } else {
      console.error("❌ ERREUR BREVO (Alerte Admin) :", data);
    }
  } catch (error) { console.error(error); }
}

  // --- 1. INSCRIPTION (SIGNUP) MODIFIÉE ---
  async signup(email: string, pass: string, firstName: string, lastName: string, role: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new BadRequestException("Cet email est déjà utilisé !");

    const hashedPassword = await bcrypt.hash(pass, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, role },
    });

    // On envoie le mail de bienvenue à l'utilisateur
    await this.sendWelcomeEmail(user.email, user.firstName);

    // Si c'est un Admin, on prévient Lyna !
    if (role === 'admin') {
      await this.sendAdminAlert(user.email, user.firstName, user.lastName);
    }

    // Le badge inclut maintenant le Prénom et le Rôle !
    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role, firstName: user.firstName }) };
  }

  // --- 2. CONNEXION (LOGIN) ---
  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Email ou mot de passe incorrect");

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException("Email ou mot de passe incorrect");

    // Le badge inclut maintenant le Prénom et le Rôle !
    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role, firstName: user.firstName }) };
  }
}