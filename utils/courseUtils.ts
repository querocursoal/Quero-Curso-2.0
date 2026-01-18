
import { Course } from '../types';

// RULE 2: A course has few vacancies if remaining are 20% or less of the total, OR below the admin-defined fixed limit.
export const isAlmostFull = (course: Course, lowStockThreshold: number): boolean => {
  if (course.totalVacancies <= 0) return false;
  
  const percentageLimit = course.totalVacancies * 0.2; // 20% rule remains as a fallback
  
  return course.remainingVacancies > 0 && (course.remainingVacancies <= percentageLimit || course.remainingVacancies <= lowStockThreshold);
};

// RULE 4: A course is sold out if remaining vacancies are 0.
export const isSoldOut = (course: Course): boolean => {
  return course.remainingVacancies <= 0;
};

// Helper to get a priority score for sorting
const getCourseStatusScore = (course: Course, lowStockThreshold: number): number => {
  if (isSoldOut(course)) return -1; // Sold out courses go last.

  const vip = course.isVip;
  const almostFull = isAlmostFull(course, lowStockThreshold);

  if (vip && almostFull) return 3; // RULE 3.1: VIP + Few vacancies
  if (vip) return 2; // RULE 3.2: VIP only
  if (almostFull) return 1; // RULE 3.3: Few vacancies only
  
  return 0; // RULE 3.4: Regular courses
};

/**
 * Sorts courses based on the priority rules:
 * 1. VIP + Few Vacancies
 * 2. VIP
 * 3. Few Vacancies
 * 4. Regular
 * 5. Sold Out
 */
export const sortCourses = (courses: Course[], lowStockThreshold: number): Course[] => {
  return [...courses].sort((a, b) => {
    const scoreA = getCourseStatusScore(a, lowStockThreshold);
    const scoreB = getCourseStatusScore(b, lowStockThreshold);
    return scoreB - scoreA; // Sort in descending order of score
  });
};

export const parseDate = (dateStr: string): Date | null => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  // Month is 0-indexed in JS Date
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month - 1, day);
};

export const isClosingSoon = (course: Course, days: number = 3): boolean => {
  const courseDate = parseDate(course.date);
  if (!courseDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  const timeDiff = courseDate.getTime() - today.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  return dayDiff >= 0 && dayDiff <= days;
};

export const isPast = (course: Course): boolean => {
  const courseDate = parseDate(course.date);
  if (!courseDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return courseDate < today;
};

// --- New Analytics Functions ---

// Assuming course was published 30 days before its start date for simulation
const PUBLISH_LEAD_TIME_DAYS = 30;

const getDaysSincePublish = (course: Course): number => {
  const courseDate = parseDate(course.date);
  if (!courseDate) return 1;

  const publishDate = new Date(courseDate.getTime());
  publishDate.setDate(publishDate.getDate() - PUBLISH_LEAD_TIME_DAYS);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If today is before the publish date, consider it as day 1
  if (today < publishDate) return 1;

  const timeDiff = today.getTime() - publishDate.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(1, dayDiff); // Ensure at least 1 day
};

export const calculateFillRate = (course: Course): number => {
  if (isPast(course)) return 0;
  const daysSincePublish = getDaysSincePublish(course);
  const signups = course.totalVacancies - course.remainingVacancies;
  return signups / daysSincePublish;
};


export const getPrediction = (course: Course) => {
  const courseDate = parseDate(course.date);
  if (!courseDate || isPast(course) || isSoldOut(course)) {
    return {
      sellOutDate: 'N/A',
      finalOccupancy: '100',
      risk: { level: 'Concluído', color: 'bg-gray-100 text-gray-800'},
      action: { text: 'Curso encerrado ou esgotado.', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
    };
  }

  const fillRate = calculateFillRate(course);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysRemainingUntilCourse = Math.max(0, Math.ceil((courseDate.getTime() - today.getTime()) / (1000 * 3600 * 24)));
  
  // Predict future signups
  const predictedSignups = Math.floor(fillRate * daysRemainingUntilCourse);
  const currentSignups = course.totalVacancies - course.remainingVacancies;
  const finalSignups = Math.min(course.totalVacancies, currentSignups + predictedSignups);
  const finalOccupancy = course.totalVacancies > 0 ? (finalSignups / course.totalVacancies) * 100 : 0;

  let sellOutDate = 'Não previsto';
  if (fillRate > 0 && course.remainingVacancies > 0) {
    const daysToSellOut = Math.ceil(course.remainingVacancies / fillRate);
    const sellOutTimestamp = new Date();
    sellOutTimestamp.setDate(today.getDate() + daysToSellOut);
    if (sellOutTimestamp <= courseDate) {
      sellOutDate = sellOutTimestamp.toLocaleDateString('pt-BR');
    }
  }

  // Determine Risk and Recommended Action
  let risk: { level: string; color: string; };
  let action: { text: string; bgColor: string; textColor: string; };

  if (finalOccupancy >= 95) {
    risk = { level: 'Baixo Risco', color: 'bg-green-100 text-green-800' };
    action = { text: 'Alta demanda. Reforce a escassez e destaque o curso na vitrine.', bgColor: 'bg-green-50', textColor: 'text-green-800' };
  } else if (finalOccupancy >= 70) {
    risk = { level: 'Atenção', color: 'bg-yellow-100 text-yellow-800' };
    action = { text: 'Demanda moderada. Considere uma campanha de "últimas semanas" para garantir a lotação.', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800' };
  } else {
    risk = { level: 'Alto Risco', color: 'bg-red-100 text-red-800' };
    action = { text: 'Baixa demanda. Acelere a campanha de urgência e revise a comunicação do curso.', bgColor: 'bg-red-50', textColor: 'text-red-800' };
  }

  return {
    sellOutDate,
    finalOccupancy: finalOccupancy.toFixed(0),
    risk,
    action,
  };
};
