# LearnAI Personas

This directory contains AI teacher persona definitions used by LearnAI.

## Format

Personas are stored as `.hpersona` JSON files with the schema family:

- `learnai.persona.v1`

## Initial examples

- `examples/milo-friendly-owl.hpersona` — early childhood companion (ages 3–6)
- `examples/professor-turing.hpersona` — advanced CS/AI tutor (ages 14+)

## Design goals

Each persona should encode:

- audience and age range
- subjects and pedagogical style
- response constraints
- safety and guardrail requirements
- lesson loop behavior
- enabled tools

## Contribution

Community persona packs can be grouped by audience:

- `kids/`
- `school/`
- `coding/`
- `science/`
- `senior/`
- `research/`
