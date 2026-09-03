import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('MAIL_FROM') || 'JEO Jóvenes en Órbita <newsletter@jovenesenorbita.com>';

    if (apiKey && apiKey.trim() !== '') {
      this.resend = new Resend(apiKey);
      this.logger.log('✉️ Resend email service initialized successfully.');
    } else {
      this.logger.warn('⚠️ RESEND_API_KEY is not configured. Emails will be simulated in development mode.');
    }
  }

  /**
   * Envía correo de bienvenida tras suscribirse al newsletter.
   */
  async sendNewsletterWelcome(toEmail: string): Promise<boolean> {
    const subject = '🚀 ¡Bienvenido a Órbita Semanal — Jóvenes en Órbita!';
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #080d1a; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #FFC72C; font-size: 24px; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 2px;">Jóvenes en Órbita</h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">Divulgación científica espacial hecha por y para jóvenes</p>
        </div>

        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #E0234E;">
          <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">¡Tu suscripción está confirmada! 🎉</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            A partir de ahora recibirás semanalmente en tu bandeja de entrada un resumen con los principales descubrimientos del cosmos, lanzamientos espaciales, astrofotografía y novedades del ecosistema espacial argentino.
          </p>
        </div>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
          Sin spam. Solo ciencia y divulgación de alta calidad. Si en algún momento deseas cancelar tu suscripción, podrás hacerlo con un solo clic.
        </p>

        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />

        <div style="text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 4px 0;">© ${new Date().getFullYear()} Jóvenes en Órbita (JEO). Todos los derechos reservados.</p>
          <p style="margin: 4px 0;">Contacto: <a href="mailto:jovenesenorbita@gmail.com" style="color: #FFC72C; text-decoration: none;">jovenesenorbita@gmail.com</a></p>
        </div>
      </div>
    `;

    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.fromEmail,
          to: toEmail,
          subject,
          html,
        });
        this.logger.log(`📬 Newsletter welcome email successfully sent to ${toEmail}`);
        return true;
      } catch (error) {
        this.logger.error(`❌ Error sending email via Resend to ${toEmail}:`, error);
        return false;
      }
    } else {
      this.logger.log(`[DEV MODE] Simulated welcome email to ${toEmail}: "${subject}"`);
      return true;
    }
  }

  /**
   * Envía una campaña de newsletter a una lista de suscriptores (broadcast).
   */
  async sendBroadcastEmail(
    recipients: string[],
    subject: string,
    title: string,
    content: string,
  ): Promise<{ sentCount: number; errors: number }> {
    let sentCount = 0;
    let errors = 0;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #080d1a; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #FFC72C; font-size: 24px; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 2px;">Jóvenes en Órbita</h1>
          <p style="color: #94a3b8; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Boletín Informativo — Órbita Semanal</p>
        </div>

        <div style="background: #0d162a; padding: 24px; border-radius: 10px; margin-bottom: 24px; border-left: 4px solid #FFC72C;">
          <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;">${title}</h2>
          <div style="color: #cbd5e1; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${content}</div>
        </div>

        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />

        <div style="text-align: center; color: #64748b; font-size: 11px;">
          <p style="margin: 4px 0;">Recibiste este correo porque estás suscrito al boletín de Jóvenes en Órbita.</p>
          <p style="margin: 4px 0;">Contacto: <a href="mailto:jovenesenorbita@gmail.com" style="color: #FFC72C; text-decoration: none;">jovenesenorbita@gmail.com</a></p>
        </div>
      </div>
    `;

    for (const recipient of recipients) {
      if (this.resend) {
        try {
          await this.resend.emails.send({
            from: this.fromEmail,
            to: recipient,
            subject,
            html,
          });
          sentCount++;
        } catch (err) {
          this.logger.error(`❌ Failed to send broadcast email to ${recipient}:`, err);
          errors++;
        }
      } else {
        this.logger.log(`[DEV MODE] Simulated broadcast email to ${recipient}: "${subject}"`);
        sentCount++;
      }
    }

    return { sentCount, errors };
  }

  /**
   * Envía correo de confirmación de postulación recibida al aspirante y aviso al equipo.
   */
  async sendApplicationConfirmation(applicantEmail: string, applicantName: string, area: string): Promise<boolean> {
    const subject = `✨ Recibimos tu postulación a Jóvenes en Órbita (${area})`;
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #080d1a; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #FFC72C; font-size: 22px; text-transform: uppercase;">¡Hola, ${applicantName}!</h1>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Hemos recibido tu postulación para sumarte al equipo de <strong>Jóvenes en Órbita</strong> en el área de <strong>${area.toUpperCase()}</strong>.
        </p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Revisaremos tu información y nos pondremos en contacto contigo a la brevedad. ¡Gracias por querer ser parte de nuestra misión de divulgación espacial!
        </p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
        <p style="color: #64748b; font-size: 11px;">Equipo de Coordinación — Jóvenes en Órbita</p>
      </div>
    `;

    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.fromEmail,
          to: applicantEmail,
          subject,
          html,
        });
        return true;
      } catch (error) {
        this.logger.error(`❌ Error sending application email to ${applicantEmail}:`, error);
        return false;
      }
    } else {
      this.logger.log(`[DEV MODE] Simulated application confirmation to ${applicantEmail} (${area})`);
      return true;
    }
  }
}
