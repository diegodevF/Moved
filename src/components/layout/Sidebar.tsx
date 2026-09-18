import type { CSSProperties } from "react"
import { NavLink } from "react-router"
import { Outlet } from "react-router"
import {
  CaretUpDown,
  ChartBar,
  Gear,
  House,
  Moon,
  Sun,
  Student,
  Trophy,
  UploadSimple,
} from "@phosphor-icons/react"

import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"

const navigationItems = [
  {
    label: "Panel general",
    href: "/dashboard",
    icon: House,
    end: true,
  },
  {
    label: "Calificaciones",
    href: "/upload",
    icon: ChartBar,
  },
  {
    label: "Estudiantes",
    href: "/students",
    icon: Student,
  },
  {
    label: "Configuración",
    href: "/dashboard/settings",
    icon: Gear,
  },
]

const AppSidebar = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <SidebarPrimitive
      variant="inset"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="MOVED"
              render={<NavLink to="/dashboard" />}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                M
              </span>

              <span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  MOVED
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  Espacio docente
                </span>
              </span>

              <CaretUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Gestión académica
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      render={
                        <NavLink
                          to={item.href}
                          end={item.end}
                        />
                      }
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Análisis
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Mejores por materia"
                  render={<NavLink to="/dashboard" />}
                >
                  <Trophy className="text-amber-500" />

                  <span>
                    Mejores por materia
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Subir notas"
                  render={<NavLink to="/upload?tab=batch" />}
                >
                  <UploadSimple />

                  <span>
                    Subir notas
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              onClick={toggleTheme}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? <Sun /> : <Moon />}
              <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Cuenta"
              render={<NavLink to="/dashboard/settings" />}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-orange-400 text-xs font-bold text-white">
                D
              </span>

              <span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  Diego
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  diego@moved.co
                </span>
              </span>

              <CaretUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarPrimitive>
  )
}

const Sidebar = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        } as CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />

          <div className="h-4 w-px bg-border" />

          <span className="text-sm font-medium text-muted-foreground">
            MOVED
          </span>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Sidebar