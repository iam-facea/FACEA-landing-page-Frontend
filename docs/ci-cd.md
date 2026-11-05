# CI, release manual y Render

## Qué se ejecuta

`.github/workflows/ci.yml` corre en PR hacia `develop`/`main`, push a esas
ramas y mediante `workflow_call`. Usa Node de `.nvmrc` (24.22.2), npm 11.18.0,
ambos locks, lint, Vitest con V8/LCOV, build y las suites Chromium existentes
(2 internas y 3 externas). Cada paquete instala su propia revisión de Chromium.
La suite externa corre desde `e2e-tests/` contra el build servido por Vite
preview, con `BASE_URL`, espera acotada y limpieza del proceso al terminar.
Los valores Supabase de CI son públicos y ficticios; nunca usar una service-role
key ni credenciales de producción. Las pruebas interceptan los flujos remotos.
Los informes disponibles se conservan 7 días incluso cuando falla un paso.

## Configuración del repositorio

1. Crear/importar el proyecto en SonarQube Cloud y desactivar el análisis
   automático: el análisis lo ejecuta el scanner npm integrado, no una Action
   de Sonar. Configurar `main` como rama principal del proyecto.
2. En GitHub Actions, definir las variables `SONAR_PROJECT_KEY` y
   `SONAR_ORGANIZATION`, y el secreto `SONAR_TOKEN` con permiso de análisis.
   El host es `https://sonarcloud.io`; no se necesita SonarQube Server.
   El plan de Cloud debe admitir las ramas/PR que se quieran analizar.
3. Configurar el Quality Gate de Cloud según la política del equipo. El scanner
   espera hasta 300 segundos: gate rojo, timeout, error o configuración ausente
   hacen fallar CI. No se reducen umbrales ni se oculta código fuente para pasar.
4. Proteger `develop` y `main`: exigir PR, revisión y el check de este workflow
   `checks` (normalmente mostrado como `CI / checks`). Confirmar el nombre exacto
   en el primer run antes de seleccionarlo en las reglas. No permitir bypass
   para publicar una release sin análisis aprobado.

### PR de forks y confianza

No se usa `pull_request_target`. Un PR de fork ejecuta las pruebas sin token
Sonar; el paso de análisis falla explícitamente y `checks` queda rojo, no verde
por omisión del análisis. No proporcionar secretos al fork ni ejecutar su código
con secretos desde otro evento. Para integrar una contribución, revisar primero
el código y trasladar el commit aprobado a una rama confiable del repositorio;
allí repetir CI con análisis antes de mergear. Solo ramas/PR del mismo repositorio
considerados confiables pueden usar `SONAR_TOKEN`. Restringir quién puede crear
ramas y modificar workflows; los secretos no son una sandbox para código hostil.

### Release manual desde main

`.github/workflows/release.yml` ejecuta esta secuencia, sin atomicidad:

1. **Preflight** exige `refs/heads/main` antes de checkout/CI. Valida una versión
   `MAJOR.MINOR.PATCH` sin `v`, ceros iniciales, prerelease ni metadata (ejemplo:
   `1.0.0`) y comprueba que no exista `v1.0.0`. No hace escrituras remotas.
2. **Checks** llama `./.github/workflows/ci.yml` con `ref: ${{ github.sha }}` y
   mapeo explícito de `SONAR_TOKEN`. Solo acepta el SHA completo del caller.
   Checkout, build y revisión SCM de Sonar usan ese SHA, no el último main.
   CI incluye `node --test scripts/*.test.mjs` antes del scanner.
3. **Publish**, solo si checks pasó, repite la comprobación del tag y crea el
   tag y GitHub Release para ese SHA. Solo este job tiene `contents: write`.
4. **Deploy**, solo si publish pasó, solicita a Render `commitId` igual a ese
   SHA. Valida `commit.id` e identidad del deploy al crearlo y en cada consulta.
   Solo `live` permite los HTTP smoke checks de `/` y `/login`; estados fallidos,
   desconocidos, errores HTTP o identidad incorrecta fallan cerrado.

La concurrencia `production-release` serializa el flujo sin cancelar un run
activo (GitHub puede reemplazar un run pendiente por otro pendiente). Las peticiones
usan timeout de 10 segundos, sin redirects; se permiten hasta 60 consultas con
5 segundos de espera. El job de deploy tiene límite de 20 minutos. Los errores
no imprimen tokens ni cuerpos remotos. El sitio se toma de `RENDER_SITE_URL`,
no de una URL descubierta por la API.

Si el tag se crea pero falla GitHub Release, el tag queda. Si falla Render o
smoke, la release queda publicada y el deploy puede haber ocurrido; incluso un
timeout puede dejar una operación remota en curso. No hay rollback ni reintento
automático. No reutilizar la versión mediante un nuevo dispatch: el tag existente
la bloquea. Inspeccionar Actions/GitHub/Render y decidir la recuperación manual;
no borrar o mover tags publicados para ocultar el fallo. Smoke solo prueba HTTP:
no demuestra funcionalidad del backend ni que los bytes servidos sean ese SHA.

### Preparación y ejecución humana (no realizadas por este cambio)

- Mergear primero los workflows en la rama por defecto: GitHub requiere que el
  archivo de `workflow_dispatch` exista allí para mostrar la ejecución manual.
  La rama de producción elegida es `main`; seleccionar otra rama falla preflight.
- En GitHub, crear/configurar el environment **production**, restringirlo a main
  y, si se desea aprobación humana, añadir required reviewers y evitar autoaprobación
  según el plan disponible. Declarar `environment: production` no configura esas
  protecciones automáticamente. Publish y deploy usan ese environment y pueden
  requerir aprobación por separado. Sin reviewers configurados no hay pausa humana.
- `SONAR_TOKEN` debe ser un secreto del repositorio accesible al reusable CI;
  `SONAR_PROJECT_KEY` y `SONAR_ORGANIZATION`, variables del repositorio.
  `SONAR_HOST_URL` se fija a `https://sonarcloud.io` en CI.
- En production, definir secreto `RENDER_API_KEY` con acceso al servicio y variables
  `RENDER_SERVICE_ID` (`srv-...`) y `RENDER_SITE_URL` (origen HTTPS público canónico,
  sin ruta, query o credenciales). No pegar secretos en chat, logs ni archivos.
- Proteger main con PR/revisión/checks. El reusable puede mostrarse como
  `checks / checks` bajo Release, distinto del check de CI directo; confirmar los
  nombres exactos tras el primer run real antes de seleccionar checks obligatorios.
- Cuando se autorice publicar, abrir Actions → Release → Run workflow, seleccionar
  **main**, escribir por ejemplo `1.0.0` y ejecutar. Revisar SHA, resultados del
  Quality Gate, aprobaciones configuradas y logs. Mover main durante el run no
  cambia el SHA publicado/desplegado. Este documento no autoriza ejecutar ahora.

### Render Static Site

1. Conectar el repositorio y crear un **Static Site** con rama Git **main**.
   **Desactivar Auto-Deploy** antes de usar este flujo: de otro modo un push puede
   desplegar sin esperar checks. La API key debe poder desplegar el servicio.
2. Root directory: `frontend`. Node **24.22.2** (por ejemplo variable Render
   `NODE_VERSION=24.22.2`). Build command:
   `npm install --global npm@11.18.0 && npm ci && npm run build`.
   Publish directory: `dist`. Confirmar Node/npm en el primer build real;
   `.nvmrc` vive en la raíz y no sustituye comprobar la configuración del servicio.
3. En Render configurar para el build los valores reales y **públicos**
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Nunca service-role/private keys:
   Vite incorpora estos valores al bundle. Los datos ficticios de CI no configuran
   producción. Si se usan llamadas de `frontend/src/services/apiClient.ts`, configurar
   también `VITE_API_BASE_URL` para el backend real: su fallback `http://localhost:5107`
   no es un backend de producción ni se valida con los smoke checks.
4. Añadir rewrite SPA: source `/*`, destination `/index.html`, status **200**.
   Configurar `RENDER_SITE_URL` con el dominio canónico que responda sin redirect.
   Se comprobarán `/` y `/login` después del estado live.

No se modificó Vercel. IDs, permisos, disponibilidad de commitId en el servicio,
versión de runtime, build real, dominio/rewrite, secretos y protecciones requieren
comprobación humana/remota; ninguna prueba mock acredita un deploy real.

## Uso y evidencia local

Desde la raíz, con Node24/npm11 activos:

```sh
npm ci --prefix frontend
npm run test:coverage --prefix frontend
npm run sonar --prefix frontend -- -Dsonar.projectKey=CLAVE -Dsonar.organization=ORG
```

Para analizar, exportar `SONAR_TOKEN` y `SONAR_HOST_URL=https://sonarcloud.io`
sin guardarlos en archivos versionados. El script `sonar` cambia explícitamente
a la raíz y usa el CLI instalado en frontend con `sonar.projectBaseDir=.`;
`sonar-project.properties` separa fuentes/pruebas y lee
`frontend/coverage/lcov.info`. `npm run sonar --prefix frontend -- --help`
solo comprueba el CLI local. No equivale a analizar ni aprobar el Quality Gate.

La validación local pasó lint, 7 casos Vitest con LCOV no vacío, build y los
2+3 E2E sin cambiar pruebas. Cobertura de líneas observada: 14.55%; no representa
un gate remoto aprobado. Scanner fijado: `@sonar/scan` 5.0.2; V8 4.1.12 coincide
con Vitest 4.1.12. Auditoría completa actual: **9 paquetes afectados (7 moderate,
2 high)**, exit 1. Los high se incorporan por `@sonar/scan` → `node-forge` 1.4.0;
el usuario aceptó explícitamente **conservar el scanner npm junto con los riesgos
explícitos**. Esto suma a la aceptación provisional de los 7 moderate anteriores;
no resuelve vulnerabilidades ni equivale a aprobación de producción.
La verificación independiente anterior sigue incompleta. No se ejecutaron
Actions, análisis/gate de Cloud, releases ni despliegues remotos; faltan cuenta,
variables, secreto y evidencia real. Se conserva Vercel sin cambios.
