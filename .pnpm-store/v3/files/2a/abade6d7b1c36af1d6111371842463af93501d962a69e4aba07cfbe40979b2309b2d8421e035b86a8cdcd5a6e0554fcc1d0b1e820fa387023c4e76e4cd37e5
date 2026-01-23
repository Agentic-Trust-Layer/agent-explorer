// tslint:disable max-line-length
// tslint:disable no-magic-numbers
import { canonicalizeEx as canonicalize } from '../canonicalize-ex';
describe('json canonicalize ex', () => {
    it('should canonicalize primary types', () => {
        const obj = {
            text: '你好',
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        expect(canonicalize(obj)).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"dt":"2018-12-17T01:08:19.719Z","num":47734.12,"text":"你好"}');
    });
    it('should canonicalize primary types and exclude a prop', () => {
        const obj = {
            text: '你好',
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        expect(canonicalize(obj, { exclude: 'num' })).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"dt":"2018-12-17T01:08:19.719Z","text":"你好"}');
    });
    it('should canonicalize primary types and exclude multi props', () => {
        const obj = {
            text: '你好',
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        expect(canonicalize(obj, { exclude: ['num', 'dt'] })).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"text":"你好"}');
    });
    it('should canonicalize primary types and include multi props', () => {
        const obj = {
            text: '你好',
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        const result = canonicalize(obj, { include: ['text', 'arr'] });
        expect(result).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"text":"你好"}');
    });
    it('should throw error when canonicalize array item circular ref', () => {
        const obj = {
            arr: [undefined, null, 56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.arr.push(obj.arr);
        expect(() => canonicalize(obj)).toThrow('Circular reference detected');
    });
    it('should allow canonicalize array item circular ref', () => {
        const obj = {
            arr: [undefined, null, 56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.arr.push(obj.arr);
        expect(canonicalize(obj, { allowCircular: true })).toEqual('{"arr":[undefined,null,56,"a","12",{"a":123,"t":"455A"},"[Circular]"]}');
    });
    it('should throw error when canonicalize obj item circular ref', () => {
        const obj = {
            text: undefined,
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.cir = obj;
        expect(() => canonicalize(obj)).toThrow('Circular reference detected');
    });
    it('should allow canonicalize obj item circular ref', () => {
        const obj = {
            text: undefined,
            num: 47734.12,
            dt: new Date('2018-12-17T01:08:19.719Z'),
            arr: [56, 'a', '12', { t: '455A', a: 123 }],
        };
        obj.cir = obj;
        const result = canonicalize(obj, { allowCircular: true });
        expect(result).toEqual('{"arr":[56,"a","12",{"a":123,"t":"455A"}],"cir":"[Circular]","dt":"2018-12-17T01:08:19.719Z","num":47734.12,"text":undefined}');
    });
    it('should not treat two references to the same sub-object as a circular reference', () => {
        const sharedObject = { key: 'value' };
        const obj = {
            a: sharedObject,
            b: sharedObject
        };
        expect(canonicalize(obj)).toEqual('{"a":{"key":"value"},"b":{"key":"value"}}');
    });
    it('should not treat two references to the same sub-object in an array as a circular reference', () => {
        const sharedObject = { key: 'value' };
        const obj = {
            arr: [sharedObject, sharedObject]
        };
        expect(canonicalize(obj)).toEqual('{"arr":[{"key":"value"},{"key":"value"}]}');
    });
    it('should not treat two references to the same sub-array as a circular reference', () => {
        const sharedArray = [1, 2];
        const obj = {
            a: sharedArray,
            b: sharedArray
        };
        expect(canonicalize(obj)).toEqual('{"a":[1,2],"b":[1,2]}');
    });
});
//# sourceMappingURL=canonicalize-ex.spec.js.map