import { Controller, Get, Post, Body, Patch, Param,Delete } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Post()
  create(@Body() body: { title: string, amount: number, contactId: string }) {
    return this.leadsService.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.leadsService.updateStatus(id, status);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { title: string, amount: number }) {
    return this.leadsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}