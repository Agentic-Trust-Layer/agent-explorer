(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JsonCanonicalize = {}));
}(this, (function (exports) { 'use strict';

    function _serialize(r,e){var i="",t=e&&e.include,n=e&&e.exclude;n&&"string"==typeof n&&(n=[n]),t&&t.sort();var o=new WeakMap,f=e&&e.allowCircular,a=e&&e.filterUndefined,c=e&&e.undefinedInArrayToNull;return function r(e,l){if(null===e||"object"!=typeof e||null!=e.toJSON)i+=JSON.stringify(e);else if(Array.isArray(e)){if(void 0!==(s=o.get(e))&&l.startsWith(s)){if(!f)throw new Error("Circular reference detected");return void(i+='"[Circular]"')}o.set(e,l),i+="[";var u=!1;e.forEach((function(e,t){u&&(i+=","),u=!0,c&&void 0===e&&(e=null),r(e,l+"["+t+"]");})),i+="]";}else {var s;if(void 0!==(s=o.get(e))&&l.startsWith(s)){if(!f)throw new Error("Circular reference detected");return void(i+='"[Circular]"')}o.set(e,l),i+="{";var d=!1,v=function(t){n&&n.includes(t)||(d&&(i+=","),d=!0,i+=JSON.stringify(t),i+=":",r(e[t],l+"."+t));};if(""===l&&t)t.forEach((function(r){e.hasOwnProperty(r)&&v(r);}));else {var y=Object.keys(e);a&&(y=y.filter((function(r){return void 0!==e[r]}))),y.sort(),y.forEach((function(r){v(r);}));}i+="}";}}(r,""),i}

    function canonicalize(e,i){return _serialize(e,{allowCircular:i,filterUndefined:!0,undefinedInArrayToNull:!0})}

    function canonicalizeEx(i,e){return _serialize(i,e)}

    exports.canonicalize = canonicalize;
    exports.canonicalizeEx = canonicalizeEx;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.min.js.map
