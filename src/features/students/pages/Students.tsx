import { Input } from "@/components/ui/input"
import { useState } from "react"

const Students = () => {

    const [search, setSearch] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }    


  const students = [
  {
    nombre: "Diego",
    apellido: "Hernandez",
    materia: "Matemáticas",
    nota: 9,
  },
  {
    nombre: "Carlos",
    apellido: "Perez",
    materia: "Física",
    nota: 8,
  },
    {
    nombre: "Daniela",
    apellido: "Gomez",
    materia: "Química",
    nota: 10,
  },
]

  return (
    <section className="flex flex-1 flex-col gap-3">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Estudiantes
        </h1>
      </div>

      {/* Barra de herramientas */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          placeholder="Buscar estudiante..."
          className="w-full sm:max-w-sm rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          onChange={handleSearch}
        />

        {/* Aquí posteriormente puedes agregar botones */}
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <th className="h-11 px-4 text-sm font-medium">
                Nombre
              </th>

              <th className="h-11 px-4 text-sm font-medium">
                Apellido
              </th>

              <th className="h-11 px-4 text-sm font-medium">
                Materia
              </th>

              <th className="h-11 px-4 text-sm font-medium">
                Mejor nota
              </th>
            </tr>
          </thead>

          <tbody>
            {students.filter((student) =>
              student.nombre.toLowerCase().includes(search) ||
              student.apellido.toLowerCase().includes(search) ||
              student.materia.toLowerCase().includes(search)
            ).map((student) => (
              <tr
                key={student.nombre}
                className="border-b last:border-0 transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {student.nombre}
                </td>

                <td className="px-4 py-3 text-sm">
                  {student.apellido}
                </td>

                <td className="px-4 py-3 text-sm">
                  {student.materia}
                </td>

                <td className="px-4 py-3 text-sm font-medium">
                  {student.nota}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Students