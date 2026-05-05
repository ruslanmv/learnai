# LearnAI Roadmap

## Phase 0 — Mission Repositioning (1–2 days)

- Rewrite README around lifelong AI education
- Replace marketplace-first homepage language
- Document product vision and roadmap
- Move legacy marketplace positioning to `docs/legacy-marketplace.md`

## Phase 1 — Navigation and IA Refactor (3–5 days)

- Add `/onboarding`, `/teachers`, `/parent`, `/progress`
- Reserve `/learn` for lifelong learning dashboard
- Move current interview flow under `/interview`

## Phase 2 — Learner-First Data Model (4–7 days)

Add core learning entities:

- `LearnerProfile`
- `LearningGoal`
- `LearningPath`
- `Lesson`
- `Exercise`
- `TutorSession`
- `SkillProgress`

Keep marketplace entities available but out of the default flow.

## Phase 3 — Tutor Engine (1–2 weeks)

Create `lib/tutor/` modules for:

- session orchestration
- curriculum generation
- assessment and feedback
- safety checks
- persona loading
- memory/progress updates

## Phase 4 — Persona System (1 week)

- Add `personas/` directory and schema conventions
- Ship initial personas (kids + advanced learner)
- Add persona API endpoints and public gallery

## Phase 5 — LearnAI Family MVP (2–3 weeks)

- Parent onboarding + child profile
- Teacher selection
- Daily micro-lesson experience
- Parent summary + streak/progress UI

## Phase 6 — Certification Engine (2–3 weeks)

- Add adult/professional certification tracks
- Practice mode and exam mode
- Teach-until-learned mastery flow

## Phase 7 — Agent-Matrix Integration (3–6 weeks)

- Persona registry integration
- Guardian safety checks in response pipeline
- Automated maintenance workflows
- Optional avatar interfaces

## First 10 Issues to Open

1. Rewrite README around lifelong AI education
2. Move marketplace pages to legacy/experimental
3. Add learner-first Prisma schema
4. Build child onboarding flow
5. Define `.hpersona` schema
6. Add Milo the Owl persona
7. Build micro-lesson API
8. Build tutor session page
9. Add parent summary generation
10. Add skill progress tracking
