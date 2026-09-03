/**
 * DTO para suscribirse al newsletter.
 */
export interface SubscribeNewsletterDto {
  email: string;
}

/**
 * Respuesta de suscripción al newsletter.
 */
export interface NewsletterSubscriberResponse {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
  message: string;
}
