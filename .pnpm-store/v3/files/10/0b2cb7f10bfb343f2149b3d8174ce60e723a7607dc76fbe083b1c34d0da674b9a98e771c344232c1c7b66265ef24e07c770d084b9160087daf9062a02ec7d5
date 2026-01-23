export function _serialize(obj, options) {
    let buffer = '';
    const vInclude = options && options.include;
    let vExclude = options && options.exclude;
    if (vExclude) {
        if (typeof vExclude === 'string')
            vExclude = [vExclude];
    }
    if (vInclude)
        vInclude.sort();
    const visited = new WeakMap();
    const allowCircular = options && options.allowCircular;
    const filterUndefined = options && options.filterUndefined;
    const undefinedInArrayToNull = options && options.undefinedInArrayToNull;
    serialize(obj, '');
    return buffer;
    function serialize(object, path) {
        if (object === null ||
            typeof object !== 'object' ||
            object.toJSON != null) {
            /////////////////////////////////////////////////
            // Primitive data type - Use ES6/JSON          //
            /////////////////////////////////////////////////
            buffer += JSON.stringify(object);
        }
        else if (Array.isArray(object)) {
            /////////////////////////////////////////////////
            // Array - Maintain element order              //
            /////////////////////////////////////////////////
            const visitedPath = visited.get(object);
            if (visitedPath !== undefined) {
                if (path.startsWith(visitedPath)) {
                    if (!allowCircular) {
                        throw new Error('Circular reference detected');
                    }
                    buffer += '"[Circular]"';
                    return;
                }
            }
            visited.set(object, path);
            buffer += '[';
            let next = false;
            object.forEach((element, index) => {
                if (next) {
                    buffer += ',';
                }
                next = true;
                if (undefinedInArrayToNull && element === undefined) {
                    element = null;
                }
                /////////////////////////////////////////
                // Array element - Recursive expansion //
                /////////////////////////////////////////
                serialize(element, `${path}[${index}]`);
            });
            buffer += ']';
        }
        else {
            /////////////////////////////////////////////////
            // Object - Sort properties before serializing //
            /////////////////////////////////////////////////
            const visitedPath = visited.get(object);
            if (visitedPath !== undefined) {
                if (path.startsWith(visitedPath)) {
                    if (!allowCircular) {
                        throw new Error('Circular reference detected');
                    }
                    buffer += '"[Circular]"';
                    return;
                }
            }
            visited.set(object, path);
            buffer += '{';
            let next = false;
            const addProp = (property) => {
                if (vExclude && vExclude.includes(property)) {
                    return;
                }
                if (next) {
                    buffer += ',';
                }
                next = true;
                ///////////////////////////////////////////////
                // Property names are strings - Use ES6/JSON //
                ///////////////////////////////////////////////
                buffer += JSON.stringify(property);
                buffer += ':';
                //////////////////////////////////////////
                // Property value - Recursive expansion //
                //////////////////////////////////////////
                serialize(object[property], `${path}.${property}`);
            };
            if (path === '' && vInclude) {
                vInclude.forEach((property) => {
                    if (object.hasOwnProperty(property)) {
                        addProp(property);
                    }
                });
            }
            else {
                let vKeys = Object.keys(object);
                if (filterUndefined) {
                    vKeys = vKeys.filter((k) => object[k] !== undefined);
                }
                vKeys.sort();
                vKeys.forEach((property) => {
                    addProp(property);
                });
            }
            buffer += '}';
        }
    }
}
//# sourceMappingURL=serializer.js.map