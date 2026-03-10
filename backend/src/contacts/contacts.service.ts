import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class ContactsService {
  private prisma = new PrismaClient({ adapter });

  // READ : Récupérer tous les contacts
  async findAll() {
    return this.prisma.contact.findMany({
      include: { company: true },
      orderBy: { createdAt: 'desc' } // Les plus récents en premier
    });
  }

  // CREATE : Ajouter un contact (+ création entreprise auto)
  async create(data: { firstName: string, lastName: string, email: string, phone?: string, companyName?: string, status?: string }) {
    let finalCompanyId: string | null = null;

    // Si le frontend envoie un nom d'entreprise
    if (data.companyName && data.companyName.trim() !== '') {
      let company = await this.prisma.company.findFirst({
        where: { name: data.companyName },
      });

      if (!company) {
        company = await this.prisma.company.create({
          data: { name: data.companyName },
        });
      }
      finalCompanyId = company.id;
    }

    return this.prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        status: data.status, // On n'oublie pas le nouveau statut !
        companyId: finalCompanyId, // On relie le contact à l'entreprise trouvée ou créée
      }
    });
  }
// NOUVELLE FONCTION : Intégration Brevo API avec un beau template HTML
  async sendEmail(id: string, subject: string, content: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact introuvable');

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) throw new Error("La clé API Brevo est manquante dans le fichier .env !");

    // Le design de l'email (très pro !)
    const htmlTemplate = `
      <div style="background-color: #F9FAFB; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #9333EA; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Veloria</h1>
          </div>
          <div style="color: #374151; font-size: 16px; line-height: 1.6;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #F3F4F6; text-align: center; color: #9CA3AF; font-size: 13px;">
            <p>Cet email a été envoyé via Veloria CRM.</p>
          </div>
        </div>
      </div>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Veloria CRM', email: 'baouchelyna@gmail.com' }, // ⚠️ À CHANGER
        to: [{ email: contact.email, name: `${contact.firstName} ${contact.lastName}` }],
        subject: subject,
        htmlContent: htmlTemplate
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erreur Brevo: ${err}`);
    }

    return { success: true, message: 'Email envoyé avec succès !' };
  }
  async update(id: string, data: any) {
    let finalCompanyId: string | null | undefined = undefined;

    // Si on a modifié le nom de l'entreprise
    if (data.companyName && data.companyName.trim() !== '') {
      let company = await this.prisma.company.findFirst({ where: { name: data.companyName } });
      if (!company) {
        company = await this.prisma.company.create({ data: { name: data.companyName } });
      }
      finalCompanyId = company.id;
    } else if (data.companyName === '') {
      // Si l'utilisateur efface le champ entreprise, on déconnecte l'entreprise du contact
      finalCompanyId = null; 
    }

    return this.prisma.contact.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        status: data.status,
        // Met à jour l'entreprise uniquement si on l'a modifiée ou effacée
        ...(finalCompanyId !== undefined && { companyId: finalCompanyId }), 
      }
    });
  }

  // DELETE : Supprimer un contact
  async remove(id: string) {
    try {
      return await this.prisma.contact.delete({
        where: { id }
      });
    } catch (error) {
      throw new NotFoundException(`Le contact avec l'ID ${id} n'existe pas.`);
    }
  }
}