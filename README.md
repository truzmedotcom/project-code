# Truzme Project code — the open text format for truss models.

Truzme Project code is a 2D truss model written as one JSON object: nodes, members, supports, loads, materials and
sections, plus the units its numbers are in. [Truzme](https://www.truzme.com) uses it for copy and paste, and any tool
can read and write it: truss apps, course tools, research scripts, AI pipelines.

This repo holds the schema, a validator, and example documents to test against.

## The schema

```
https://www.truzme.com/schemas/project-code/v1.json
```

The same file is in this repo at [`schema/v1.json`](schema/v1.json). Start every document you write with a `$schema`
key set to the address above.

## Guides

- [Project code](https://www.truzme.com/guides/project-code): the format, with every field explained.
- [Connect your app](https://www.truzme.com/guides/connect-your-app): reading and writing it in your own tool.

## Quick example

A triangle with two supports and one load:

```json
{
  "$schema": "https://www.truzme.com/schemas/project-code/v1.json",
  "units": {
    "length": "m",
    "sectionLength": "mm",
    "force": "kN",
    "materialStrength": "MPa",
    "area": "mm²",
    "density": "kg/m³"
  },
  "nodes": [
    { "id": 1, "x": 0, "y": 0 },
    { "id": 2, "x": 4, "y": 0 },
    { "id": 3, "x": 2, "y": 3 }
  ],
  "members": [
    { "id": 1, "from": 1, "to": 2, "section": 1, "material": 1 },
    { "id": 2, "from": 1, "to": 3, "section": 1, "material": 1 },
    { "id": 3, "from": 2, "to": 3, "section": 1, "material": 1 }
  ],
  "supports": [
    { "id": 1, "node": 1, "x": true, "y": true },
    { "id": 2, "node": 2, "x": false, "y": true }
  ],
  "nodalLoads": [
    { "id": 1, "node": 3, "x": 0, "y": -10 }
  ],
  "materials": [
    { "id": 1, "name": "Steel", "EModulus": 210000, "fMax": 235, "density": 7850 }
  ],
  "sections": [
    { "id": 1, "name": "Ø20", "sectionType": "solid_round", "d": 20 }
  ]
}
```

Copy it, then paste it on the Truzme canvas (Ctrl+V, ⌘V on a Mac) to see it.

## Writing a document

What every document needs:

- **All six `units` fields**, even the ones your model doesn't use.
- **Integer ids, unique within each list.** Node 1 and section 1 don't collide.
- **References by id.** Everything that points at something (`from`, `to`, `node`, `section`, `material`) uses an id
  from the same document.
- **At least one material and one section.**
- **Two different nodes per member.**
- **`y` increases upward**, the math convention, not screen coordinates.
- **A vertical roller** can be written as `{ "x": true, "y": false }`, or as a roller turned by −90:
  `{ "x": false, "y": true, "angle": -90 }`. Leave `angle` out unless a support really is turned.
- **No keys of your own.** The format doesn't allow keys it doesn't define. Need one? See [Proposals](#proposals).

## Reading a document

- **The `units` block is authoritative.** Convert every number from the document's units into your own. Don't assume
  meters or newtons.
- **A load's `mode` is only for drawing.** `push` (the default) draws the arrow pointing at the node, `pull` draws it
  pointing away. The force is the same either way.
- **`color` and `dimensions` are optional.** Don't require them.
- **A support's `angle` turns it**, in degrees, counterclockwise, and its `x` / `y` directions turn with it: a roller
  with `"y": true` and `"angle": 30` holds the node only across a surface tilted 30°. On a pin it only changes the
  drawing. Missing means 0.
- **`$schema` may be there.** Ignore it.
- **Check references.** The schema checks the shape of a document, not that an id points at something. `validate`
  (below) does both.

## Check that you're compatible

Install the package:

```sh
npm install @truzme/project-code
```

Check a document:

```js
import { validate } from '@truzme/project-code'; // or: const { validate } = require('@truzme/project-code');

const result = validate(JSON.parse(text));
if (!result.valid) {
    console.log(result.errors); // e.g. "member 1 references node 9, which doesn't exist"
}
```

The schema and the examples come with it, for your own validator or tests:

```js
import schema from '@truzme/project-code/schema/v1.json' with { type: 'json' };
// or: const { schema } = require('@truzme/project-code');

const minimal = require('@truzme/project-code/examples/minimal.json'); // CommonJS
```

`validate` checks the schema, plus what a schema can't: that ids are unique within each list, and that every
reference points at an id that exists. Not using JavaScript? Validate against the schema with any JSON Schema 2020-12
validator, and check the references yourself.

Then test your reader and writer against the examples:

- Every file in [`examples/`](examples) should import into your tool and export again as the same truss.
- Every file in [`examples/invalid/`](examples/invalid) must be rejected. Its README says why.

## Attribution

If your tool supports the format, please call it "Truzme Project code" and link to this repo or to the
[Connect your app](https://www.truzme.com/guides/connect-your-app) guide.

## Versioning

The format follows [semantic versioning](https://semver.org/):

- **A backward-compatible change stays version 1**, at the same address, as a new minor version (1.1, 1.2, …): a new
  optional key, for example. Every document that was valid stays valid and means the same.
- **A breaking change gets version 2**, at a new address (`…/v2.json`): removing or renaming a key, or changing what one
  means. Version 1 stays available at its address.

Every object in the schema rejects keys it doesn't define, so a tool holding an older copy of version 1 rejects a
document that uses a newer optional key. Validate against the address above, or update your copy with each release.
Truzme writes a new key only where it's actually used — a support's `angle` only on a turned support — so documents
that don't use a feature stay readable by older copies.

[CHANGELOG.md](CHANGELOG.md) lists what changed in each release.

## Proposals

Need something the format can't express? Proposals welcome via issues; Truzme decides what goes into the spec. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

Everything in this repo — the schema, the examples, the code and the docs — is under the [MIT license](LICENSE). It
doesn't cover the Truzme name or logo.
