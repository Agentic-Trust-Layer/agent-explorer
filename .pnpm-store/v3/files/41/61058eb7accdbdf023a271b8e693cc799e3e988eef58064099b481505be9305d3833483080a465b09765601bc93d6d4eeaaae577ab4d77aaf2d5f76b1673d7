import ZSchema from 'z-schema';
const validator = new ZSchema({});
// @ts-ignore
validator.setRemoteReference('http://json-schema.org/draft-07/schema#', {
    type: ['array', 'boolean', 'integer', 'number', 'object', 'string'],
});
/**
 * Represents a Schema validation error.
 *
 * This can occur when a method of the agent is invoked with certain parameters or the returned value doesn't match the
 * declared plugin schema.
 *
 * @public
 */
export class ValidationError extends Error {
    method;
    code;
    message;
    path;
    description;
    constructor(message, method, code, path, description) {
        super(message);
        this.name = 'ValidationError';
        this.message = message + '; ' + method + '; ' + path + '; ' + code + '; ' + description;
        this.method = method;
        this.description = description;
        this.path = path;
        this.code = code;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
export class PluginReturnTypeError extends Error {
    method;
    code;
    message;
    path;
    description;
    constructor(message, method, code, path, description) {
        super(message);
        this.name = 'PluginReturnTypeError';
        this.message = message + '; ' + method + '; ' + path + '; ' + code + '; ' + description;
        this.method = method;
        this.description = description;
        this.path = path;
        this.code = code;
        Object.setPrototypeOf(this, PluginReturnTypeError.prototype);
    }
}
export const validateArguments = (method, args, schema) => {
    const valid = validator.validate(args, schema, {
        // @ts-ignore
        schemaPath: 'components.methods.' + method + '.arguments',
    });
    if (!valid) {
        const errors = validator.getLastErrors();
        throw new ValidationError(errors[0].message, method, errors[0].code, errors[0].path, errors[0].description);
    }
};
export const validateReturnType = (method, args, schema) => {
    const valid = validator.validate(args, schema, {
        // @ts-ignore
        schemaPath: 'components.methods.' + method + '.returnType',
    });
    if (!valid) {
        const errors = validator.getLastErrors();
        throw new PluginReturnTypeError(errors[0].message, method, errors[0].code, errors[0].path, errors[0].description);
    }
};
//# sourceMappingURL=validator.js.map