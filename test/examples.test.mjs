import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { test } from 'node:test';

const { validate } = createRequire(import.meta.url)('../validate.js');

const EXAMPLES = new URL('../examples/', import.meta.url).pathname;
const INVALID = join(EXAMPLES, 'invalid');

const jsonFiles = (dir) => readdirSync(dir).filter((name) => name.endsWith('.json'));
const read = (dir, name) => JSON.parse(readFileSync(join(dir, name), 'utf8'));

for (const name of jsonFiles(EXAMPLES)) {
    test(`valid: ${name}`, () => {
        assert.deepEqual(validate(read(EXAMPLES, name)).errors, []);
    });
}

for (const name of jsonFiles(INVALID)) {
    test(`invalid: ${name}`, () => {
        const result = validate(read(INVALID, name));
        assert.equal(result.valid, false);
        assert.ok(result.errors.length > 0);
    });
}

test('every invalid example has its reason in examples/invalid/README.md', () => {
    const readme = readFileSync(join(INVALID, 'README.md'), 'utf8');
    const listed = [...readme.matchAll(/^\| `([^`]+\.json)` +\| \S/gm)].map((match) => match[1]);
    assert.deepEqual(listed.sort(), jsonFiles(INVALID).sort());
});

test("the schema's $comment names this release's version", () => {
    const schema = JSON.parse(readFileSync(new URL('../schema/v1.json', import.meta.url), 'utf8'));
    const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    assert.ok(
        schema.$comment.startsWith(`Truzme Project code ${version}.`),
        `$comment should start with "Truzme Project code ${version}." — update it with each release`
    );
});

