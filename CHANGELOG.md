# Changelog

## 1.1.0 — 2026-10-11

- Supports can be turned: an optional `angle` (degrees, counterclockwise). A support's `x` / `y` directions turn with
  it; on a pin it only changes the drawing. Backward compatible: without `angle`, every support means what it did.
- The `x` / `y` descriptions say they follow the support's angle.
- `examples/rotated-supports.json`, and `examples/invalid/angle-not-a-number.json`.
- The schema's `$comment` names its release (`Truzme Project code 1.1.0.`), so a copy of `v1.json` says which
  version it is. Validators ignore it.
- README: how to write and read a document, and how versions work.
- One license for the whole repo: MIT, docs included (`LICENSE-docs` removed).
- On npm as `@truzme/project-code`.

## 1.0.0 — 2026-10-10

First public release.

- `schema/v1.json`: the Truzme Project code schema, version 1. The same file Truzme serves at
  https://www.truzme.com/schemas/project-code/v1.json.
- `validate.js`: checks a document against the schema, plus the rules a schema can't express (unique ids, references
  that point at something).
- `examples/`: valid documents to round-trip, and invalid ones a reader must reject.
