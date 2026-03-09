import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'SUPER_SECRET_KEY_CRM', // Ta clé secrète pour générer les tokens
      signOptions: { expiresIn: '1d' }, // Le token expire dans 1 jour
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}