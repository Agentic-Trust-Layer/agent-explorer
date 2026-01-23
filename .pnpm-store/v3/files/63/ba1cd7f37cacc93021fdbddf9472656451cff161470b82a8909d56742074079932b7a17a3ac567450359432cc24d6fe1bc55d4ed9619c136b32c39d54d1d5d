import { _serialize } from './serializer';
/**
 * The main function for JSON canonicalization. It takes a JavaScript object and returns its canonical string representation.
 *
 * @param obj The JavaScript object to canonicalize.
 * @param allowCircular If `true`, the function will handle circular references in the object by replacing them with `null`. Defaults to `false`.
 * @returns The canonical string representation of the object.
 */
export function canonicalize(obj, allowCircular) {
    return _serialize(obj, {
        allowCircular: allowCircular,
        filterUndefined: true,
        undefinedInArrayToNull: true,
    });
}
//# sourceMappingURL=canonicalize.js.map