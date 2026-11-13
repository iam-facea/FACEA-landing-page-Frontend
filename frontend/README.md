# FACEA — frontend

Aplicación React + TypeScript con Vite y Supabase.

## Runtime e instalación

Usar **Node 24.22.2 LTS**, fijado en `../.nvmrc`. `engines.node` admite
parches posteriores de Node24 (`>=24.22.2 <25`), no Node23 ni Node25.
La validación de dependencias se realizó con **npm 11.18.0** bajo Node24.
No se necesita cambiar el Node global para usar un runtime local.

Desde `frontend/`, con ese runtime activo:

```sh
node --version # v24.22.2
npm --version  # 11.18.0
npm ci
npm run dev
```

### Windows: reutilizar el runtime local ya descargado

En PowerShell, desde la raíz del repositorio, estos comandos reutilizan la
caché ignorada existente, sin instalaciones externas ni cambios globales:

```powershell
$Root = (Get-Location).Path
$Cache = Join-Path $Root 'node_modules/.cache/npm'
$Node24 = Join-Path $Cache '_npx/e524fa135108820b/node_modules/node/bin/node.exe'
$NpmCli = Join-Path $Cache '_npx/531a256430e91eb0/node_modules/npm/bin/npm-cli.js'
$env:npm_config_cache = $Cache
$env:PATH = (Split-Path $Node24) + ';' + $env:PATH
function npm24 { & $Node24 $NpmCli @args }
& $Node24 --version
& $Node24 -e 'require("node:child_process").spawnSync("node", ["--version"], {stdio:"inherit"})'
npm24 --version
Set-Location frontend
npm24 ci
```

Ambas comprobaciones de Node deben mostrar `v24.22.2`. Los identificadores
`_npx` corresponden a esta descarga local; no son rutas portables a otra
máquina ni archivos versionados. No colocar el runtime dentro de
`frontend/node_modules`: `npm ci` intenta borrarlo y Windows rechaza eliminar
el `node.exe` activo. La caché raíz sobrevive a las instalaciones de ambos paquetes.

## Comandos

Desde `frontend/`, usando `npm24` en lugar de `npm` si se sigue el ejemplo local:

| Comando | Propósito |
| --- | --- |
| `npm run dev` | Servidor Vite de desarrollo |
| `npm run lint` | ESLint |
| `npm test` | Vitest, una ejecución |
| `npm run build` | TypeScript y bundle de producción en `dist/` |
| `npm run preview` | Vista previa del build |
| `npm run test:e2e -- --retries=0 --reporter=list` | E2E interno; inicia Vite automáticamente |
| `npm run test:e2e:ui` | Interfaz interactiva Playwright |
| `npm audit --json` | Auditoría completa, incluidas herramientas |
| `npm audit --omit=dev --json` | Auditoría sin devDependencies |

La suite externa conserva su propio lock en `../e2e-tests/`. Primero ejecutar
`npm ci` allí bajo Node24. Requiere Chromium de Playwright disponible localmente.
Para repetirla, iniciar desde `frontend/` en una terminal:

```sh
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

En otra terminal con el mismo runtime, desde `e2e-tests/`:

```powershell
$env:BASE_URL = 'http://127.0.0.1:5187'
npm24 test -- --retries=0 --reporter=list
```

Detener el servidor con Ctrl+C al terminar; no necesita backend real para los
flujos interceptados por estas pruebas.

## Actualización de seguridad y evidencia local

Se actualizaron React Router DOM/Router **7.15.0 → 7.18.5**, Vitest
**3.2.7 → 4.1.12**, Vite **8.0.8 → 8.3.5**, PostCSS **8.5.10 → 8.5.32** y
typescript-eslint **8.58.1 → 8.72.1** (versiones resueltas en el lock).
Vitest4 admite Vite8 y elimina tinypool y los Vite7 anidados vulnerables.
También se actualizaron transitivas vulnerables dentro de sus rangos existentes.
No se reclasificó Tailwind para esconder herramientas de la auditoría de producción.
No se usaron `audit fix --force`, downgrades ni overrides de majors transitivas.

Resultado observado bajo Node24: instalación limpia inicial de ambos paquetes
y repetida en frontend con el lock actualizado. Antes y después pasaron lint,
**7 casos Vitest**, **2 E2E internos**, **3 E2E externos** y build; ninguna prueba
se cambió, omitió o deshabilitó. El servidor temporal usado para la suite externa
se detuvo en ambos recorridos.

- Auditoría completa: **23 → 7** paquetes afectados; ahora **0 low, 7 moderate,
  0 high, 0 critical**. Sigue devolviendo exit 1: no es una auditoría limpia.
- Auditoría `--omit=dev`: **6 → 0** según la referencia inicial y la auditoría final.
- Los 7 avisos restantes proceden de `minimatch@10.2.6`
  ([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249))
  y sus dependientes de typescript-eslint. La versión 8.72.1 aún requiere
  `minimatch ^10.2.2`; la corrección publicada comienza en 11.0.1. Se conserva
  este residual en vez de forzar una major fuera del rango o aceptar el downgrade
  de typescript-eslint que sugiere audit.
- npm10.9.2 falló durante `npm install` con `Cannot read properties of null
  (reading 'edgesOut')`; npm11.18.0 resolvió la instalación sin alterar los peers.
- Vitest pasa con una advertencia de Vite sobre el import sin extensión en
  `vitest.config.ts`, relevante para un futuro loader nativo. Se conservó la
  configuración actual y su integración con `vite.config.ts`.

Esta evidencia es local; no verifica despliegues, servicios remotos reales ni
otras plataformas/navegadores, y no implica que exista CI configurada.
