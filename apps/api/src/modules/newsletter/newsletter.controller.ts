import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { NewsletterBroadcastDto } from './dto/newsletter-broadcast.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { NewsletterSubscriberResponse } from '@jeo/shared';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Suscribir un correo al newsletter semanal' })
  @ApiResponse({ status: 201, description: 'Suscripción exitosa' })
  @ApiResponse({ status: 409, description: 'Correo ya suscrito' })
  async subscribe(
    @Body() subscribeNewsletterDto: SubscribeNewsletterDto,
  ): Promise<NewsletterSubscriberResponse> {
    return this.newsletterService.subscribe(subscribeNewsletterDto);
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los suscriptores (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de suscriptores' })
  async getSubscribers() {
    return this.newsletterService.findAll();
  }

  @Delete('subscribers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un suscriptor (Admin)' })
  @ApiResponse({ status: 200, description: 'Suscriptor eliminado' })
  async deleteSubscriber(@Param('id') id: string) {
    return this.newsletterService.delete(id);
  }

  @Post('broadcast')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar campaña de correo a todos los suscriptores activos (Admin)' })
  @ApiResponse({ status: 200, description: 'Campaña enviada con éxito' })
  async broadcast(@Body() broadcastDto: NewsletterBroadcastDto) {
    return this.newsletterService.broadcastCampaign(broadcastDto);
  }
}
