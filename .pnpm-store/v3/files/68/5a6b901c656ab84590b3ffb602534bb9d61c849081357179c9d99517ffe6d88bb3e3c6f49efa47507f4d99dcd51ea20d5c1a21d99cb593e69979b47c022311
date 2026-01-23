# json-canonicalize

> JSON canonicalize function

[![Build Status](https://travis-ci.org/snowyu/json-canonicalize.svg?branch=master)](https://travis-ci.org/snowyu/json-canonicalize)
[![NPM version](https://img.shields.io/npm/v/json-canonicalize.svg)](https://www.npmjs.com/package/json-canonicalize)
![Downloads](https://img.shields.io/npm/dm/json-canonicalize.svg)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

---

# JSON Canonicalization

Cryptographic operations like hashing and signing depend on that the target
data does not change during serialization, transport, or parsing.
By applying the rules defined by JCS (JSON Canonicalization Scheme),
data provided in the JSON [[RFC8259](https://tools.ietf.org/html/rfc8259)]
format can be exchanged "as is", while still being subject to secure cryptographic operations.
JCS achieves this by building on the serialization formats for JSON
primitives as defined by ECMAScript [[ES6](https://www.ecma-international.org/ecma-262/6.0/index.html)],
constraining JSON data to the I-JSON [[RFC7493](https://tools.ietf.org/html//rfc7493)] subset,
and through a platform independent property sorting scheme.

- Working document: https://cyberphone.github.io/ietf-json-canon
- Published IETF Draft: https://tools.ietf.org/html/draft-rundgren-json-canonicalization-scheme-05
- Published RFC 8785: https://www.rfc-editor.org/rfc/rfc8785

## ✨ Features

The JSON Canonicalization Scheme concept in a nutshell:

- Serialization of primitive JSON data types using methods compatible with ECMAScript's `JSON.stringify()`
- Lexicographic sorting of JSON `Object` properties in a _recursive_ process
- JSON `Array` data is also subject to canonicalization, _but element order remains untouched_

## RFC 8785 Compatibility

This implementation is compatible with JCS / RFC 8785, with a couple of key differences in the default `canonicalize` function:

- **Handling of `undefined` in arrays:** When a value in an array is `undefined`, the `canonicalize` function treats it as `null`. RFC 8785 specifies that it should be treated as `undefined`, which can lead to different outputs.
- **Recursive References:** This implementation supports recursive object references, which is an enhancement not covered by the standard.

To be fully compatible with RFC 8785, you can use the `canonicalizeEx` function with the `undefinedInArrayToNull` option set to `false`:

```ts
canonicalizeEx(obj, { undefinedInArrayToNull: false });
```

## 🔧 Installation

```sh
yarn add json-canonicalize
```

## 🎬 Getting started

Let's demonstrate simple usage with ... example:

```ts
import { canonicalize, canonicalizeEx } from 'json-canonicalize';
canonicalize(obj)
// Add `include` and `exclude` options to `canonicalizeEx`.
canonicalizeEx(obj, {exclude:['num', 'dt']})

// add canonicalize to JSON directly.
// which means
// JSON.canonicalize = canonicalize;
import from 'json-canonicalize/src/global';
JSON.canonicalize(obj)
```

## API

### `canonicalize(obj, allowCircular)`

This is the main function for JSON canonicalization. It takes a JavaScript object and returns its canonical string representation.

-   `obj` (any): The JavaScript object to canonicalize.
-   `allowCircular` (boolean, optional): If `true`, the function will handle circular references in the object by replacing them with `null`. Defaults to `false`.

### `canonicalizeEx(obj, options)`

This is the extended canonicalization function, offering more granular control over the serialization process.

-   `obj` (any): The JavaScript object to canonicalize.
-   `options` (ISerializeOptions, optional): An object with the following properties:
    -   `allowCircular` (boolean, optional): Same as in `canonicalize`.
    -   `filterUndefined` (boolean, optional): If `true`, `undefined` values in objects will be filtered out. Defaults to `true`.
    -   `undefinedInArrayToNull` (boolean, optional): If `true`, `undefined` values in arrays will be converted to `null`. Defaults to `true`.
    -   `include` (string[], optional): An array of property names to include in the canonicalization.
    -   `exclude` (string[], optional): An array of property names to exclude from the canonicalization.

## 🥂 License

[MIT](./LICENSE.md) as always

# Refs

- (JSON Canonicalization)[https://github.com/cyberphone/json-canonicalization]
