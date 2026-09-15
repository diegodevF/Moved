import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type ThemeContextValue = {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = window.localStorage.getItem("moved-theme")
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    window.localStorage.setItem("moved-theme", isDark ? "dark" : "light")
  }, [isDark])

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme: () => setIsDark((current) => !current),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.")
  }

  return context
}
