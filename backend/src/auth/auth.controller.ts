import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body.email, body.password, body.firstName, body.lastName, body.role);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
  @Get('admin-requests')
  getAdminRequests() {
    return this.authService.getAdminRequests();
  }

  @Patch('users/:id/approve-admin')
  approveAdmin(@Param('id') id: string, @Body() body: { approve: boolean }) {
    return this.authService.handleAdminRequest(id, body.approve);
  }
  @Get('notifications/:userId')
  getNotifications(@Param('userId') userId: string) {
    return this.authService.getUserNotifications(userId);
  }

  @Patch('notifications/:userId/read')
  markAsRead(@Param('userId') userId: string) {
    return this.authService.markNotificationsAsRead(userId);
  }
}