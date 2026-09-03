import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AdminDashboardStats } from '@jeo/shared';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard-stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas y métricas del dashboard administrativo' })
  @ApiResponse({ status: 200, description: 'Estadísticas del dashboard' })
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return this.adminService.getDashboardStats();
  }
}
