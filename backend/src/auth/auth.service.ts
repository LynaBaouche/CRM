import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { sendBrevoEmail } from '../utils/mail.util'; 

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class AuthService {
  private prisma = new PrismaClient({ adapter });

  constructor(private jwtService: JwtService) {}

  // --- 1. INSCRIPTION (SIGNUP) MODIFIÉE ---
  async signup(email: string, pass: string, firstName: string, lastName: string, role: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new BadRequestException("Cet email est déjà utilisé !");

    // LOGIQUE SÉCURITÉ : Force le rôle "standard" si on demande "admin"
    let finalRole = role;
    const isRequestingAdmin = role === 'admin';
    if (isRequestingAdmin) {
      finalRole = 'standard'; 
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const user = await this.prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        firstName, 
        lastName, 
        role: finalRole,
        requestedAdmin: isRequestingAdmin // 👈 On sauvegarde la demande !
      },
    });

    // ✉️ ENVOI VIA NOTRE UTILS : Email de bienvenue
    const welcomeHtml = `
      <h2 style="color: #111827; margin-bottom: 16px;">Bonjour ${user.firstName} ! 👋</h2>
      <p>Votre compte a bien été créé sur Veloria CRM.</p>
      <p>Vous pouvez dès à présent vous connecter et commencer à gérer vos opportunités et vos contacts.</p>
      <p>À très vite sur votre espace !</p>
    `;
    await sendBrevoEmail(user.email, user.firstName, 'Bienvenue sur Veloria, votre nouveau CRM ! 🎉', welcomeHtml);

    // 🚨 ENVOI VIA NOTRE UTILS : Alerte Admin
    if (isRequestingAdmin) {
      const alertHtml = `
        <h2 style="color: #E11D48; margin-bottom: 16px;">Demande d'accès Administrateur</h2>
        <p>L'utilisateur <strong>${user.firstName} ${user.lastName}</strong> (${user.email}) vient de créer un compte et a demandé les droits <strong>Administrateur</strong>.</p>
        <div style="background-color: #FFF1F2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E11D48;">
          <p style="margin: 0; color: #9F1239; font-size: 14px;"><strong>Sécurité :</strong> Par mesure de précaution, ce compte a été restreint au rôle <strong>Standard</strong> par défaut.</p>
        </div>
        <p>Veuillez vous connecter à l'interface d'administration pour valider cette demande.</p>
      `;
      // On envoie à toi (l'admin principal)
      await sendBrevoEmail('baouchelyna@gmail.com', 'Admin', '⚠️ Nouvelle demande accès Administrateur', alertHtml, 'Veloria - Sécurité');
    }

    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role, firstName: user.firstName }) };
  }
  // --- NOUVEAU : RÉCUPÉRER LES DEMANDES EN ATTENTE ---
  async getAdminRequests() {
    return this.prisma.user.findMany({
      where: { requestedAdmin: true },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true }
    });
  }

  // --- NOUVEAU : APPROUVER OU REFUSER LA DEMANDE ---
  async handleAdminRequest(userId: string, approve: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Utilisateur introuvable");

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: approve ? 'admin' : 'standard',
        requestedAdmin: false 
      }
    });
    if (approve) {
      // 1. Notification interne (dans le CRM)
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          title: "Droits Administrateur accordés 🛡️",
          message: "Félicitations ! Vos accès ont été validés par l'équipe. Vous avez maintenant un contrôle total sur le CRM Veloria."
        }
      });

      // 2. Notification par Email (via Brevo)
      const htmlEmail = `
        <h2 style="color: #10B981; margin-bottom: 16px;">Demande approuvée ! ✅</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Bonne nouvelle ! Vos droits d'<strong>Administrateur</strong> ont été validés avec succès.</p>
        <p>Vous pouvez dès maintenant profiter de vos nouveaux accès sur votre espace Veloria.</p>
      `;
      await sendBrevoEmail(user.email, user.firstName, "✅ Vos accès Admin sont validés !", htmlEmail, "Veloria - Accès accordé");
    }

    return updatedUser;
  }
  // --- NOUVEAU : RÉCUPÉRER LES NOTIFICATIONS D'UN UTILISATEUR ---
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // --- NOUVEAU : MARQUER COMME LU ---
  async markNotificationsAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  // --- 2. CONNEXION (LOGIN) ---
  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Email ou mot de passe incorrect");

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException("Email ou mot de passe incorrect");

    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role, firstName: user.firstName }) };
  }
}