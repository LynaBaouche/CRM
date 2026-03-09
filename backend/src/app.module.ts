import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { LeadsModule } from './leads/leads.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ContactsModule, LeadsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
