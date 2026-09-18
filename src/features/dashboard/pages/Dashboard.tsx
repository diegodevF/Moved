import { useState, useEffect } from "react"
import { Link } from "react-router"
import { ArrowUpRight, Book, Student, ChartLineUp } from "@phosphor-icons/react"
import { getStoredGrades, calculateGradeStats, DEFAULT_STUDENTS, SUBJECTS } from "@/features/upload/services/uploadStorage"

const Dashboard = () => {
  const [grades, setGrades] = useState(() => getStoredGrades())

  useEffect(() => {
    const handleUpdate = () => setGrades(getStoredGrades())
    window.addEventListener('moved_grades_updated', handleUpdate)
    return () => window.removeEventListener('moved_grades_updated', handleUpdate)
  }, [])

  const stats = calculateGradeStats(grades)
  const uniqueSubjects = new Set(grades.map(g => g.subject)).size || SUBJECTS.length
  const uniqueStudents = new Set(grades.map(g => `${g.studentName} ${g.studentLastName}`)).size || DEFAULT_STUDENTS.length

  return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-950/10 sm:p-10">
          <div className="relative z-10 max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Bienvenido a MOVED</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Aqui podras agregar, eliminar, actualizar o consultar las notas de tus estudiantes y destacar al mejor estudiante de cada materia.
            </p>
          </div>
          <div className="absolute -right-16 -top-24 size-72 rounded-full border border-emerald-400/20 bg-emerald-400/10" />
          <div className="absolute -bottom-36 right-24 size-72 rounded-full border border-white/10" />
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Estudiantes activos", value: `${uniqueStudents}`, icon: Student, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Materias registradas", value: `${uniqueSubjects}`, icon: Book, color: "text-blue-600 dark:text-blue-400" },
            { label: "Promedio general", value: stats.totalGrades > 0 ? `${stats.averageScore} / 10` : "Sin notas", icon: ChartLineUp, color: "text-amber-600 dark:text-amber-400" },
          ].map((stat) => {
            const Icon = stat.icon

            return (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <Icon className={`mb-5 size-5 ${stat.color}`} weight="duotone" />
                <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Acción rápida</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Gestión y Carga de Calificaciones</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ingresa notas mediante planilla rápida o importa archivos CSV de tus cursos.</p>
            </div>
            <Link
              to="/upload"
              className="hidden shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 sm:flex"
            >
              Ir a Calificaciones <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </div>
  )
}

export default Dashboard