import './App.css'
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}

export default App
