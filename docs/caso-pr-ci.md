# CI-PR-01: demostrar controles con un pull request

## Objetivo

Mostrar al profesor cómo un PR de `feat/cicd-workflows` hacia `main` en
`iam-facea/FACEA-landing-page-Frontend` activa **CI/CD** y valida el frontend.
Este caso solo demuestra controles: **no mergear ni desplegar durante la demo**.
Complementa la [guía de CI/CD](ci-cd.md), sin cambiar la aplicación.

## Precondiciones

- La rama `feat/cicd-workflows` está publicada y contiene el workflow
  `.github/workflows/ci-cd.yml`; el PR debe apuntar a `main` en el mismo repositorio.
- GitHub Actions está habilitado y quien presenta puede ver runs, logs y artifacts.
- Se reportaron configurados el secreto `SONAR_TOKEN` y las variables públicas
  `SONAR_PROJECT_KEY` y `SONAR_ORGANIZATION`; verificar su disponibilidad sin
  mostrar ni copiar el token. SonarQube Cloud tiene el análisis automático apagado.
- El proyecto/plan de Sonar debe permitir analizar este PR y aprobar su Quality Gate.
- Las dependencias de `frontend` están fijadas por `package-lock.json`;
  CI usa Node de `.nvmrc` y npm 11.18.0, sin actualizar dependencias para la demo.
- El job de PR no necesita secretos de despliegue como `RENDER_API_KEY`;
  sí necesita `SONAR_TOKEN`. No usar un PR de fork: no recibe ese secreto.
- Mantener Render con Auto-Deploy desactivado, según la guía de configuración.

## Pasos

1. Abrir **un** PR en el repositorio indicado: base `main`, compare
   `feat/cicd-workflows`. Si ya existe ese PR, usarlo en lugar de duplicarlo.
   En la descripción se puede enlazar este documento. No activar auto-merge.
2. Copiar la URL del PR en la tabla de evidencia. No pulsar **Merge**.
3. Desde los checks del PR o la pestaña **Actions**, abrir el run **CI/CD**
   correspondiente al evento `pull_request`; registrar su URL y SHA comprobado.
   En PR, `github.sha` suele identificar el merge sintético, no el HEAD de la rama.
4. Mostrar los logs de **checks**, paso **Instalar y probar frontend**:
   `npm ci`, `npm run lint`, `npm run test:coverage` (7 casos Vitest),
   `npm run build` y `npm run test:e2e -- --retries=0 --reporter=list`
   (2 casos internos de Chromium). CI instala Chromium antes de los E2E.
5. Mostrar **SonarQube Cloud y Quality Gate**: usa el scanner npm del proyecto,
   carga LCOV y espera el resultado del gate. Registrar el resultado real y,
   si está disponible, el enlace al análisis de Sonar.
6. Al finalizar, registrar las conclusiones de ambos jobs. Mostrar
   **release-deploy** como **skipped**: el evento es PR, no push a `main`.
7. En el resumen del run, buscar el artifact **informes** y abrirlo/descargarlo
   si existe. Contiene cobertura y/o resultados disponibles; se conserva 7 días.
   Si no se generaron archivos, puede no existir: registrar esa ausencia.
8. Completar la evidencia con lo observado y dejar el PR sin mergear.
   No crear tags, releases ni solicitar despliegues como parte de este caso.

## Resultados esperados

- **checks** termina en **success** solo si pasan los controles reales y Sonar
  aprueba el Quality Gate; no se garantiza un resultado verde de antemano.
- **release-deploy** queda **skipped**, que es el resultado correcto para un PR.
  Este PR no causa un nuevo tag, GitHub Release ni despliegue en Render.
- El caso se aprueba únicamente con evidencia observada de esos resultados.
  Un fallo de instalación, pruebas, scanner, permisos o gate es diagnóstico válido:
  registrar paso y error; no inventar éxito ni debilitar umbrales del Quality Gate.

## Evidencia

| Dato | Valor observado |
| --- | --- |
| URL del PR | Pendiente ejecución real |
| URL del run CI/CD | Pendiente ejecución real |
| SHA comprobado por el run | Pendiente ejecución real |
| Conclusión de checks | Pendiente ejecución real |
| Conclusión de release-deploy | Pendiente ejecución real |
| Artifact informes (enlace o ausencia) | Pendiente ejecución real |
| Resultado/enlace de Sonar y Quality Gate | Pendiente ejecución real |

## Límites

No se modifica el frontend React ni Supabase. Los E2E son internos,
con configuración ficticia de CI; no demuestran autenticación ni backend reales.
Un HTTP 200 del sitio público Render tampoco demuestra pruebas ni autenticación.
No se ejecuta la suite externa ni se agregan cambios ficticios o fallos intencionales.

**Caso futuro opcional, fuera de esta demo y sujeto a autorización separada:**
un merge que produzca push a `main` inicia controles y, solo si aprueban, el flujo
PATCH/tag/release/Render. Este documento no autoriza ese merge ni su despliegue.
