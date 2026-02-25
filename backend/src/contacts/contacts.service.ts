import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ContactsService {
  private prisma = new PrismaClient();

  // Récupérer tous les contacts depuis Neon
  async findAll() {
    return this.prisma.contact.findMany({
      include: { company: true } // On inclut l'entreprise liée
    });
  }

  // Créer un nouveau contact
  async create(data: { firstName: string, lastName: string, email: string, companyName?: string }) {
    return this.prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        // Optionnel : On pourrait lier une entreprise ici
      }
    });
  }
}