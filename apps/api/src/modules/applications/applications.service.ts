import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import type { ApplicationResponse } from '@jeo/shared';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Registra una nueva postulación de voluntario y envía emails.
   */
  async create(dto: CreateApplicationDto): Promise<ApplicationResponse> {
    const submission = await this.prisma.applicationSubmission.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.trim().toLowerCase(),
        area: dto.area.trim().toLowerCase(),
        message: dto.message.trim(),
        portfolioUrl: dto.portfolioUrl ? dto.portfolioUrl.trim() : null,
      },
    });

    // Send confirmation email in background
    this.mailService
      .sendApplicationConfirmation(submission.email, submission.fullName, submission.area)
      .catch((err) => this.logger.error(`Error sending email to applicant: ${err.message}`));

    return {
      id: submission.id,
      fullName: submission.fullName,
      email: submission.email,
      area: submission.area,
      createdAt: submission.createdAt.toISOString(),
      message: '¡Gracias por postularte! Hemos recibido tu información y nos contactaremos pronto.',
    };
  }

  /**
   * Lista todas las postulaciones recibidas (Para uso interno / coordinación).
   */
  async findAll() {
    const submissions = await this.prisma.applicationSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      email: s.email,
      area: s.area,
      message: s.message,
      portfolioUrl: s.portfolioUrl ?? undefined,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  /**
   * Actualiza el estado de una postulación (PENDING, REVIEWED, ACCEPTED, REJECTED).
   */
  async updateStatus(id: string, dto: UpdateApplicationStatusDto) {
    const existing = await this.prisma.applicationSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Postulación no encontrada');
    }

    const updated = await this.prisma.applicationSubmission.update({
      where: { id },
      data: { status: dto.status },
    });

    return {
      id: updated.id,
      status: updated.status,
      message: `Estado actualizado a ${dto.status}`,
    };
  }

  /**
   * Elimina una postulación.
   */
  async delete(id: string) {
    const existing = await this.prisma.applicationSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Postulación no encontrada');
    }

    await this.prisma.applicationSubmission.delete({
      where: { id },
    });

    return { success: true, message: 'Postulación eliminada' };
  }
}
