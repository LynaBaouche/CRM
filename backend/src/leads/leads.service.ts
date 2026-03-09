import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class LeadsService {
  private prisma = new PrismaClient({ adapter });

  async findAll() {
    return this.prisma.lead.findMany({
      include: { contact: true }, 
      orderBy: { createdAt: 'desc' }
    });
  }

  // CREATE : Adapté à ton nouveau schéma
  async create(data: { title: string, amount: number | string, contactId: string }) {
    return this.prisma.lead.create({
      data: {
        title: data.title,
        amount: parseInt(data.amount as string) || 0, // Force en entier (Int)
        status: 'Lead Capturé', // Ton statut par défaut
        contactId: data.contactId,
      }
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { status }
    });
  }
  // UPDATE : Modifier le titre ou le montant
  async update(id: string, data: { title: string, amount: number }) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        title: data.title,
        amount: parseInt(data.amount as any) || 0
      }
    });
  }

  // DELETE : Supprimer un deal
  async remove(id: string) {
    return this.prisma.lead.delete({
      where: { id }
    });
  }
}