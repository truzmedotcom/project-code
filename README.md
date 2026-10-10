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

## Check that you're compatible

Install from GitHub, pinned to a version:

```sh
npm install github:truzmedotcom/project-code#v1.0.0
```

```js
const { validate } = require('@truzme/project-code');

const result = validate(JSON.parse(text));
if (!result.valid) {
    console.log(result.errors); // e.g. "member 1 references node 9, which doesn't exist"
}
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

Version 1 is stable. A change that would break existing documents or tools gets a new schema address (`…/v2.json`),
and version 1 stays available at its address.

## Proposals

Need something the format can't express? Proposals welcome via issues; Truzme decides what goes into the spec. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

- Schema, examples and code: [MIT](LICENSE).
- This README and other prose: [CC BY 4.0](LICENSE-docs).

The licenses cover the schema, the examples, the code and the docs. They don't cover the Truzme name or logo.
