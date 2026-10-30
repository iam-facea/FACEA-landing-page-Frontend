# Landing Page Image Updates

## Objective
Apply two user-provided landing page image updates: a photographic IAM FACEA Hero and an image-only replacement for the “Escuela Sabática” card.

## Problem and rationale
The current Hero uses the institutional logo, dark text, and a CTA on a plain background. The requested composition requires a prominent photographic Hero with a dark overlay and no additional decorative elements, buttons, or animations.

## Scope
- Move `Foto Todos Juntos.jpg.jpeg` from the repository root to `frontend/src/assets/images/Foto Todos Juntos.jpg.jpeg`.
- Update only `frontend/src/components/home/HeroBanner.tsx`.
- Use the exact title and subtitle supplied by the user.
- Preserve Navbar, Footer, and every non-Hero landing page section except the authorized Escuela Sabática image reference.
- Move `ESCUEL SABATICA.jpg.jpeg` from the repository root to `frontend/src/assets/images/ESCUEL SABATICA.jpg.jpeg`.
- Replace only the Escuela Sabática card image reference in `frontend/src/components/home/AboutUs.tsx`.

## Constraints
- Do not duplicate or modify other images.
- Do not refactor architecture or alter dynamic data/backend behavior.
- Keep the existing `#inicio` anchor behavior.
- No Hero logo, CTA, decorative elements, or new animations.
- Preserve the Escuela Sabática card’s text, structure, classes, overlay, dimensions, proportions, and responsive behavior exactly.
- Existing unrelated `.gitignore` modifications must remain untouched.

## Delivery
- Strategy: `ask-on-risk`.
- Forecast: under 120 authored changed lines across two cohesive image work units.
- Branch: `feat/update-images`.
- Commit: pending explicit user authorization.

## Test mode
- TDD mode: unknown; no explicit project/session TDD setting was found.
- Ordinary checks: `npm run lint` and `npm run build` from `frontend/`.
- Runtime check: responsive visual inspection of the Hero on desktop and mobile.

## Tasks
- [x] **HERO-01 — Implement the photographic Hero**
  - Route: delegated to `gentle-ai-worker`.
  - Trigger: moving the asset and changing the component crosses the multi-file write boundary.
  - Move the named image into the established assets directory without duplication.
  - Apply it as the responsive Hero background with a dark overlay.
  - Center the exact requested title and subtitle vertically and horizontally.
  - Remove the existing Hero logo and CTA while leaving all other page areas untouched.
  - Acceptance: the Hero alone matches the requested photographic composition and remains legible on mobile and desktop.
- [ ] **HERO-02 — Verify scope and build health**
  - Route: delegated verification if required by native assessment; parent structural readback otherwise.
  - Run lint and production build.
  - Confirm the final diff changes only the intended image work, relocations, and this ODD tracking document, while preserving the unrelated `.gitignore` change.
  - Record any unavailable manual browser check honestly.
- [x] **IMAGE-01 — Replace only the Escuela Sabática card image**
  - Route: delegated to `gentle-ai-worker`.
  - Trigger: moving the asset and changing `AboutUs.tsx` crosses the multi-file write boundary.
  - Move the named image into the established assets directory without duplication.
  - Replace only the `gruposMisioneros` import/reference used by the Escuela Sabática card.
  - Acceptance: the card’s markup, text, classes, overlay, dimensions, proportions, and responsive behavior are byte-for-byte unchanged outside the image import/reference.

## Progress
HERO-01 and IMAGE-01 are implemented. Both supplied root images were moved into `frontend/src/assets/images/` without duplication. Independent verification confirmed the Hero composition and that `AboutUs.tsx` changes only the Escuela Sabática import path. HERO-02 remains open because manual desktop/mobile browser inspection and work-unit commit authorization are pending.

## Verification evidence
- Hero writer: `npm run lint` passed; `npm run build` passed.
- Escuela Sabática writer: `npm run lint` passed; `npm run build` passed; its TSX diff is exactly one import-line replacement.
- Final independent verifier: `npm run lint` passed; `npm run build` passed; both moved assets resolve; both root sources are absent; no Navbar, Footer, backend, other card, or unrelated source file changed.
- Native risk assessment: unavailable because untracked files require explicit declaration; independent verification was therefore required and completed.
- Manual desktop/mobile browser inspection: pending.
- Work-unit commit: pending explicit user authorization.

## Next step
Resolve the native review candidate, then request explicit commit authorization; manual responsive inspection remains a disclosed pending check.
