import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  Table,
  UploadSimple,
  ListBullets,
  Plus,
} from '@phosphor-icons/react';
import type { Grade } from '../types/upload';
import {
  getStoredGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  batchCreateGrades,
  calculateGradeStats,
} from '../services/uploadStorage';
import { UploadStats } from '../components/UploadStats';
import { UploadTable } from '../components/UploadTable';
import { UploadBatchTable } from '../components/UploadBatchTable';
import { UploadModal } from '../components/UploadModal';
import { UploadFormModal } from '../components/UploadFormModal';

export const UploadPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'history' | 'batch' | 'upload') || 'history';
  const [activeTab, setActiveTab] = useState<'history' | 'batch' | 'upload'>(initialTab);

  const [grades, setGrades] = useState<Grade[]>(() => getStoredGrades());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState<Grade | null>(null);

  // Sync tab with URL search parameter if it changes
  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'history' | 'batch' | 'upload';
    if (tabParam && (tabParam === 'history' || tabParam === 'batch' || tabParam === 'upload')) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Sync state if storage event occurs
  useEffect(() => {
    const handleStorageUpdate = () => {
      setGrades(getStoredGrades());
    };
    window.addEventListener('moved_grades_updated', handleStorageUpdate);
    return () => window.removeEventListener('moved_grades_updated', handleStorageUpdate);
  }, []);

  const stats = calculateGradeStats(grades);

  const handleTabChange = (tab: 'history' | 'batch' | 'upload') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleCreateOrUpdate = (
    gradeData: Omit<Grade, 'id' | 'status'>,
    idToUpdate?: string
  ) => {
    if (idToUpdate) {
      updateGrade(idToUpdate, gradeData);
    } else {
      createGrade(gradeData);
    }
    setGrades(getStoredGrades());
    setGradeToEdit(null);
  };

  const handleDelete = (id: string) => {
    deleteGrade(id);
    setGrades(getStoredGrades());
  };

  const handleBatchSave = (newGrades: Array<Omit<Grade, 'id' | 'status'>>) => {
    batchCreateGrades(newGrades);
    setGrades(getStoredGrades());
  };

  const handleImportCSV = (csvGrades: Array<Omit<Grade, 'id' | 'status'>>) => {
    batchCreateGrades(csvGrades);
    setGrades(getStoredGrades());
    // Switch to history tab to view imported grades
    setTimeout(() => {
      handleTabChange('history');
    }, 1200);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span>Gestión Académica</span>
            <span>&bull;</span>
            <span>Espacio Docente</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Calificaciones y Cargas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Registra, edita y analiza el rendimiento escolar de tus estudiantes por materia y período.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setGradeToEdit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} weight="bold" />
            Ingresar Nota Individual
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas en Tiempo Real */}
      <UploadStats stats={stats} />

      {/* Selector de Pestañas */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => handleTabChange('history')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition-colors ${activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          <ListBullets size={18} weight={activeTab === 'history' ? 'bold' : 'regular'} />
          Historial y Gestión
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('batch')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition-colors ${activeTab === 'batch'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          <Table size={18} weight={activeTab === 'batch' ? 'bold' : 'regular'} />
          Planilla Rápida de Notas
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('upload')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition-colors ${activeTab === 'upload'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          <UploadSimple size={18} weight={activeTab === 'upload' ? 'bold' : 'regular'} />
          Subir Archivo CSV
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'history' && (
        <UploadTable
          grades={grades}
          onEdit={(g) => {
            setGradeToEdit(g);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          onAddNew={() => {
            setGradeToEdit(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {activeTab === 'batch' && <UploadBatchTable onBatchSave={handleBatchSave} />}

      {activeTab === 'upload' && <UploadModal onImport={handleImportCSV} />}

      {/* Modal para Crear / Editar Calificación */}
      <UploadFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setGradeToEdit(null);
        }}
        onSave={handleCreateOrUpdate}
        gradeToEdit={gradeToEdit}
      />
    </div>
  );
};

export const GradesPage = UploadPage;
export default UploadPage;
