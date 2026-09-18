import { useState } from 'react';
import { UploadSimple, DownloadSimple, FileCsv, CheckCircle, WarningCircle, ArrowRight } from '@phosphor-icons/react';
import type { Grade } from '../types/upload';

interface UploadModalProps {
  onImport: (grades: Array<Omit<Grade, 'id' | 'status'>>) => void;
}

interface ParsedRow {
  studentName: string;
  studentLastName: string;
  subject: string;
  evaluationType: string;
  score: number;
  date: string;
  feedback?: string;
  isValid: boolean;
  error?: string;
}

export const UploadModal = ({ onImport }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const downloadSampleTemplate = () => {
    const csvContent =
      'Nombre,Apellido,Materia,Evaluacion,Nota,Fecha,Observacion\n' +
      'Diego,Hernandez,Matemáticas,Parcial 1,9.0,2026-03-10,Excelente examen\n' +
      'Carlos,Perez,Física,Parcial 1,8.5,2026-03-12,Buen rendimiento\n' +
      'Daniela,Gomez,Química,Examen Final,10.0,2026-03-14,Puntaje perfecto\n' +
      'Mateo,Rodriguez,Programación,Proyecto,7.0,2026-03-15,Proyecto completo';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantilla_calificaciones_moved.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.endsWith('.csv') && selected.type !== 'text/csv') {
      setParseError('Por favor selecciona un archivo con extensión .csv');
      return;
    }

    setFile(selected);
    setParseError('');
    setIsSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        parseCSV(text);
      } catch {
        setParseError('Error al leer el archivo. Verifica su codificación UTF-8.');
      }
    };
    reader.readAsText(selected);
  };

  const parseCSV = (content: string) => {
    const lines = content
      .split(/\r\n|\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      setParseError('El archivo CSV está vacío o solo contiene encabezados.');
      setParsedRows([]);
      return;
    }

    const rowsToParse = lines.slice(1);
    const result: ParsedRow[] = [];

    rowsToParse.forEach((line) => {
      // Split by comma or semicolon
      const parts = line.includes(';') ? line.split(';') : line.split(',');
      const cleanParts = parts.map((p) => p.trim().replace(/^["']|["']$/g, ''));

      if (cleanParts.length < 5) {
        result.push({
          studentName: cleanParts[0] || 'Desconocido',
          studentLastName: cleanParts[1] || '',
          subject: cleanParts[2] || '',
          evaluationType: cleanParts[3] || '',
          score: 0,
          date: '',
          isValid: false,
          error: 'Faltan columnas obligatorias (Nombre, Apellido, Materia, Evaluacion, Nota)',
        });
        return;
      }

      const [name, lastName, subject, evalType, rawScore, rawDate, rawFeedback] = cleanParts;
      const numScore = parseFloat(rawScore);
      const isNumValid = !isNaN(numScore) && numScore >= 0 && numScore <= 10;

      result.push({
        studentName: name,
        studentLastName: lastName,
        subject,
        evaluationType: evalType,
        score: isNumValid ? Number(numScore.toFixed(1)) : 0,
        date: rawDate || new Date().toISOString().split('T')[0],
        feedback: rawFeedback || '',
        isValid: isNumValid && name.length > 0 && subject.length > 0,
        error: !isNumValid
          ? 'Nota inválida (debe ser número entre 0.0 y 10.0)'
          : !name || !subject
          ? 'Nombre y materia son obligatorios'
          : undefined,
      });
    });

    setParsedRows(result);
  };

  const handleConfirmImport = () => {
    const validOnes = parsedRows.filter((r) => r.isValid);
    if (validOnes.length === 0) {
      setParseError('No hay registros válidos para importar.');
      return;
    }

    const payload = validOnes.map((r) => ({
      studentId: `std-csv-${Math.random().toString(36).substring(2, 6)}`,
      studentName: r.studentName,
      studentLastName: r.studentLastName,
      subject: r.subject,
      evaluationType: r.evaluationType,
      score: r.score,
      maxScore: 10.0,
      date: r.date,
      feedback: r.feedback,
    }));

    onImport(payload);
    setIsSuccess(true);
    setFile(null);
    setParsedRows([]);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Carga Masiva de Calificaciones (CSV)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sube un archivo de hoja de cálculo en formato CSV para ingresar las notas de múltiples estudiantes a la vez.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <DownloadSimple size={16} className="text-emerald-600 dark:text-emerald-400" />
          Descargar Plantilla CSV
        </button>
      </div>

      {isSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle size={20} className="shrink-0 text-emerald-600" weight="fill" />
          ¡Todas las calificaciones válidas del archivo se han importado correctamente!
        </div>
      )}

      {/* Zona de Drag and Drop / Selector */}
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/20">
        <div className="grid size-12 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <FileCsv size={28} />
        </div>
        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
          {file ? file.name : 'Selecciona o arrastra tu archivo CSV'}
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Asegúrate de que las columnas coincidan: Nombre, Apellido, Materia, Evaluacion, Nota, Fecha, Observacion.
        </p>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors">
          <UploadSimple size={16} />
          Examinar Archivo
          <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {parseError && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <WarningCircle size={18} className="shrink-0 text-rose-600" />
          {parseError}
        </div>
      )}

      {/* Vista previa de los datos parseados */}
      {parsedRows.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Vista previa del archivo ({parsedRows.length} registros)
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {validCount} válidos
              </span>
              {invalidCount > 0 && (
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {invalidCount} con errores
                </span>
              )}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-slate-200 bg-slate-100 font-semibold uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2.5">Estudiante</th>
                  <th className="px-3 py-2.5">Materia</th>
                  <th className="px-3 py-2.5">Evaluación</th>
                  <th className="px-3 py-2.5">Nota</th>
                  <th className="px-3 py-2.5">Fecha</th>
                  <th className="px-3 py-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {parsedRows.map((r, i) => (
                  <tr
                    key={i}
                    className={
                      r.isValid
                        ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        : 'bg-rose-50/50 dark:bg-rose-950/20'
                    }
                  >
                    <td className="px-3 py-2 font-medium">
                      {r.studentName} {r.studentLastName}
                    </td>
                    <td className="px-3 py-2">{r.subject}</td>
                    <td className="px-3 py-2">{r.evaluationType}</td>
                    <td className="px-3 py-2 font-bold">{r.score}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.date}</td>
                    <td className="px-3 py-2">
                      {r.isValid ? (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Listo
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          {r.error}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setParsedRows([]);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={validCount === 0}
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              Importar {validCount} Calificaciones <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const GradeUploadModal = UploadModal;
