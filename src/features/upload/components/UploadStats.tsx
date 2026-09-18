import { CheckCircle, WarningCircle, Trophy, Calculator } from '@phosphor-icons/react';
import type { GradeStatsSummary, UploadStatsSummary } from '../types/upload';

interface UploadStatsProps {
  stats: UploadStatsSummary | GradeStatsSummary;
}

export const UploadStats = ({ stats }: UploadStatsProps) => {
  const items = [
    {
      title: 'Promedio General',
      value: stats.totalGrades > 0 ? `${stats.averageScore} / 10` : '—',
      caption: `Calculado sobre ${stats.totalGrades} calificaciones`,
      icon: Calculator,
      color: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400',
    },
    {
      title: 'Tasa de Aprobación',
      value: stats.totalGrades > 0 ? `${stats.passingRate}%` : '—',
      caption: `${stats.passedCount} estudiantes aprobados`,
      icon: CheckCircle,
      color: 'text-blue-500 bg-blue-500/10 dark:text-blue-400',
    },
    {
      title: 'Reprobados',
      value: stats.failedCount,
      caption: stats.failedCount > 0 ? 'Requieren reforzamiento' : 'Sin reprobados',
      icon: WarningCircle,
      color: 'text-rose-500 bg-rose-500/10 dark:text-rose-400',
    },
    {
      title: 'Nota Más Alta',
      value: stats.totalGrades > 0 ? `${stats.topGrade} / 10` : '—',
      caption: 'Puntaje máximo registrado',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-500/10 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.title}
              </span>
              <div className={`grid size-9 place-items-center rounded-lg ${item.color}`}>
                <Icon size={20} weight="duotone" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {item.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const GradeStats = UploadStats;
