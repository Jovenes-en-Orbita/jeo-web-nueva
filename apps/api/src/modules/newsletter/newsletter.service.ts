import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { NewsletterBroadcastDto } from './dto/newsletter-broadcast.dto';
import type { NewsletterSubscriberResponse } from '@jeo/shared';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Suscribe un correo al boletín semanal y envía confirmación.
   */
  async subscribe(dto: SubscribeNewsletterDto): Promise<NewsletterSubscriberResponse> {
    const cleanEmail = dto.email.trim().toLowerCase();

    // Check if email already exists
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.active) {
        throw new ConflictException('Este correo electrónico ya se encuentra suscrito a Órbita Semanal.');
      }

      // Reactivate subscriber if inactive
      const reactivated = await this.prisma.newsletterSubscriber.update({
        where: { email: cleanEmail },
        data: { active: true },
      });

      await this.mailService.sendNewsletterWelcome(cleanEmail);

      return {
        id: reactivated.id,
        email: reactivated.email,
        active: reactivated.active,
        createdAt: reactivated.createdAt.toISOString(),
        message: '¡Tu suscripción a Órbita Semanal ha sido reactivada con éxito!',
      };
    }

    // Create new subscriber
    const subscriber = await this.prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        active: true,
      },
    });

    // Send confirmation email asynchronously
    this.mailService.sendNewsletterWelcome(cleanEmail).catch((err) => {
      this.logger.error(`Error sending welcome email in background: ${err.message}`);
    });

    return {
      id: subscriber.id,
      email: subscriber.email,
      active: subscriber.active,
      createdAt: subscriber.createdAt.toISOString(),
      message: '¡Te has suscrito con éxito a Órbita Semanal! Revisa tu bandeja de entrada.',
    };
  }

  /**
   * Obtiene todos los suscriptores (para administración).
   */
  async findAll() {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return subscribers.map((s) => ({
      id: s.id,
      email: s.email,
      active: s.active,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  /**
   * Elimina un suscriptor.
   */
  async delete(id: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Suscriptor no encontrado');
    }

    await this.prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return { success: true, message: 'Suscriptor eliminado correctamente' };
  }

  /**
   * Envía una campaña de correo masivo a todos los suscriptores activos vía Resend.
   */
  async broadcastCampaign(dto: NewsletterBroadcastDto) {
    const activeSubscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { active: true },
    });

    if (activeSubscribers.length === 0) {
      return {
        sentCount: 0,
        errors: 0,
        message: 'No hay suscriptores activos para enviar la campaña',
      };
    }

    const emails = activeSubscribers.map((s) => s.email);
    const result = await this.mailService.sendBroadcastEmail(
      emails,
      dto.subject,
      dto.title,
      dto.content,
    );

    return {
      sentCount: result.sentCount,
      errors: result.errors,
      totalRecipients: emails.length,
      message: `Campaña enviada a ${result.sentCount} suscriptores con éxito.`,
    };
  }
}
