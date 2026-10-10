# Contributing

## Proposing an extension

Need something the format can't express? Open an issue first, before writing any code. Please include:

- **What you're trying to describe**, in a sentence or two. For example: "loads that act along a member, not only at a
  node".
- **A sample document** showing how you'd write it.
- **Why the existing fields can't do it.**
- **What a tool that doesn't know the new field should do** with a document that has it.

Proposals are welcome. Truzme decides what goes into the spec, so documents stay readable by every tool that supports
it.

Please don't add your own keys to documents in the meantime. The format doesn't allow keys it doesn't define, so other
tools will reject them.

## Fixes

Typos, clearer wording and new examples are welcome as pull requests. Run `npm test` before you send one.

A new invalid example needs a one-line reason in [`examples/invalid/README.md`](examples/invalid/README.md); the test
checks for it.

## License of contributions

By contributing, you agree that your contribution is licensed like the rest of the repo: [MIT](LICENSE) for the
schema, examples and code, and [CC BY 4.0](LICENSE-docs) for the README and other prose.
