import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getAllContacts() {
    return this.contactsService.findAll();
  }

  @Post()
  async createContact(@Body() body: any) { // "any" évite que NestJS ne bloque les nouveaux champs
    return this.contactsService.create(body);
  }
  // NOUVELLE ROUTE : Envoyer un email via Brevo
  @Post(':id/email')
  async sendEmail(@Param('id') id: string, @Body() body: { subject: string, content: string }) {
    return this.contactsService.sendEmail(id, body.subject, body.content);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.contactsService.update(id, body);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}