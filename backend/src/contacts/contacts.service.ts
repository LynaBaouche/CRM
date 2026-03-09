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

  // CREATE : Ajouter un contact
  async create(data: { firstName: string, lastName: string, email: string, phone?: string, companyId?: string }) {
    return this.prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyId: data.companyId,
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