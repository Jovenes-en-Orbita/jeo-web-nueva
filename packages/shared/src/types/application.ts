/**
 * DTO para postulación de voluntario en JEO.
 */
export interface CreateApplicationDto {
  fullName: string;
  email: string;
  area: 'redaccion' | 'diseno' | 'tech' | string;
  message: string;
  portfolioUrl?: string;
}

/**
 * Respuesta tras enviar una postulación.
 */
export interface ApplicationResponse {
  id: string;
  fullName: string;
  email: string;
  area: string;
  createdAt: string;
  message: string;
}
