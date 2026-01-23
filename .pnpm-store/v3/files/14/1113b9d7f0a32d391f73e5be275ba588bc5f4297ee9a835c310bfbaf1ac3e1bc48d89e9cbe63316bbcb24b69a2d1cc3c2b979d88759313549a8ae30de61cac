/**
 * Represents a Schema validation error.
 *
 * This can occur when a method of the agent is invoked with certain parameters or the returned value doesn't match the
 * declared plugin schema.
 *
 * @public
 */
export declare class ValidationError extends Error {
    method: string;
    code: string;
    message: string;
    path: string;
    description: string;
    constructor(message: string, method: string, code: string, path: string, description: string);
}
export declare class PluginReturnTypeError extends Error {
    method: string;
    code: string;
    message: string;
    path: string;
    description: string;
    constructor(message: string, method: string, code: string, path: string, description: string);
}
export declare const validateArguments: (method: string, args: any, schema: object) => void;
export declare const validateReturnType: (method: string, args: any, schema: object) => void;
//# sourceMappingURL=validator.d.ts.map