import type { Grade, GradeStatsSummary, StudentReference } from '../types/upload';

const STORAGE_KEY = 'moved_grades_data';
export const PASSING_SCORE = 6.0;

export const DEFAULT_STUDENTS: StudentReference[] = [
  { id: 'std-1', name: 'Diego', lastName: 'Hernandez', email: 'diego.h@estudiantes.edu' },
  { id: 'std-2', name: 'Carlos', lastName: 'Perez', email: 'carlos.p@estudiantes.edu' },
  { id: 'std-3', name: 'Daniela', lastName: 'Gomez', email: 'daniela.g@estudiantes.edu' },
  { id: 'std-4', name: 'Sofia', lastName: 'Martinez', email: 'sofia.m@estudiantes.edu' },
  { id: 'std-5', name: 'Mateo', lastName: 'Rodriguez', email: 'mateo.r@estudiantes.edu' },
  { id: 'std-6', name: 'Valentina', lastName: 'Lopez', email: 'valentina.l@estudiantes.edu' },
  { id: 'std-7', name: 'Lucas', lastName: 'Diaz', email: 'lucas.d@estudiantes.edu' },
];

export const SUBJECTS: string[] = [
  'Matemáticas',
  'Física',
  'Química',
  'Programación',
  'Historia',
  'Literatura',
  'Inglés',
];

export const EVALUATION_TYPES = [
  'Parcial 1',
  'Parcial 2',
  'Examen Final',
  'Taller',
  'Proyecto',
  'Tarea',
];

const INITIAL_GRADES: Grade[] = [
  {
    id: 'grd-1',
    studentId: 'std-1',
    studentName: 'Diego',
    studentLastName: 'Hernandez',
    subject: 'Matemáticas',
    evaluationType: 'Parcial 1',
    score: 9.0,
    maxScore: 10.0,
    date: '2026-03-10',
    feedback: 'Excelente resolución de problemas algebraicos.',
    status: 'aprobado',
  },
  {
    id: 'grd-2',
    studentId: 'std-2',
    studentName: 'Carlos',
    studentLastName: 'Perez',
    subject: 'Física',
    evaluationType: 'Parcial 1',
    score: 8.0,
    maxScore: 10.0,
    date: '2026-03-12',
    feedback: 'Buen trabajo en dinámica clásica.',
    status: 'aprobado',
  },
  {
    id: 'grd-3',
    studentId: 'std-3',
    studentName: 'Daniela',
    studentLastName: 'Gomez',
    subject: 'Química',
    evaluationType: 'Examen Final',
    score: 10.0,
    maxScore: 10.0,
    date: '2026-03-14',
    feedback: 'Desempeño sobresaliente y precisión analítica.',
    status: 'aprobado',
  },
  {
    id: 'grd-4',
    studentId: 'std-4',
    studentName: 'Sofia',
    studentLastName: 'Martinez',
    subject: 'Programación',
    evaluationType: 'Proyecto',
    score: 9.5,
    maxScore: 10.0,
    date: '2026-03-15',
    feedback: 'Arquitectura de código limpia y buenas prácticas.',
    status: 'aprobado',
  },
  {
    id: 'grd-5',
    studentId: 'std-5',
    studentName: 'Mateo',
    studentLastName: 'Rodriguez',
    subject: 'Matemáticas',
    evaluationType: 'Parcial 1',
    score: 5.0,
    maxScore: 10.0,
    date: '2026-03-10',
    feedback: 'Reforzar ecuaciones cuadráticas para recuperación.',
    status: 'reprobado',
  },
  {
    id: 'grd-6',
    studentId: 'std-6',
    studentName: 'Valentina',
    studentLastName: 'Lopez',
    subject: 'Historia',
    evaluationType: 'Taller',
    score: 7.5,
    maxScore: 10.0,
    date: '2026-03-11',
    feedback: 'Buen análisis histórico.',
    status: 'aprobado',
  },
];

export const getStoredGrades = (): Grade[] => {
  if (typeof window === 'undefined') return INITIAL_GRADES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRADES));
      return INITIAL_GRADES;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error al leer calificaciones de localStorage:', error);
    return INITIAL_GRADES;
  }
};

export const saveGradesToStorage = (grades: Grade[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
    window.dispatchEvent(new Event('moved_grades_updated'));
  } catch (error) {
    console.error('Error al guardar calificaciones en localStorage:', error);
  }
};

export const createGrade = (grade: Omit<Grade, 'id' | 'status'>): Grade => {
  const current = getStoredGrades();
  const newGrade: Grade = {
    ...grade,
    id: `grd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: grade.score >= PASSING_SCORE ? 'aprobado' : 'reprobado',
  };
  const updated = [newGrade, ...current];
  saveGradesToStorage(updated);
  return newGrade;
};

export const updateGrade = (id: string, updates: Partial<Omit<Grade, 'id'>>): Grade | null => {
  const current = getStoredGrades();
  const index = current.findIndex((g) => g.id === id);
  if (index === -1) return null;

  const target = current[index];
  const newScore = updates.score !== undefined ? updates.score : target.score;
  const updatedGrade: Grade = {
    ...target,
    ...updates,
    score: newScore,
    status: newScore >= PASSING_SCORE ? 'aprobado' : 'reprobado',
  };

  current[index] = updatedGrade;
  saveGradesToStorage(current);
  return updatedGrade;
};

export const deleteGrade = (id: string): boolean => {
  const current = getStoredGrades();
  const filtered = current.filter((g) => g.id !== id);
  if (filtered.length === current.length) return false;
  saveGradesToStorage(filtered);
  return true;
};

export const batchCreateGrades = (grades: Array<Omit<Grade, 'id' | 'status'>>): Grade[] => {
  const current = getStoredGrades();
  const createdList: Grade[] = grades.map((g, idx) => ({
    ...g,
    id: `grd-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
    status: g.score >= PASSING_SCORE ? 'aprobado' : 'reprobado',
  }));

  const updated = [...createdList, ...current];
  saveGradesToStorage(updated);
  return createdList;
};

export const calculateGradeStats = (grades: Grade[]): GradeStatsSummary => {
  if (grades.length === 0) {
    return {
      totalGrades: 0,
      averageScore: 0,
      passingRate: 0,
      passedCount: 0,
      failedCount: 0,
      topGrade: 0,
    };
  }

  const total = grades.length;
  const sum = grades.reduce((acc, g) => acc + g.score, 0);
  const passed = grades.filter((g) => g.score >= PASSING_SCORE).length;
  const failed = total - passed;
  const max = Math.max(...grades.map((g) => g.score));

  return {
    totalGrades: total,
    averageScore: Number((sum / total).toFixed(1)),
    passingRate: Math.round((passed / total) * 100),
    passedCount: passed,
    failedCount: failed,
    topGrade: max,
  };
};

// Aliases para semántica de Upload
export const getStoredUploads = getStoredGrades;
export const saveUploadsToStorage = saveGradesToStorage;
export const createUploadRecord = createGrade;
export const updateUploadRecord = updateGrade;
export const deleteUploadRecord = deleteGrade;
export const batchCreateUploads = batchCreateGrades;
export const calculateUploadStats = calculateGradeStats;
