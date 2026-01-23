/**
 * Checks if a variable is defined and not null.
 * After this check, typescript sees the variable as defined.
 *
 * @param arg - The input to be verified
 *
 * @returns true if the input variable is defined.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function isDefined<T>(arg: T): arg is Exclude<T, null | undefined>;
/**
 * Ensures that a given input is an array. If the input is a single item, it is converted to an array with a single
 * entry.
 *
 * @param arg - a variable that needs to be converted to array
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function asArray<T>(arg?: T | T[] | any): (T | any)[];
/**
 * Checks if an object is iterable (can be used for `for..of`)
 * @param obj - the variable to be checked
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function isIterable<T>(obj: any): obj is Iterable<T>;
/**
 * Compute the intersection of two arrays
 * Elements are compared by reference so object types will appear as unique even if they contain the same data.
 *
 * @param a - first array
 * @param b - second array
 * @returns The intersection of the two arrays.
 *
 * @public
 */
export declare function intersect<T>(a: T[] | any, b: any[] | any): T[];
//# sourceMappingURL=type-utils.d.ts.map