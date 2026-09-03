/**
 * DTO para inicio de sesión de administradores.
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Datos del usuario administrador.
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EDITOR' | string;
  createdAt: string;
}

/**
 * Respuesta de autenticación con token JWT.
 */
export interface AuthResponse {
  accessToken: string;
  user: AdminUser;
}
