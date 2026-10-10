# Changelog

## 1.0.0 — 2026-10-10

First public release.

- `schema/v1.json`: the Truzme Project code schema, version 1. The same file Truzme serves at
  https://www.truzme.com/schemas/project-code/v1.json.
- `validate.js`: checks a document against the schema, plus the rules a schema can't express (unique ids, references
  that point at something).
- `examples/`: valid documents to round-trip, and invalid ones a reader must reject.
