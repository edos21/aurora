# Aurora - Lumina Frontend

> **"Amanecer de tu análisis financiero"** 🌅

Frontend de la plataforma Lumina desarrollado con Next.js, TailwindCSS y shadcn/ui. Proporciona una interfaz elegante y moderna para el seguimiento de inversiones personales.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- Spectra backend running on localhost:8000

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

La aplicación estará disponible en:

- **Aurora Frontend**: http://localhost:3000
- **Conexión con Spectra**: http://localhost:8000

## 📁 Project Structure

```
aurora/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── globals.css      # Estilos globales + tema dark
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página principal
│   ├── components/
│   │   └── ui/              # Componentes shadcn/ui
│   └── lib/
│       └── utils.ts         # Utilidades (cn helper)
├── public/                  # Assets estáticos
└── package.json             # Dependencias y scripts
```

## 🎨 Design System

### Stack UI

- **Framework**: Next.js 15 + TypeScript
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui
- **Theme**: Dark mode por defecto 🌙
- **Icons**: Lucide React

### Tema Dark por Defecto

Siguiendo el PRD, Aurora usa dark mode como tema principal:

- **Fondo principal**: Tonos oscuros elegantes
- **Acentos**: Gradientes inspirados en auroras boreales
- **Tipografía**: Geist Sans para legibilidad

## 🛠 Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check

# Type checking
npm run type-check

# Clean cache and dependencies
npm run clean
```

## 🔗 Conexión con Spectra

Aurora se conecta automáticamente con el backend Spectra:

```typescript
// Ejemplo de conexión con health check
const response = await fetch('http://localhost:8000/health')
const data = await response.json()
```

### API Endpoints (Spectra)

- `GET /health` - Health check del backend
- `GET /api/v1/status` - Estado de la API
- `GET /docs` - Documentación Swagger

## 📦 Componentes Incluidos

### shadcn/ui Components

- ✅ `Button` - Botones con variantes
- ✅ `Card` - Tarjetas de contenido
- ✅ `Input` - Campos de entrada
- ✅ `Label` - Etiquetas de formulario
- ✅ `Sonner` - Toast notifications
- ✅ `NavigationMenu` - Navegación principal

### Custom Components (Futuro)

- [ ] `Dashboard` - Panel principal
- [ ] `PortfolioChart` - Gráficos de cartera
- [ ] `AssetCard` - Tarjetas de activos
- [ ] `TransactionForm` - Formulario de transacciones

## 🎯 Roadmap

### ✅ Sprint 0 (Completado)

- Setup inicial Next.js + TypeScript
- Configuración TailwindCSS
- Integración shadcn/ui
- Dark mode por defecto
- Conexión básica con Spectra

### 🔄 Sprint 1 (Siguiente)

- Dashboard principal
- Sistema de navegación
- Formularios básicos
- Gráficos con Recharts
- Estado global con Zustand

## 🤝 Development

Este es el frontend del proyecto Lumina:

- **Frontend**: Aurora (Next.js + shadcn/ui) - Puerto 3000
- **Backend**: Spectra (FastAPI + PostgreSQL) - Puerto 8000

## 📄 License

Private project - Lumina 2024
