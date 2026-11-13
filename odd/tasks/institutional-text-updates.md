# Institutional Text Updates

## Objective
Apply the institutional review text changes (Misión, Escuela Sabática, Grupos Faros) and replace the «Grupos de Oración» card with «Eventos Sociales» in the «Nuestra Vida Universitaria» section, including its photograph once the user supplies it.

## Scope
- Update only `frontend/src/components/home/AboutUs.tsx`.
- Misión: new description supplied verbatim by the user.
- Escuela Sabática: new description supplied verbatim by the user.
- Grupos Faros: new description supplied verbatim by the user.
- «Grupos de Oración» card → title «Eventos Sociales», new description, updated alt text.
- Card image replacement pending: the new photograph is NOT in the project root; waiting for the user-provided source path. No alternative image may be invented.

## Constraints
- No other institutional texts change.
- «Quiénes Somos», «Visión», «Valores», «Nuestros Departamentos», and the Hero stay intact.
- No design, color, typography, size, layout, or responsive-behavior changes.
- The only authorized visual change is the «Eventos Sociales» card photograph.
- No backend/Supabase or dynamic-content changes; no refactors.
- Unrelated uncommitted `.gitignore` change (`.atl/`) stays untouched and uncommitted.

## Delivery
- Branch: `chore/institutional-text-updates` (from up-to-date `develop`).
- Routing: inline direct — single source file, exact replacement strings, no design decisions (below all delegation triggers).

## Test mode
- Ordinary checks: `npm run lint` and `npm run build` from `frontend/`.
- Final check: structural readback of the diff; runtime responsive inspection left to the user or a follow-up verification task.

## Tasks
- [x] **TEXT-01 — Update the three institutional descriptions**
  - Misión, Escuela Sabática, and Grupos Faros texts replaced verbatim.
  - Acceptance: diff touches only those three text strings.
- [x] **TEXT-02 — Rename «Grupos de Oración» card to «Eventos Sociales»**
  - Title, description, alt text, and section comment updated; image reference unchanged until the new asset arrives.
  - Acceptance: markup, classes, overlay, dimensions, and responsive behavior unchanged.
- [x] **IMAGE-01 — Replace the «Eventos Sociales» card photograph**
  - Source: `IMG-20260323-WA0063.jpg` from `C:\000 MIS COSAS NUEVAS\FACEA\Multimedia\FOTOS FACEA IMPRIMIR` (user path had an extra `imagen` suffix; the real folder holds both exact filenames).
  - Copied (not moved) into `frontend/src/assets/images/`; import/reference swapped; display format unchanged.
- [x] **IMAGE-02 — Replace the «Grupos Faros» card photograph**
  - Source: `IMG_1225.jpg` from the same folder; copied into `frontend/src/assets/images/`; `comisionFaros` import repointed; title, description, and design unchanged.
- [x] **VERIFY-01 — Lint, build, and structural readback of the committed text work unit**
- [x] **DEPT-01 — Rename the «Nuestros Departamentos» card to «Nuestro equipo»**
  - New title and description verbatim from the user; alt text and section comment follow the card identity.
  - Acceptance: markup, classes, overlay, dimensions, and responsive behavior unchanged.
- [x] **DEPT-02 — Replace the card photograph with `Nuestro equipo.jpeg`**
  - Source: same institutional multimedia folder (real name `FOTOS FACEA IMPRIMIR`); copy into `frontend/src/assets/images/`; repoint the import/reference; no other image touched.
- [x] **VERIFY-02 — Lint, build, and structural readback of the card work unit**

## Progress
Phase 1 complete (texts, «Eventos Sociales» rename, two card photographs). Phase 2 complete: «Nuestros Departamentos» card → «Nuestro equipo» (title, description, photograph).

## Verification evidence
- `npm run lint` passed; `npm run build` passed from `frontend/`.
- Structural readback: `AboutUs.tsx` diff is exactly the three descriptions plus the card title/description/alt/comment; no classes, overlay, dimensions, or other cards touched.
- Image work-unit readback: diff is exactly two import lines plus one `src` reference; both new files copied without duplication; Vite HMR applied the update and the build bundles both images.
- Pre-existing local Supabase connection warnings in the dev log are unrelated to this change (dynamic news content; backend out of scope).
- Commit: `4fa138538e2e03a4a023372638f5eef006328026` (`feat(landing): update institutional texts and rename card to social events`).
- Image commit: `7b9910d8d99c2dec1d51a47b299f5658bb04c1fb` (`feat(landing): replace grupos faros and eventos sociales card images`).
- Team card work unit: `npm run lint` passed; `npm run build` passed; diff is exactly one import line, the section comment, alt text, `src`, card title, and description; `Nuestro equipo.jpeg` (178 KB) copied without duplication.
- Team card commit: (recorded after commit)

## Next step
Complete Phase 2 work unit, then run the native review preflight for the new candidate. Optional follow-up (out of scope): compress large card photographs and prune unreferenced legacy assets.
