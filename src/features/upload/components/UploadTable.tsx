import { useState, useMemo } from 'react';
import {
  MagnifyingGlass,
  Funnel,
  PencilSimple,
  Trash,
  DownloadSimple,
  Plus,
  ChatCircleText,
} from '@phosphor-icons/react';
import type { Grade } from '../types/upload';
import { SUBJECTS, PASSING_SCORE } from '../services/uploadStorage';

interface UploadTableProps {
  grades: Grade[];
  onEdit: (grade: Grade) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const UploadTable = ({ grades, onEdit, onDelete, onAddNew }: UploadTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'aprobado' | 'reprobado'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredGrades = useMemo(() => {
    return grades
      .filter((g) => {
        const matchesSearch =
          g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.studentLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.evaluationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (g.feedback && g.feedback.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSubject = selectedSubject === 'all' || g.subject === selectedSubject;
        const matchesStatus = selectedStatus === 'all' || g.status === selectedStatus;

        return matchesSearch && matchesSubject && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'date') {
          comp = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'score') {
          comp = a.score - b.score;
        } else if (sortBy === 'name') {
          comp = `${a.studentLastName} ${a.studentName}`.localeCompare(
            `${b.studentLastName} ${b.studentName}`
          );
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [grades, searchTerm, selectedSubject, selectedStatus, sortBy, sortOrder]);

  const handleExportCSV = () => {
    if (filteredGrades.length === 0) return;
    const header = 'Estudiante,Apellido,Materia,Evaluación,Nota,Máximo,Estado,Fecha,Observaciones\n';
    const rows = filteredGrades
      .map(
        (g) =>
          `"${g.studentName}","${g.studentLastName}","${g.subject}","${g.evaluationType}",${g.score},${g.maxScore},"${g.status}","${g.date}","${g.feedback || ''}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calificaciones_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Controles superiores */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Historial de Calificaciones
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consulta, filtra, edita o exporta las notas registradas de tus alumnos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredGrades.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
          >
            <DownloadSimple size={15} />
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Plus size={15} weight="bold" />
            Nueva Calificación
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por alumno o tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-slate-400 shrink-0" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">Todas las materias</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as 'all' | 'aprobado' | 'reprobado')
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="aprobado">Solo aprobados (&ge; {PASSING_SCORE})</option>
            <option value="reprobado">Solo reprobados (&lt; {PASSING_SCORE})</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb as 'date' | 'score' | 'name');
              setSortOrder(so as 'asc' | 'desc');
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="date-desc">Más recientes primero</option>
            <option value="date-asc">Más antiguas primero</option>
            <option value="score-desc">Mayor nota primero</option>
            <option value="score-asc">Menor nota primero</option>
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Tabla de Calificaciones */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3.5">Estudiante</th>
              <th className="px-4 py-3.5">Materia</th>
              <th className="px-4 py-3.5">Evaluación</th>
              <th className="px-4 py-3.5 text-center">Nota</th>
              <th className="px-4 py-3.5 text-center">Estado</th>
              <th className="px-4 py-3.5">Fecha</th>
              <th className="px-4 py-3.5">Observación</th>
              <th className="px-4 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredGrades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No se encontraron calificaciones con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredGrades.map((grade) => (
                <tr
                  key={grade.id}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {grade.studentName.charAt(0)}
                      </div>
                      <span>
                        {grade.studentName} {grade.studentLastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {grade.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
                    {grade.evaluationType}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                    <span
                      className={`inline-block min-w-[2.5rem] rounded px-1.5 py-0.5 text-xs font-black ${
                        grade.score >= PASSING_SCORE
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}
                    >
                      {grade.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {grade.status === 'aprobado' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Aprobado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        Reprobado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {grade.date}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                    {grade.feedback ? (
                      <span className="flex items-center gap-1" title={grade.feedback}>
                        <ChatCircleText size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">{grade.feedback}</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(grade)}
                        title="Editar calificación"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-colors"
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `¿Eliminar la calificación de ${grade.studentName} en ${grade.subject}?`
                            )
                          ) {
                            onDelete(grade.id);
                          }
                        }}
                        title="Eliminar calificación"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const GradesTable = UploadTable;
