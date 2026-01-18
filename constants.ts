
import { Course, HeroSlide } from './types';

// Default WhatsApp number, can be overridden by admin settings
export const DEFAULT_WHATSAPP_NUMBER = "5511999998888"; 
export const WHATSAPP_MESSAGE = "Olá! Tenho interesse em um dos cursos da Quero Curso.";
export const WHATSAPP_LINK = (whatsappNumber: string) => `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const WHATSAPP_COURSE_MESSAGE = (courseName: string, whatsappNumber: string) => `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(`Olá! Gostaria de me inscrever no curso "${courseName}".`)}`;

export const COMPANY_NAME = "Quero Curso";
export const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/querocurso/";
export const DEFAULT_LINKEDIN_URL = "https://www.linkedin.com/company/querocurso/";


export const DEFAULT_HERO_SLIDES: HeroSlide[] = [];

export const WHATSAPP_BUTTON_TEXTS = {
  INQUIRY: 'Falar com a equipe no WhatsApp',
  URGENCY: 'Verificar vagas disponíveis',
  CONSULTATION: 'Quero orientação para me inscrever',
};

export const INITIAL_COURSES: Course[] = [];
