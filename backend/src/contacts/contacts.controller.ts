import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getAllContacts() {
    return this.contactsService.findAll();
  }

  @Post()
  async createContact(@Body() body: { firstName: string, lastName: string, email: string, phone?: string, companyId?: string }) {
    return this.contactsService.create(body);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}