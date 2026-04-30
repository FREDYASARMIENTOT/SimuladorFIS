# Simulador FIS

Aplicación React + Vite para simular la utilidad dinámica de un sistema humano-IA usando el modelo FIS:

```text
dU/dt = α·(λ·O) - (σ·S + μ·R + φ·Cc)
```

El panel permite evaluar cómo la calidad del dato, la sinergia humano-IA y las penalizaciones por sicofancia, fricción y coordinación afectan la utilidad instantánea `dU/dt` y la utilidad acumulada `Ut`.

## Qué Mide El Simulador

- `O`: Calidad del dato. Representa eficiencia, precisión, trazabilidad, ausencia de redundancias y adherencia al modelo ABC.
- `α`: Sinergia humano-IA. Representa transparencia XAI, autonomía equilibrada y calidad del flujo humano.
- `S`: Sicofancia. Penaliza complacencia, falta de crítica e independencia baja.
- `R`: Fricción operativa. Penaliza repeticiones, carga de supervisión y costo de recursos.
- `Cc`: Coordinación contextual. Penaliza latencia y pérdida de efectividad de memoria.
- `λ`: Peso de eficiencia aplicado a `O`.
- `σ`: Peso de penalización por sicofancia.
- `μ`: Peso de penalización por fricción.
- `φ`: Peso de penalización por coordinación.

## Fórmulas

### Derivada

```text
dU/dt = α·(λ·O) - (σ·S + μ·R + φ·Cc)
```

Paso a paso:

1. Calcular la ganancia positiva:

```text
Ganancia = α·(λ·O)
```

2. Calcular las pérdidas:

```text
Pérdidas = σ·S + μ·R + φ·Cc
```

3. Restar pérdidas a ganancias:

```text
dU/dt = Ganancia - Pérdidas
```

### Integral

```text
Ut = Ut-1 + dU/dt
```

La integral `Ut` acumula la utilidad histórica. Cada iteración suma su velocidad instantánea `dU/dt` al stock anterior.

## Requisitos

Antes de ejecutar la aplicación necesitas tener instalado:

- Node.js
- npm
- Git, opcional si vas a clonar o publicar cambios

Puedes verificar Node y npm desde una terminal:

```powershell
node --version
npm --version
```

## Ejecutar La Aplicación Desde Terminal

### 1. Abrir La Terminal

En Windows puedes usar cualquiera de estas opciones:

- PowerShell
- Windows Terminal
- Terminal integrada de VS Code

### 2. Ir A La Carpeta Del Proyecto

Ejecuta:

```powershell
cd D:\CodexChatgpt\Project1
```

Si clonaste el repositorio en otra ubicación, entra a esa carpeta. Por ejemplo:

```powershell
cd C:\ruta\donde\clonaste\SimuladorFIS
```

### 3. Instalar Dependencias

Ejecuta:

```powershell
npm install
```

En algunos equipos Windows, PowerShell puede bloquear `npm.ps1`. Si ocurre, usa:

```powershell
npm.cmd install
```

### 4. Ejecutar En Localhost

Para levantar la aplicación en el puerto `5173`, ejecuta:

```powershell
npm run dev -- --port 5173
```

Si PowerShell bloquea `npm`, usa:

```powershell
npm.cmd run dev -- --port 5173
```

### 5. Abrir En El Navegador

Cuando Vite arranque, abre:

```text
http://localhost:5173/
```

También puedes copiar esa dirección y pegarla en Chrome, Edge o el navegador integrado.

## Build De Producción

Para compilar la aplicación:

```powershell
npm run build
```

O en Windows con `npm.cmd`:

```powershell
npm.cmd run build
```

El resultado se genera en la carpeta:

```text
dist/
```

## Vista Previa Del Build

Después de compilar, puedes previsualizar el build con:

```powershell
npm run preview -- --port 4173
```

O:

```powershell
npm.cmd run preview -- --port 4173
```

Luego abre:

```text
http://localhost:4173/
```

## Flujo Rápido

Si ya tienes dependencias instaladas:

```powershell
cd D:\CodexChatgpt\Project1
npm.cmd run dev -- --port 5173
```

Después abre:

```text
http://localhost:5173/
```

## Estructura Del Proyecto

```text
.
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── src
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Scripts Disponibles

- `npm run dev`: ejecuta el servidor local de Vite.
- `npm run build`: compila la aplicación para producción.
- `npm run preview`: previsualiza el build de producción.

## Repositorio

Repositorio GitHub:

```text
https://github.com/FREDYASARMIENTOT/SimuladorFIS
```
