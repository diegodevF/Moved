import { ArrowLeft, House, WarningCircle } from "@phosphor-icons/react"
import { NavLink } from "react-router"

const E404 = () => {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-8 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <WarningCircle size={34} weight="duotone" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Esta página se perdió en el camino
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
          La dirección que buscas no existe o ya no está disponible. Vuelve al
          panel para continuar gestionando tus calificaciones.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <NavLink
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <House size={17} />
            Ir al panel
          </NavLink>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft size={17} />
            Volver atrás
          </button>
        </div>

        <div className="mx-auto mt-16 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="grid size-6 place-items-center rounded-md bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            M
          </span>
          MOVED
        </div>
      </div>
    </main>
  )
}

export default E404