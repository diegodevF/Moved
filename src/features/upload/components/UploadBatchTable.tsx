import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FloppyDisk,
  BookOpen,
  Exam,
  CalendarBlank,
  WarningCircle,
  ArrowCounterClockwise,
  Check,
} from '@phosphor-icons/react';
import type { Grade, StudentReference } from '../types/upload';
import { DEFAULT_STUDENTS, SUBJECTS, EVALUATION_TYPES, PASSING_SCORE } from '../services/uploadStorage';

interface UploadBatchTableProps {
  onBatchSave: (grades: Array<Omit<Grade, 'id' | 'status'>>) => void;
}

interface StudentRowState {
  student: StudentReference;
  score: string;
  feedback: string;
}

export const UploadBatchTable = ({ onBatchSave }: UploadBatchTableProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>(EVALUATION_TYPES[0]);
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const scoreInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [rows, setRows] = useState<StudentRowState[]>(() =>
    DEFAULT_STUDENTS.map((st) => ({
      student: st,
      score: '',
      feedback: '',
    }))
  );

  useEffect(() => {
    if (!savedSuccess) return;
    const timer = setTimeout(() => setSavedSuccess(false), 3500);
    return () => clearTimeout(timer);
  }, [savedSuccess]);

  const handleScoreChange = (index: number, rawVal: string) => {
    const normalized = rawVal.replace(',', '.');
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], score: normalized };
      return next;
    });
    setSavedSuccess(false);
  };

  const handleScoreKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = scoreInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = scoreInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  };

  const handleFeedbackChange = (index: number, val: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], feedback: val };
      return next;
    });
  };

  const handleFillEmpty = (presetValue: string) => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        score: r.score.trim() === '' ? presetValue : r.score,
      }))
    );
    setSavedSuccess(false);
  };

  const handleClearAll = () => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        score: '',
        feedback: '',
      }))
    );
    setSavedSuccess(false);
  };

  const batchStats = useMemo(() => {
    const validScores: number[] = [];
    let hasInvalid = false;

    for (const r of rows) {
      const trimmed = r.score.trim();
      if (!trimmed) continue;
      const num = parseFloat(trimmed);
      if (isNaN(num) || num < 0 || num > 10) {
        hasInvalid = true;
      } else {
        validScores.push(num);
      }
    }

    const count = validScores.length;
    const avg = count > 0 ? (validScores.reduce((a, b) => a + b, 0) / count).toFixed(1) : null;
    const passed = validScores.filter((s) => s >= PASSING_SCORE).length;
    const failed = count - passed;

    return {
      count,
      avg,
      passed,
      failed,
      hasInvalid,
      totalStudents: rows.length,
    };
  }, [rows]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (batchStats.hasInvalid) return;

    const validRows = rows.filter((r) => r.score.trim() !== '');
    if (validRows.length === 0) return;

    const payload: Array<Omit<Grade, 'id' | 'status'>> = validRows.map((r) => {
      const numScore = parseFloat(r.score.trim());
      return {
        studentId: r.student.id,
        studentName: r.student.name,
        studentLastName: r.student.lastName,
        subject: selectedSubject,
        evaluationType: selectedEvaluation,
        score: Number(numScore.toFixed(1)),
        maxScore: 10.0,
        date,
        feedback: r.feedback.trim() || undefined,
      };
    });

    onBatchSave(payload);
    setSavedSuccess(true);
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Planilla de calificaciones
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registro masivo por asignatura y evaluación para el período activo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium mr-1">Rellenar vacíos:</span>
          {(['10.0', '7.0', '0.0'] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleFillEmpty(preset)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              {preset}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowCounterClockwise size={13} />
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <BookOpen size={15} className="text-emerald-500" />
            Asignatura
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSavedSuccess(false);
            }}
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
            value={selectedEvaluation}
            onChange={(e) => {
              setSelectedEvaluation(e.target.value);
              setSavedSuccess(false);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {EVALUATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
          />
        </div>
      </div>

      {batchStats.count > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <span>
              Ingresadas:{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {batchStats.count}
              </strong>{' '}
              de {batchStats.totalStudents}
            </span>
            {batchStats.avg && (
              <span>
                Promedio actual:{' '}
                <strong className="text-slate-900 dark:text-white font-mono">
                  {batchStats.avg}
                </strong>{' '}
                / 10
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {batchStats.passed} aprobados
            </span>
            {batchStats.failed > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                {batchStats.failed} reprobados
              </span>
            )}
            {batchStats.hasInvalid && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <WarningCircle size={13} weight="bold" />
                Hay valores inválidos
              </span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Estudiante</th>
                <th className="px-4 py-3.5 w-40">Nota (0 - 10)</th>
                <th className="px-4 py-3.5 w-32 text-center">Estado</th>
                <th className="px-4 py-3.5">Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, idx) => {
                const trimmedScore = row.score.trim();
                const numericScore = parseFloat(trimmedScore);
                const isProvided = trimmedScore !== '';
                const isInvalid = isProvided && (isNaN(numericScore) || numericScore < 0 || numericScore > 10);
                const isPassed = isProvided && !isInvalid && numericScore >= PASSING_SCORE;
                const isFailed = isProvided && !isInvalid && numericScore < PASSING_SCORE;

                return (
                  <tr
                    key={row.student.id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {row.student.name.charAt(0)}
                        </div>
                        <div>
                          <span>
                            {row.student.name} {row.student.lastName}
                          </span>
                          <span className="block text-xs font-normal text-muted-foreground">
                            {row.student.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <input
                          ref={(el) => {
                            scoreInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="decimal"
                          placeholder="—"
                          value={row.score}
                          onChange={(e) => handleScoreChange(idx, e.target.value)}
                          onKeyDown={(e) => handleScoreKeyDown(idx, e)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold transition-colors focus:outline-none ${
                            isInvalid
                              ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-100'
                              : 'border-slate-300 bg-white text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                          }`}
                        />
                        {isInvalid && (
                          <span className="absolute right-2.5 top-2 text-[11px] font-medium text-rose-500">
                            0 a 10
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!isProvided ? (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Pendiente
                        </span>
                      ) : isInvalid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          Inválida
                        </span>
                      ) : isPassed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Aprobado
                        </span>
                      ) : isFailed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          Reprobado
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Observación opcional..."
                        value={row.feedback}
                        onChange={(e) => handleFeedbackChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                ↵ Enter
              </kbd>{' '}
              o{' '}
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                ↓
              </kbd>{' '}
              para siguiente alumno
            </span>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check size={16} weight="bold" />
                Notas guardadas
              </span>
            )}
            <button
              type="submit"
              disabled={batchStats.count === 0 || batchStats.hasInvalid}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FloppyDisk size={16} weight="bold" />
              Guardar notas {batchStats.count > 0 ? `(${batchStats.count})` : ''}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const GradeBatchTable = UploadBatchTable;
