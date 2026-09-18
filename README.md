# React + TypeScript + Vite

Aplicación web construida con React, TypeScript, Vite, Tailwind CSS y componentes de shadcn/ui.

## Requisitos

- [Bun](https://bun.sh/) instalado.
- Node.js no es necesario para instalar las dependencias o ejecutar los scripts del proyecto.

Comprueba la instalación con:

```bash
bun --version
```

## Configurar el proyecto

Clona el repositorio y entra en su carpeta:

```bash
git clone <URL_DEL_REPOSITORIO>
cd moved-2nd
```

Instala las dependencias usando el lockfile de Bun:

```bash
bun install
```

Inicia el servidor de desarrollo:

```bash
bun run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Comandos disponibles

```bash
bun run dev      # Servidor de desarrollo con hot reload
bun run build    # Comprueba TypeScript y crea la versión de producción
bun run preview  # Sirve localmente la versión compilada
bun run lint     # Ejecuta ESLint
```

## Configuración de shadcn/ui

La configuración de shadcn está en [`components.json`](components.json). Este proyecto usa:

- Componentes TypeScript (`tsx: true`).
- Estilos en `src/index.css`.
- Alias `@/components/ui` para los componentes de interfaz.
- Alias `@/lib/utils` para utilidades.
- Iconos de Phosphor.
- Variables CSS para los colores y el tema.

La CLI de shadcn ya está configurada. Para descargar un componente nuevo, ejecuta:

```bash
bunx shadcn@latest add <componente>
```

Por ejemplo:

```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
bunx shadcn@latest add select
```

Los componentes se guardan en `src/components/ui`. Después puedes importarlos usando el alias del proyecto:

```tsx
import { Button } from "@/components/ui/button"
```

Para agregar varios componentes a la vez:

```bash
bunx shadcn@latest add button card dialog input
```

Para consultar los componentes disponibles:

```bash
bunx shadcn@latest add
```

Si se configura shadcn desde cero en otro proyecto Vite con Bun, el comando inicial es:

```bash
bunx shadcn@latest init
```

En este repositorio no necesitas ejecutar `init` otra vez porque `components.json`, Tailwind y los aliases ya están configurados.

## Producción y Netlify

El archivo [`netlify.toml`](netlify.toml) configura Netlify para ejecutar:

```bash
bun run build
```

La carpeta publicada es `dist`. También se incluye un fallback para React Router, de modo que las rutas como `/login`, `/dashboard` y `/students` funcionen al recargar la página.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
