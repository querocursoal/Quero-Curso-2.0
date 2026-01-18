
export interface Course {
  id: string;
  name: string;
  // Renamed from description
  presentation: string;
  thumbnail: string; // base64 string
  professors: string[];
  city: string;
  // "Início Previsto"
  date: string;
  totalVacancies: number;
  remainingVacancies: number;
  isVip: boolean;
  thumbnailAlignmentPercent?: number;

  // New detailed fields
  registrationFee: number;
  registrationDeadline: string;
  workload: string; // e.g., "20 horas/aula"
  classPeriod: string; // e.g., "07 e 08 de Fevereiro"
  targetAudience: string;
  objectives: string;

  // Structured program content
  programContent: {
    title: string;
    topics: string[];
  }[];

  // Investment fields
  priceCash: number;
  fullPrice: number; // Card price
  installmentsText: string; // e.g., "10x de R$ 110,00"
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  desktopAlignment?: 'top' | 'center' | 'bottom';
  desktopAlignmentPercent?: number; // 0 to 100 for precision positioning

  // New HTML/Rich Banner fields
  type?: 'image' | 'html';

  // HTML Banner specific fields
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  subtitle?: string; // e.g. "Formação Completa"
  subtitleColor?: string;
  subtitleBgColor?: string; // Optional: background color for the badge

  ctaText?: string;
  bgColor?: string;
  textColor?: string; // Fallback / Global text color
  buttonColor?: string;
  buttonTextColor?: string;
  overlayImageUrl?: string; // Image with transparent background (person/object)
}

export interface MockSignup {
  id: string;
  studentName: string;
  courseName: string;
  signupDate: string; // ISO string
  status: 'Confirmada' | 'Pendente';
}
