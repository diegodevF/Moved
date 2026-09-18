export type EvaluationType = 'Parcial 1' | 'Parcial 2' | 'Examen Final' | 'Taller' | 'Proyecto' | 'Tarea';

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  studentLastName: string;
  subject: string;
  evaluationType: EvaluationType | string;
  score: number;
  maxScore: number;
  date: string;
  feedback?: string;
  status: 'aprobado' | 'reprobado';
}

export type UploadRecord = Grade;

export interface StudentReference {
  id: string;
  name: string;
  lastName: string;
  email?: string;
}

export interface GradeStatsSummary {
  totalGrades: number;
  averageScore: number;
  passingRate: number;
  passedCount: number;
  failedCount: number;
  topGrade: number;
}

export type UploadStatsSummary = GradeStatsSummary;
