import { useState, useEffect } from 'react';
import { X, FloppyDisk, User, BookOpen, Exam, CalendarBlank, ChatCenteredDots } from '@phosphor-icons/react';
import type { Grade, StudentReference } from '../types/upload';
import { DEFAULT_STUDENTS, SUBJECTS, EVALUATION_TYPES } from '../services/uploadStorage';

interface UploadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradeData: Omit<Grade, 'id' | 'status'>, idToUpdate?: string) => void;
  gradeToEdit?: Grade | null;
}

export const UploadFormModal = ({
  isOpen,
  onClose,
  onSave,
  gradeToEdit,
}: UploadFormModalProps) => {
  const [studentId, setStudentId] = useState<string>('');
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [evaluationType, setEvaluationType] = useState<string>(EVALUATION_TYPES[0]);
  const [score, setScore] = useState<string>('8.0');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (gradeToEdit) {
      setStudentId(gradeToEdit.studentId || '');
      setSubject(gradeToEdit.subject);
      setEvaluationType(gradeToEdit.evaluationType);
      setScore(gradeToEdit.score.toString());
      setDate(gradeToEdit.date);
      setFeedback(gradeToEdit.feedback || '');
    } else {
      setStudentId(DEFAULT_STUDENTS[0]?.id || '');
      setSubject(SUBJECTS[0]);
      setEvaluationType(EVALUATION_TYPES[0]);
      setScore('8.0');
      setDate(new Date().toISOString().split('T')[0]);
      setFeedback('');
    }
    setError('');
  }, [gradeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseFloat(score);

    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setError('La calificación debe estar entre 0.0 y 10.0');
      return;
    }

    const selectedStudent = DEFAULT_STUDENTS.find((s) => s.id === studentId);
    if (!selectedStudent && !gradeToEdit) {
      setError('Por favor selecciona un estudiante');
      return;
    }

    const studentName = selectedStudent ? selectedStudent.name : (gradeToEdit?.studentName || 'Estudiante');
    const studentLastName = selectedStudent ? selectedStudent.lastName : (gradeToEdit?.studentLastName || '');

    onSave(
      {
        studentId: studentId || gradeToEdit?.studentId || 'std-custom',
        studentName,
        studentLastName,
        subject,
        evaluationType,
        score: Number(numScore.toFixed(1)),
        maxScore: 10.0,
        date,
        feedback: feedback.trim(),
      },
      gradeToEdit?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {gradeToEdit ? 'Editar Calificación' : 'Registrar Nueva Calificación'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {gradeToEdit ? 'Actualiza los datos del alumno' : 'Ingresa la nota y detalles de la evaluación'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <User size={15} className="text-emerald-500" />
              Estudiante
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            >
              {DEFAULT_STUDENTS.map((st: StudentReference) => (
                <option key={st.id} value={st.id}>
                  {st.name} {st.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <BookOpen size={15} className="text-emerald-500" />
                Materia
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Exam size={15} className="text-emerald-500" />
                Evaluación
              </label>
              <select
                value={evaluationType}
                onChange={(e) => setEvaluationType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {EVALUATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Calificación (0.0 - 10.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CalendarBlank size={15} className="text-emerald-500" />
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ChatCenteredDots size={15} className="text-emerald-500" />
              Observaciones / Retroalimentación
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Opcional: agrega comentarios de desempeño o recomendaciones..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <FloppyDisk size={16} />
              {gradeToEdit ? 'Guardar Cambios' : 'Registrar Nota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const GradeFormModal = UploadFormModal;
