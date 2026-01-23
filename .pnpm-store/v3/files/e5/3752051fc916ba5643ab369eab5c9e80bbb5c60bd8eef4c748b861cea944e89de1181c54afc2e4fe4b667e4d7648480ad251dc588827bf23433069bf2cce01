import { _serialize } from './serializer';
/**
 * The extended canonicalization function, offering more granular control over the serialization process.
 *
 * @param obj The JavaScript object to canonicalize.
 * @param options An object with the following properties:
 *  - `allowCircular` (boolean, optional): Same as in `canonicalize`.
 *  - `filterUndefined` (boolean, optional): If `true`, `undefined` values in objects will be filtered out. Defaults to `true`.
 *  - `undefinedInArrayToNull` (boolean, optional): If `true`, `undefined` values in arrays will be converted to `null`. Defaults to `true`.
 *  - `include` (string[], optional): An array of property names to include in the canonicalization.
 *  - `exclude` (string[], optional): An array of property names to exclude from the canonicalization.
 * @returns The canonical string representation of the object.
 */
export function canonicalizeEx(obj, options) {
    return _serialize(obj, options);
}
//# sourceMappingURL=canonicalize-ex.js.map