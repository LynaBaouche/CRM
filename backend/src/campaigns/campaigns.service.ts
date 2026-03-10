import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { sendBrevoEmail } from '../utils/mail.util';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class CampaignsService {
  private prisma = new PrismaClient({ adapter });

  // Récupérer toutes les campagnes pour la future page du front
  async findAll() {
    return this.prisma.campaign.findMany({
      include: { contacts: { include: { contact: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Créer et envoyer une campagne à plusieurs contacts
  async createAndSend(data: { name: string, subject: string, content: string, contactIds: string[], userId: string }) {
    
    // 1. On crée la campagne en base de données
    const campaign = await this.prisma.campaign.create({
      data: {
        name: data.name,
        subject: data.subject,
        status: 'envoyé',
        userId: data.userId,
      }
    });

    // 2. On récupère les vraies infos des contacts ciblés
    const contacts = await this.prisma.contact.findMany({
      where: { id: { in: data.contactIds } }
    });

    // 3. On boucle pour envoyer l'email et tracer chaque destinataire
    for (const contact of contacts) {
      // Envoi via Brevo (avec le design)
      await sendBrevoEmail(contact.email, `${contact.firstName} ${contact.lastName}`, data.subject, data.content);

      // On ajoute ce contact dans la base de données (pour tracker les KPIs plus tard)
      await this.prisma.campaignContact.create({
        data: {
          campaignId: campaign.id,
          contactId: contact.id,
          status: 'envoyé'
        }
      });
    }

    return campaign;
  }
}