// tslint:disable max-line-length
// tslint:disable no-magic-numbers
import { canonicalize } from '../canonicalize';
describe('json canonicalize', function () {
    it('should canonicalize primary types', function () {
        var obj = {
            text: '你好',
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        expect(canonicalize(obj)).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"dt":"2018-12-17T01:08:19.719Z","num":47734.12,"text":"你好"}');
    });
    it('should canonicalize object attribute undefined', function () {
        var obj = {
            text: undefined,
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        expect(canonicalize(obj)).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"dt":"2018-12-17T01:08:19.719Z","num":47734.12}');
    });
    it('should canonicalize array item undefined', function () {
        var obj = {
            arr: [undefined, null, 56, 'a', '12', { t: '455A', a: 123 }],
        };
        expect(canonicalize(obj)).toEqual('{"arr":[null,null,56,"a","12",{"a":123,"t":"455A"}]}');
    });
    it('should throw error when canonicalize array item circular ref', function () {
        var obj = {
            arr: [undefined, null, 56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.arr.push(obj.arr);
        expect(function () { return canonicalize(obj); }).toThrow('Circular reference detected');
    });
    it('should allow canonicalize array item circular ref', function () {
        var obj = {
            arr: [undefined, null, 56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.arr.push(obj.arr);
        expect(canonicalize(obj, true)).toEqual('{"arr":[null,null,56,"a","12",{"a":123,"t":"455A"},"[Circular]"]}');
    });
    it('should throw error when canonicalize obj item circular ref', function () {
        var obj = {
            text: undefined,
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.cir = obj;
        // expect(canonicalize(obj)).toEqual(
        //   '{"arr":[56,"a","12",{"a":123,"t":"455A"}],"dt":"2018-12-17T01:08:19.719Z","num":47734.12}'
        // )
        expect(function () { return canonicalize(obj); }).toThrow('Circular reference detected');
    });
    it('should allow canonicalize obj item circular ref', function () {
        var obj = {
            text: undefined,
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.cir = obj;
        expect(canonicalize(obj, true)).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"cir":"[Circular]","dt":"2018-12-17T01:08:19.719Z","num":47734.12}');
    });
    it('should allow canonicalize obj item circular ref2', function () {
        var obj = {
            text: undefined,
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.cir = obj;
        obj.arr.push(obj);
        expect(canonicalize(obj, true)).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"},"[Circular]"],"cir":"[Circular]","dt":"2018-12-17T01:08:19.719Z","num":47734.12}');
    });
    it('should not treat two references to the same sub-object as a circular reference', function () {
        var sharedObject = { key: 'value' };
        var obj = {
            a: sharedObject,
            b: sharedObject
        };
        expect(canonicalize(obj)).toEqual('{"a":{"key":"value"},"b":{"key":"value"}}');
    });
    it('should not treat two references to the same sub-object in an array as a circular reference', function () {
        var sharedObject = { key: 'value' };
        var obj = {
            arr: [sharedObject, sharedObject]
        };
        expect(canonicalize(obj)).toEqual('{"arr":[{"key":"value"},{"key":"value"}]}');
    });
    it('should not treat two references to the same sub-array as a circular reference', function () {
        var sharedArray = [1, 2];
        var obj = {
            a: sharedArray,
            b: sharedArray
        };
        expect(canonicalize(obj)).toEqual('{"a":[1,2],"b":[1,2]}');
    });
    it('should not treat two references to the same sub-array as a circular reference2', function () {
        var sharedArray = [1, 2];
        var obj = {
            a: [sharedArray],
            b: sharedArray
        };
        expect(canonicalize(obj)).toEqual('{"a":[[1,2]],"b":[1,2]}');
    });
});
//# sourceMappingURL=canonicalize.spec.js.map