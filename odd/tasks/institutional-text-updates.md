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
- [ ] **IMAGE-01 — Replace the card photograph (BLOCKED)**
  - Blocked: no image file found in the project root or `frontend/` root; awaiting user-supplied source path.
  - When provided: copy into `frontend/src/assets/images/`, swap the import/reference, keep display format identical.
- [x] **VERIFY-01 — Lint, build, and structural readback of the committed text work unit**

## Progress
TEXT-01, TEXT-02, VERIFY-01 complete and committed. IMAGE-01 blocked pending user input.

## Verification evidence
- `npm run lint` passed; `npm run build` passed from `frontend/`.
- Structural readback: `AboutUs.tsx` diff is exactly the three descriptions plus the card title/description/alt/comment; no classes, overlay, dimensions, or other cards touched.
- Commit: (recorded after commit)

## Next step
Request the image path from the user; IMAGE-01 completes the card photograph swap as a separate work unit.
