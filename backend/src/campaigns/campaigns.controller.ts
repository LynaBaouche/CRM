import { Controller, Get, Post, Body } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string, subject: string, content: string, contactIds: string[], userId: string }) {
    return this.campaignsService.createAndSend(body);
  }
}