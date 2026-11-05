# CI/CD: pruebas, versión y Render

## Un workflow, dos jobs

`.github/workflows/ci-cd.yml` tiene dos entradas: PR hacia **main** (solo controles)
y push a **main** (controles y publicación automática después del merge).
Un push directo a main también lo activa: la protección de rama debe impedirlo.
No usa workflows reutilizables ni pide una versión manual.

1. **checks** corre en ambas entradas. Usa Node de `.nvmrc` (24.22.2),
   npm 11.18.0 solo en el runner
   e instala únicamente `frontend` con `npm ci`. Ejecuta lint, Vitest con
   cobertura/LCOV (7 casos), build y Chromium interno (2 E2E, cero reintentos).
   La suite externa sigue disponible, pero no se instala ni ejecuta en CI.
   Después corre el scanner npm del proyecto y espera el Quality Gate.
   Guarda informes disponibles durante 7 días, incluso si falla un paso.
2. **release-deploy** depende de checks y solo corre por push a main, nunca en PR.
   Usa el environment **production** y es el único job con `contents: write`.
   Dentro del job serializado obtiene historial/tags completos y calcula PATCH
   desde el mayor tag estable numérico `vX.Y.Z`: `v1.0.0` → `v1.0.1`.
   Compara numéricamente (`v1.10.0` supera a `v1.9.0`), ignora tags malformados,
   sin `v`, con ceros iniciales, prereleases o metadata. Sin tags válidos empieza
   en `v1.0.0`. Exporta VERSION para los pasos siguientes; no edita package.json.
   Valida configuración antes de publicar, rechaza colisiones, crea atómicamente
   `vVERSION` y después la GitHub Release verificando ese tag.
   Solicita a Render ese mismo SHA, comprueba la identidad del deploy y espera
   `live` (hasta 60 consultas, separadas 5 s; peticiones con timeout de 15 s).
   Solo entonces exige HTTP 200 en `/` y `/login`, sin seguir redirects.

Checkout, Sonar, tag y Render usan el SHA fijado al iniciar el run, no el último
main. La concurrencia `production-release` evita releases simultáneas sin cancelar
la activa (GitHub puede reemplazar una ejecución pendiente por otra pendiente).
Errores de pruebas, configuración, scanner o gate bloquean checks y la release.
Estados Render fallidos/desconocidos, SHA distinto, timeout o smoke fallido dan error.

## Configurar GitHub y SonarQube Cloud

- Importar el proyecto en SonarQube Cloud, elegir main y desactivar su análisis
  automático. El scanner `@sonar/scan` y `sonar-project.properties` están en el
  proyecto: no se usa plugin/Action de Sonar ni se necesita SonarQube Server.
- Variables del repositorio: **SONAR_PROJECT_KEY**, **SONAR_ORGANIZATION**.
  Secreto del repositorio: **SONAR_TOKEN**, con permiso de análisis.
  El host es `https://sonarcloud.io`; el plan debe permitir analizar esos PR.
  Se usa LCOV y se espera el gate hasta 300 s, sin bajar sus umbrales.
- Los forks no reciben token: se prueban, pero el análisis falla explícitamente
  por falta de configuración. No usamos `pull_request_target`. Revisar el código
  antes de trasladarlo a una rama confiable; limitar quién modifica workflows.
- Proteger main: exigir PR, revisión y el check **checks** de **CI/CD**.
  Confirmar el nombre exacto tras el primer run real antes de elegirlo como
  obligatorio: el YAML por sí solo no configura protección ni impide bypass.
- Configurar environment **production**, restringido a main; reviewers si se desea
  aprobación humana (no se crean automáticamente). Tras configurar los servicios
  y autorizar la publicación, mergear el PR: el push resultante inicia checks y,
  si aprueban, la release y el deploy automáticos.

## Configurar Render Static Site

- Conectar el repositorio, rama main, **Auto-Deploy desactivado** para no eludir CI.
  Root directory: `frontend`; publish directory: `dist`; Node **24.22.2**
  (`NODE_VERSION`). Build: `npm install --global npm@11.18.0 && npm ci && npm run build`.
  Ese cambio de npm es solo del entorno de build, no del equipo local.
- En GitHub/production: secreto **RENDER_API_KEY** y variables **RENDER_SERVICE_ID**
  (`srv-...`) y **RENDER_SITE_URL** (origen HTTPS canónico, sin credenciales,
  puerto, ruta, query ni fragmento). La API key debe poder desplegar ese servicio.
- En el dashboard Render: valores reales **públicos** `VITE_SUPABASE_URL` y
  `VITE_SUPABASE_ANON_KEY`; nunca service-role/private keys. Vite los incluye
  en el bundle. Los valores ficticios de CI no configuran producción.
  Si se utiliza apiClient, configurar `VITE_API_BASE_URL` del backend real;
  su fallback localhost no sirve en producción ni lo verifica el smoke HTTP.
- Rewrite SPA: `/*` → `/index.html`, status **200**. El dominio debe responder
  directamente sin redirect. Se conserva Vercel sin cambios.

## Límites y recuperación

Tag → release → deploy **no es atómico**. Si falla una etapa, las anteriores
pueden quedar publicadas; un timeout también puede dejar un deploy en curso.
No hay rollback ni reintento automático. Reejecutar el job puede asignar otro
PATCH si el intento anterior ya creó un tag. No reutilizar el tag: inspeccionar
Actions/GitHub/Render y decidir recuperación manual, sin mover/borrar versiones
para ocultar fallos. HTTP 200 no prueba backend ni identidad de los bytes servidos.

Prueba local del workflow: `node --test .github/workflows/ci-cd.test.mjs`
(con dependencias de frontend ya instaladas). Ejecuta el cálculo real del YAML
con Git temporal; no publica tags/releases ni llama a Render.

Auditoría aceptada: **9 paquetes afectados (7 moderate, 2 high)**. Los high
proceden del scanner npm → node-forge 1.4.0; conservarlo fue una decisión explícita,
no una corrección de vulnerabilidades ni aprobación de producción. La verificación
independiente anterior de dependencias sigue incompleta. Las comprobaciones
locales/mocks no prueban Actions, Quality Gate, release o deploy reales: falta
configuración y evidencia remota; este documento no autoriza publicar.
