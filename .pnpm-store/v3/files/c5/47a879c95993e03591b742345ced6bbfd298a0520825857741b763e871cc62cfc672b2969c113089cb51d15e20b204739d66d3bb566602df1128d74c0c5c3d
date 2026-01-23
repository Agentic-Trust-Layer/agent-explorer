export function _serialize(obj, options) {
    var buffer = '';
    var vInclude = options && options.include;
    var vExclude = options && options.exclude;
    if (vExclude) {
        if (typeof vExclude === 'string')
            vExclude = [vExclude];
    }
    if (vInclude)
        vInclude.sort();
    var visited = new WeakMap();
    var allowCircular = options && options.allowCircular;
    var filterUndefined = options && options.filterUndefined;
    var undefinedInArrayToNull = options && options.undefinedInArrayToNull;
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
            var visitedPath = visited.get(object);
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
            var next_1 = false;
            object.forEach(function (element, index) {
                if (next_1) {
                    buffer += ',';
                }
                next_1 = true;
                if (undefinedInArrayToNull && element === undefined) {
                    element = null;
                }
                /////////////////////////////////////////
                // Array element - Recursive expansion //
                /////////////////////////////////////////
                serialize(element, path + "[" + index + "]");
            });
            buffer += ']';
        }
        else {
            /////////////////////////////////////////////////
            // Object - Sort properties before serializing //
            /////////////////////////////////////////////////
            var visitedPath = visited.get(object);
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
            var next_2 = false;
            var addProp_1 = function (property) {
                if (vExclude && vExclude.includes(property)) {
                    return;
                }
                if (next_2) {
                    buffer += ',';
                }
                next_2 = true;
                ///////////////////////////////////////////////
                // Property names are strings - Use ES6/JSON //
                ///////////////////////////////////////////////
                buffer += JSON.stringify(property);
                buffer += ':';
                //////////////////////////////////////////
                // Property value - Recursive expansion //
                //////////////////////////////////////////
                serialize(object[property], path + "." + property);
            };
            if (path === '' && vInclude) {
                vInclude.forEach(function (property) {
                    if (object.hasOwnProperty(property)) {
                        addProp_1(property);
                    }
                });
            }
            else {
                var vKeys = Object.keys(object);
                if (filterUndefined) {
                    vKeys = vKeys.filter(function (k) { return object[k] !== undefined; });
                }
                vKeys.sort();
                vKeys.forEach(function (property) {
                    addProp_1(property);
                });
            }
            buffer += '}';
        }
    }
}
//# sourceMappingURL=serializer.js.map