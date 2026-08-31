# 🗣️ Speak — Batch Plan

**Companion to:** `SPEAK_PRODUCTION_PLAN.md` (the spec) · `KIDS_PRODUCTION_PLAN.md` (the format)
**Repo:** `ruslanmv/learnai` · Next.js 15 · TypeScript · Prisma · MCP
**Purpose:** break the Speak spec into PR-sized, dependency-ordered batches that can each land independently behind `NEXT_PUBLIC_FF_SPEAK`.

---

## 0 · Audit — what the spec assumed vs. what the repo actually has

The spec's §3 reuse inventory is broadly right, but five entries are stale or
missing. Each one changes the shape of a batch, so they are resolved here
before the batch list rather than discovered mid-implementation.

| # | Spec assumption | Reality in `master` @ `a342f80` | Consequence |
|---|---|---|---|
| 1 | "5-step onboarding (Who → Journey → Teacher → Goal → Ready)" — Speak extends it | `components/learn/OnboardingWizard.tsx` was **already refactored to 3 steps** (Who → Goal → Start). Journey + teacher are now *auto-resolved* from the goal chip (`journeyForStage()`, lines 259–280); the learner never picks them. | Speak cannot "add a Journey option" to a step that no longer exists. It becomes a **goal chip** in `GOALS[]` that routes into a self-contained Speak branch. Batch E. |
| 2 | Build `app/api/speech/transcribe/route.ts` with `SPEECH_PROVIDER=…` | **`POST /api/stt` already exists** (`app/api/stt/route.ts`) with a 3-provider fallback chain (`lib/stt/`: openai-whisper → azure-speech → local-whisper), a 12 MB cap, rate limiting (20/min/IP) and a `/api/stt/ping` health probe. | Do **not** build a second endpoint or a second env convention. Speak posts to `/api/stt`. Deletes ~1 route + ~1 provider module from scope. Batch K. |
| 3 | Build `lib/speech/adapter.ts` MediaRecorder fallback from scratch | **`lib/interview/recording.ts` already has it** — `AudioRecorder` class, mime negotiation across 4 candidates, `RecorderState` incl. `denied`/`unsupported`, single long-lived permission grant. | `adapter.ts` **wraps** `AudioRecorder`; only the `SpeechRecognition` half and the locale map are net-new. Batch A. |
| 4 | Mode B "reuses the Languages module" for EN·ES·DE·**FR**·ZH·JA | `lib/languages/catalog.ts` ships **en, es, de, it, ru, ja, zh, ar** — there is **no French**. | FR has no CEFR host. Either add FR to the catalog (a real content task) or ship FR as **Mode A only** in v1. Decision needed before Batch I; recommendation in §2. |
| 5 | M1/M2 acceptance: "metrics unit-tested", "`compilePlan` — pure, unit-tested" | **There is no JS test runner.** `package.json` has no jest/vitest and no `test` script; `tests/` holds three *Python* health checks (`test_mcp_server_health.py` etc.). | Two acceptance criteria are currently unsatisfiable. A runner must land **first**. Batch 0. |

Two smaller gaps, folded into batches rather than tabled:

- **No feature-flag convention exists.** `NEXT_PUBLIC_FF_*` appears nowhere in the codebase. Batch 0 establishes it.
- **No `content/` directory exists.** The spec's `content/speak/<lang>/*.json` is a new top-level convention. Batch 0 creates it with a schema + loader so six languages don't each invent one.
- **The OUTLOUD prototype is not in the repo.** `find . -iname "*outloud*"` returns nothing, so "English seed content ports directly" (§7) has no source. Treated as an unresolved input — see §2.

**Confirmed-good reuse** (spec was right): the Loop (`lib/learn/loop.ts`, six steps as data) · the 10 methods (`lib/learn/methods.ts`, with `loopSteps[]` tags already) · the progress engine (`lib/progress/engine.ts`, pure reducer + cookie + BroadcastChannel) · guest-first identity (`lib/learn/guest.ts`) · `LessonPlayer.tsx` + `LoopProgressStrip.tsx` · personas as `.hpersona` JSON · `services/mcp-professor/src/index.ts` (`server.tool()` + zod, 4 tools today) · `lib/tts/by-language.ts` (which gives the Hook's "20 s model clip" for free — no recorded audio assets needed).

---

## 1 · Batch map

Thirteen batches. Each is one PR. `→ M*` marks which spec milestone the batch closes.

```
Batch 0  Foundations (test runner, FF, content/)      ── blocks everything
   ├── Batch A  lib/speech core (adapter, metrics, en fillers)
   │      ├── Batch B  Mic UI primitives
   │      │      └── Batch C  Twister Sprint slice + baseline    → M1
   │      │             └── Batch F  Remaining 5 drills
   │      │                    └── Batch G  Loop session + XP    → M3
   │      └── Batch H  MCP speak_analyze + Coach Vega
   └── Batch D  Prisma models + guest mirror + API
          └── Batch E  compilePlan + wizard branch + reveal      → M2
                 └── Batch J  Weekly check-in + curve            → M4
                        └── Batch I  ES/DE(/FR) banks + QA       → M4
                               └── Batch K  ZH/JA + server ASR + admin → M5
                                      └── Batch L  Landing + Senior + a11y → M6
```

---

## 2 · Decisions needed before Batch I and Batch F

Neither blocks Batches 0–E, so they can be answered while foundation work runs.

1. **French.** Mode B needs a CEFR host that `lib/languages/catalog.ts` doesn't have.
   *Recommendation:* ship FR as **Mode A only** in v1 and add FR to the Languages
   catalog as its own PR, unblocked from Speak. Adding a language to a CEFR module
   is a content project (levels, can-do statements, vocab cards), not a Speak task,
   and bundling it would make Batch I unmergeable for weeks.
2. **OUTLOUD seed content.** §7 says English banks port from a prototype that isn't
   in this repo. Either the file gets committed (then Batch C/F are ports and cheap)
   or the 132 English items are **authored** in this repo (then Batch F carries a
   real content cost — see its Cost line, which assumes authoring).

---

## 3 · The batches

### Batch 0 — Foundations: test runner, feature flag, content convention
**Why:** three separate things in the spec are currently impossible, not just
undone. M1 and M2 acceptance both say "unit-tested" and there is no runner;
`NEXT_PUBLIC_FF_SPEAK` has no precedent to follow; and `content/speak/<lang>/`
invents a top-level directory that six languages will then depend on. Doing
these once, first, is much cheaper than three half-conventions.

**Scope:**
- Add **vitest** + `@vitest/coverage-v8`; `"test"` and `"test:watch"` scripts;
  add `npm run test` to the existing `validate` script (`lint && type-check && format:check`).
  Config must exclude `tests/*.py` so the Python health checks keep working.
- Establish the flag: `lib/flags.ts` exporting `ffSpeak()`, reading
  `NEXT_PUBLIC_FF_SPEAK`. Document it in `.env.example` and `docs/DEVELOPMENT.md`.
  All `/learn/speak/*` routes `notFound()` when the flag is off.
- Create `content/speak/` with a `README.md` (authoring rules, §4.6's
  "authored per language, never translated") and `lib/speech/content.ts` — a typed
  loader + zod schemas for all seven bank shapes, so ES/DE/ZH/JA contributors get
  a validation error rather than a runtime surprise.
- One smoke test proving the runner works.

**Files:** `package.json`, `vitest.config.ts`, `lib/flags.ts`, `content/speak/README.md`, `lib/speech/content.ts`, `docs/DEVELOPMENT.md`, `.env.example`
**Acceptance:** `npm run validate` runs lint + types + format + tests green; flag off ⇒ `/learn/speak` 404s; a malformed `twisters.json` fails schema validation with a readable path.
**Cost:** S. No product surface.

---

### Batch A — `lib/speech` core: adapter, metrics, English fillers
**Why:** everything downstream measures. Pure logic first, no UI, so the metric
formula is testable before a microphone is involved.

**Scope:**
- `lib/speech/adapter.ts` — `SpeechRecognition`/`webkitSpeechRecognition` wrapper
  with the §4.5 locale map (`en-US`, `es-ES`, `de-DE`, `fr-FR`, `zh-CN`, `ja-JP`),
  feature detection, and **delegation to the existing `AudioRecorder`** from
  `lib/interview/recording.ts` for the MediaRecorder path. Do not duplicate the
  mime-negotiation or permission-state logic that file already has.
- `lib/speech/metrics.ts` — `rate`, `fillerPct`, `pauseRatio`, `restarts`, `score`
  per the §4.5 formula. Token counting is **unit-aware from day one**
  (words for EN·ES·DE·FR, characters for ZH, kana-normalized for JA) even though
  ZH/JA ship in Batch K — retrofitting the unit later touches every call site.
- `lib/speech/fillers/en.ts` + the `FillerLexicon` type. Five stub modules
  (`es|de|fr|zh|ja`) exporting empty arrays so imports typecheck before Batch I/K.
- `pauseRatio` via a WebAudio RMS gate (>700 ms), transcript-independent.

**Files:** `lib/speech/{adapter,metrics}.ts`, `lib/speech/fillers/*.ts`, `lib/speech/__tests__/metrics.test.ts`
**Acceptance:** metrics unit tests cover a known transcript → expected rate/fillerPct/score, plus the clamp boundaries at 0 and 100; adapter feature-detects to `unsupported` under a stubbed `window` with no `SpeechRecognition`; **zero React imports** in `lib/speech/`.
**Cost:** M. The metric formula is the piece worth over-testing — every KPI in §9 is derived from it.

---

### Batch B — Mic UI primitives
**Why:** four components are shared by all six drills. Building them with the
drills instead of before them means six divergent mic buttons.

**Scope:** `MicButton.tsx` (in-context permission request with the one-line
reason per §6.4, level meter, "too noisy" RMS hint, silent fallback on denial),
`LiveTranscript.tsx` (streaming words, fillers highlighted as they arrive),
`MetricBars.tsx` (rate/filler/pause vs. target band), `DrillShell.tsx`
(timer, progress, XP toast — the contract all six drills implement).

**Files:** `components/speak/{MicButton,LiveTranscript,MetricBars,DrillShell}.tsx`
**Acceptance:** rendered in isolation (an admin design-gallery entry, following
`app/admin/design-gallery/`) with a mocked adapter; denial path reaches the
slider fallback without an error toast; fillers highlight while speech is still
streaming, not on final result.
**Cost:** M.

---

### Batch C — Twister Sprint vertical slice + baseline screen · **→ M1**
**Why:** first end-to-end proof — mic to metric to screen — on the smallest drill.

**Scope:** `components/speak/drills/TwisterSprint.tsx` (timed twisters, 3 reps,
SR word-accuracy + self-rate, method tag `kumon_ladder`); `app/learn/speak/baseline/page.tsx`
(30 s read-aloud + 20 s impromptu); 15 English twisters in
`content/speak/en/twisters.json`; `app/learn/speak/page.tsx` as a flag-gated stub.

**Files:** `app/learn/speak/{page,baseline/page}.tsx`, `components/speak/drills/TwisterSprint.tsx`, `content/speak/en/twisters.json`
**Acceptance (spec M1):** live transcript renders while speaking in **Chrome + Safari**; metrics unit-tested (Batch A) and rendering real values here; **no audio persisted** — verify no network request carries audio and no blob outlives the component (`revokeRecording()` on unmount).
**Cost:** M.

---

### Batch D — Prisma models, guest mirror, API routes
**Why:** Batch E's plan reveal needs somewhere to put a plan. Splitting schema
from the wizard keeps the migration reviewable on its own.

**Scope:**
- 4 models + 2 enums per §5.4 (`SpeakProfile`, `SpeakSession`, `DrillResult`,
  `SpeakSample`; `SpeakMode`, `LeakTrack`). Follow the existing enum-block
  convention at the top of `schema.prisma`. One migration, named per the
  `20260522140000_per_user_data` pattern.
- The **guest mirror**: `userId String?` means guests live in localStorage and
  sync on sign-in. Model this on `lib/me/progress-store.ts`, which already
  solves the same problem for progress.
- `app/api/learn/speak/` routes (profile, session, sample) using the `handler`/`ok`/`fail`
  helpers from `lib/api.ts` that `/api/stt` already uses.
- `SpeakSample.transcript` deletion wired into the existing "see or clear what I
  remember" surface (`lib/me/`) — §6.3 is a promise, not a nice-to-have.

**Files:** `prisma/schema.prisma`, `prisma/migrations/<ts>_speak/`, `app/api/learn/speak/**`, `lib/speech/store.ts`
**Acceptance:** `prisma migrate dev` clean; full guest round-trip with no `User` row; deleting a transcript from `/settings` removes the row and leaves metrics intact.
**Cost:** M.

---

### Batch E — `compilePlan` + wizard branch + Synthesis + Plan reveal · **→ M2**
**Why:** the funnel is the spec's moat (§4.1 step 7), and it is the batch most
changed by the audit — see §0 item 1.

**Scope:**
- `lib/speech/plan.ts` — `compilePlan(answers, baseline?) → SpeakPlan`. Pure, no AI
  call, exhaustively unit-tested (the skip-all path is a named test case).
- **The branch, not an extension.** Add a Speak entry to `GOALS[]` in
  `OnboardingWizard.tsx` that routes to a self-contained
  `components/speak/SpeakFunnel.tsx` carrying spec steps 2–8. The 3-step wizard's
  auto-resolve logic (`stage` → `journey` → `teacher`) stays untouched; Speak
  resolves to `SCHOLAR`/`PROFESSIONAL`/`SENIOR` and hands off.
- `Synthesis.tsx` (3–4 s interstitial) + `PlanReveal.tsx` (baseline card, target
  curve, 4-week path, first session named).
- Every step skippable, defaults per the §4.1 table.

**Files:** `lib/speech/plan.ts`, `components/speak/{SpeakFunnel,Synthesis,PlanReveal}.tsx`, `components/learn/OnboardingWizard.tsx`
**Acceptance (spec M2):** funnel ≤90 s median (instrument it); **skip-all lands on a valid default plan** — Mode A, UI language, MIXED track, 15 min, slider baseline; baseline metrics visible on the reveal screen; the existing 3-step non-Speak path is byte-identical in behavior (regression test).
**Cost:** L. The largest single batch; split into E1 (`compilePlan` + tests) and E2 (funnel UI) if review latency becomes a problem.

---

### Batch F — The remaining five drills
**Why:** with `DrillShell` (B) and one reference drill (C), the rest are parallelizable.

**Scope:** Word Grab (12 s synonym MCQ, `active_recall`) · Filler Filter (tap
fillers in a transcript, `shatalov_signal`) · PREP in 60 (`feynman`) ·
Forbidden Words (25 s taboo, `zpd_adaptive`) · Bridge It (timed analogies,
`worked_example`). Each tagged with its `LearningMethodId` from
`lib/learn/methods.ts` — pedagogy as code, not as a comment. English banks:
30 synonym sets, 10 transcripts, 25 PREP topics, 20 taboo cards, 20 analogies.

**Files:** `components/speak/drills/*.tsx`, `content/speak/en/{synonyms,transcripts,topics,taboo,analogies}.json`
**Acceptance:** each drill playable standalone; auto-scored drills need no mic and work with permission denied; every drill's method tag resolves against `METHODS`.
**Cost:** L if authoring English content (105 items); M if the OUTLOUD prototype lands first (§2.2).

---

### Batch G — Loop session player, XP, streaks, Evolve re-queue · **→ M3**
**Why:** turns six drills into the daily 15-minute product.

**Scope:** `app/learn/speak/session/page.tsx` on the existing `LessonPlayer` +
`LoopProgressStrip` (Speak surface, same six steps) · the interleaver
(`interleaving` — never the same drill twice in a row) · `lib/speech/scoring.ts`
→ XP through `lib/progress/engine.ts` with the ~100 XP session cap ·
Evolve re-queues failed items (`spaced_repetition`) · `loopStep` persisted so a
session resumes mid-Loop · the Mode A ladder (Mumbler → Talker → Speaker →
Orator → Silver Tongue).

**Files:** `app/learn/speak/session/page.tsx`, `lib/speech/{scoring,interleave,queue}.ts`
**Acceptance (spec M3):** a full 15-minute session completes end-to-end **as a guest**; Evolve re-queues weak items into tomorrow; XP and streak update in the existing progress cookie and cross-tab sync still fires.
**Cost:** L.

---

### Batch H — `speak_analyze` / `speak_plan` MCP tools + Coach Vega
**Why:** independent of the UI chain — can run in parallel with F/G.

**Scope:** two `server.tool()` registrations in `services/mcp-professor/src/index.ts`
following the existing zod-schema style: `speak_analyze(transcript, metrics, lang)`
→ 3-sentence critique + one focus for tomorrow (this **is** the roadmap's
voice-mode Feynman critique — close that roadmap item in the same PR);
`speak_plan(answers, baseline)` → thin wrapper over `compilePlan()`.
Add `personas/examples/coach-vega.hpersona` in the existing `learnai.persona.v1`
schema, plus the calm large-text Senior variant.

**Files:** `services/mcp-professor/src/index.ts`, `personas/examples/coach-vega.hpersona`, `docs/ROADMAP.md`
**Acceptance:** both tools callable over MCP with valid/invalid payloads; `speak_plan` output is byte-identical to a direct `compilePlan()` call for the same input; persona validates against the v1 schema.
**Cost:** S.

---

### Batch I — ES · DE (· FR) content banks + locale QA · **→ M4 (content half)**
**Why:** the first real test of "authored per language, never translated" (§4.6).

**Scope:** full 132-item bank per language (15 twisters, 30 synonyms, 10 transcripts,
25 topics, 20 taboo, 20 analogies, 12 technique cards **each with a primary-source
citation** per the repo's citations-not-vibes rule) · real filler lexicons replacing
the Batch A stubs · a "Speak content" section in `CONTRIBUTING.md` with the
native-speaker review checklist · rate-target bands per language, labelled
placeholder pending M5 calibration.
**FR is gated on the §2.1 decision** — if FR ships Mode A only, this batch covers
ES/DE/FR banks but no FR CEFR work.

**Files:** `content/speak/{es,de,fr}/*.json`, `lib/speech/fillers/{es,de,fr}.ts`, `CONTRIBUTING.md`
**Acceptance (spec M4):** native-speaker sign-off recorded per bank in the PR; every bank passes the Batch 0 schema validator; no item is a translation of its English counterpart (spot-checked in review).
**Cost:** XL in human review time, S in code. Start recruiting reviewers during Batch E.

---

### Batch J — Weekly check-in + the curve · **→ M4 (product half)**
**Why:** §4.7 calls this the retention loop the one-shot funnel apps don't have.
It is small and it is the difference between a plan and a product.

**Scope:** 3 questions + a fresh 30 s sample reusing `baseline/page.tsx` with
`kind: "weekly"` · re-run `compilePlan()` with the new baseline · the progress
curve on `/learn/speak` plotting `SpeakSample.metrics` over time · the reminder
notification from the funnel's `reminderHour`.

**Files:** `app/learn/speak/page.tsx`, `components/speak/ProgressCurve.tsx`, `lib/speech/checkin.ts`
**Acceptance (spec M4):** a check-in visibly moves the curve; the re-compiled plan differs when metrics improved past a target band.
**Cost:** M.

---

### Batch K — ZH · JA, server-ASR opt-in, admin panel · **→ M5**
**Why:** the three items that need the most real-device QA, batched so one
device-testing pass covers all three.

**Scope:**
- ZH/JA banks + filler lexicons; **cpm** rate unit surfaced in the UI label
  (the unit-aware plumbing landed in Batch A, so this is display + content).
- **Server ASR opt-in via the existing `/api/stt`** — not a new endpoint (§0 item 2).
  Net-new work is only: the labelled opt-in toggle, preferring server ASR for
  ZH/JA when opted in, and verifying audio is discarded post-transcription.
  Document in `SECURITY.md` per §6.2.
- Admin Speak panel in `app/admin/` (following `app/admin/learners/`): funnel
  completion %, mic-grant %, sessions/learner/week, median filler-rate delta
  W1→W4, per-language content coverage.
- **Recalibrate the §4.5 rate bands from beta cohort data** — the spec flags them
  as placeholders and M5 is where that debt comes due. Don't let it slip to M6.

**Files:** `content/speak/{zh,ja}/*.json`, `lib/speech/fillers/{zh,ja}.ts`, `app/admin/speak/`, `SECURITY.md`
**Acceptance (spec M5):** ZH/JA sessions playable on real iOS + Android devices; ASR opt-in labelled and audio-discard verified (assert no persisted blob server-side); §9 KPIs visible in admin.
**Cost:** L.

---

### Batch L — Landing, category comparison, Senior calm variant, a11y · **→ M6**
**Why:** the positioning claims in §11 are only true once they're on a page.

**Scope:** landing section + category comparison page (positioning against the
*category*, never a named competitor — §2 clean-room rule 3) · the Senior calm
variant (large text, reduced motion) following `app/learn/senior/` · flag removal
plan: `NEXT_PUBLIC_FF_SPEAK` defaults on, then the flag is deleted in a follow-up.

**Files:** `app/page.tsx`, `app/learn/speak/compare/page.tsx`, `app/learn/senior/`, `lib/flags.ts`
**Acceptance (spec M6):** Lighthouse ≥90 mobile; a11y pass on the Senior variant; every §11 claim traceable to a shipped file.
**Cost:** M.

---

## 4 · Sequencing against the spec's milestones

| Spec milestone | Batches | Note |
|---|---|---|
| — | **0** | Net-new. M1's "unit-tested" acceptance can't be met without it. |
| **M1** wk 1–2 | A, B, C | Batch 0 makes this ~3 batches, not 2 weeks of one. |
| **M2** wk 3–4 | D, E | E is the largest; splittable into E1/E2. |
| **M3** wk 5–6 | F, G, (H) | H is parallel — no dependency on F or G. |
| **M4** wk 7–8 | I, J | I is review-bound, not code-bound; start reviewer recruitment in M2. |
| **M5** wk 9–10 | K | Absorbs the rate-band recalibration debt from §4.5. |
| **M6** wk 11 | L | |

**Critical path:** `0 → A → B → C → F → G`. Batches D/E and H can run alongside
it with a second contributor. Batch I's calendar cost is native-speaker
availability, so it is the one to start early and the one most likely to slip.

**Scope removed by the audit:** one API route, one env-var convention, one
provider module, and the MediaRecorder half of `adapter.ts` — all already in the
repo. **Scope added:** a test runner, a feature-flag convention, a content
convention, and the French question. Roughly a wash, but the added work is all
in Batch 0, at the front, where it unblocks rather than blocks.
