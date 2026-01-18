
import { MockSignup } from './types';

const now = new Date();

// Helper to create dates relative to today
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export const mockSignups: MockSignup[] = [
  { 
    id: '1', 
    studentName: 'Ana Clara', 
    courseName: 'Desenvolvimento Web Full Stack', 
    signupDate: new Date().toISOString(), 
    status: 'Confirmada' 
  },
  { 
    id: '2', 
    studentName: 'Bruno Gomes', 
    courseName: 'Gestão de Projetos com Metodologias Ágeis', 
    signupDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), 
    status: 'Confirmada' 
  },
  { 
    id: '3', 
    studentName: 'Carla Dias', 
    courseName: 'Design Gráfico e UI/UX', 
    signupDate: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), 
    status: 'Pendente' 
  },
  { 
    id: '4', 
    studentName: 'Daniel Martins', 
    courseName: 'Desenvolvimento Web Full Stack', 
    signupDate: daysAgo(1).toISOString(), 
    status: 'Confirmada' 
  },
  { 
    id: '5', 
    studentName: 'Elisa Ferreira', 
    courseName: 'Marketing Digital e Mídias Sociais', 
    signupDate: daysAgo(2).toISOString(), 
    status: 'Confirmada' 
  },
];
