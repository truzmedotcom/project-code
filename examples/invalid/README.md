# Invalid examples

Each document here is [`minimal.json`](../minimal.json) with one thing broken. A compatible reader must reject every
one of them.

| File                              | Why it's rejected                                                     |
| --------------------------------- | --------------------------------------------------------------------- |
| `dangling-node-reference.json`    | Member 1 ends at node 9, which isn't in the document.                 |
| `dangling-section-reference.json` | Member 1 uses section 2, which isn't in the document.                 |
| `duplicate-node-id.json`          | Two nodes have id 2. Ids must be unique within each list.             |
| `member-same-node.json`           | Member 1 starts and ends at node 1. A member needs two different nodes. |
| `empty-materials.json`            | `materials` is empty. Every document needs at least one material.     |
| `empty-sections.json`             | `sections` is empty. Every document needs at least one section.       |
| `unknown-top-level-key.json`      | `loadCases` isn't part of the format.                                 |
| `unknown-nested-key.json`         | Node 1 has a `z` coordinate, which isn't part of the format.          |
| `missing-unit.json`               | `units` has no `density`. All six unit fields are required.           |
| `unsupported-unit.json`           | `yd` isn't one of the allowed length units.                           |
| `bad-color.json`                  | `blue` isn't a color in `#RRGGBB` form.                               |
