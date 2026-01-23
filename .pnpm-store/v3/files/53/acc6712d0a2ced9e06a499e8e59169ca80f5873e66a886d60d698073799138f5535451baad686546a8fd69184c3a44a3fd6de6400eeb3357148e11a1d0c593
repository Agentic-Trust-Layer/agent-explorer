import { _serialize } from '../serializer';

describe('_serialize', () => {
  it('should serialize a simple object correctly', () => {
    const obj = { a: 1, b: 'hello', c: true };
    expect(_serialize(obj)).toBe('{"a":1,"b":"hello","c":true}');
  });

  it('should serialize nested objects and arrays', () => {
    const obj = { a: 1, b: [2, { c: 3 }], d: { e: 4 } };
    expect(_serialize(obj)).toBe('{"a":1,"b":[2,{"c":3}],"d":{"e":4}}');
  });

  it('should handle null and undefined values in objects (filterUndefined: false)', () => {
    const obj = { a: 1, b: null, c: undefined };
    expect(_serialize(obj, { filterUndefined: false })).toBe('{"a":1,"b":null,"c":undefined}');
  });

  it('should filter undefined values in objects when filterUndefined is true', () => {
    const obj = { a: 1, b: null, c: undefined };
    expect(_serialize(obj, { filterUndefined: true })).toBe('{"a":1,"b":null}');
  });

  it('should convert undefined in arrays to null when undefinedInArrayToNull is true', () => {
    const obj = [1, undefined, 3];
    expect(_serialize(obj, { undefinedInArrayToNull: true })).toBe('[1,null,3]');
  });

  it('should not convert undefined in arrays to null when undefinedInArrayToNull is false', () => {
    const obj = [1, undefined, 3];
    expect(_serialize(obj, { undefinedInArrayToNull: false })).toBe('[1,undefined,3]');
  });

  it('should throw an error for circular references by default', () => {
    const obj: any = {};
    obj.a = obj;
    expect(() => _serialize(obj)).toThrow('Circular reference detected');
  });

  it('should handle circular references when allowCircular is true', () => {
    const obj: any = {};
    obj.a = obj;
    expect(_serialize(obj, { allowCircular: true })).toBe('{"a":"[Circular]"}');
  });

  it('should include specified properties when include option is used', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(_serialize(obj, { include: ['a', 'c'] })).toBe('{"a":1,"c":3}');
  });

  it('should exclude specified properties when exclude option is used (string)', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(_serialize(obj, { exclude: 'b' })).toBe('{"a":1,"c":3}');
  });

  it('should exclude specified properties when exclude option is used (array)', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(_serialize(obj, { exclude: ['b', 'c'] })).toBe('{"a":1}');
  });

  it('should handle a combination of options', () => {
    const obj: any = { a: 1, b: undefined, c: [4, undefined], d: { e: 5, f: undefined } };
    obj.g = obj;
    const options = {
      allowCircular: true,
      filterUndefined: true,
      undefinedInArrayToNull: true,
      exclude: 'f',
      include: ['a', 'c', 'g', 'd'],
    };
    expect(_serialize(obj, options)).toBe('{"a":1,"c":[4,null],"d":{"e":5},"g":"[Circular]"}');
  });

  it('should handle objects with toJSON method', () => {
    const obj = {
      a: 1,
      toJSON: () => ({ b: 2 })
    };
    expect(_serialize(obj)).toBe('{"b":2}');
  });

  it('should handle empty objects and arrays', () => {
    expect(_serialize({})).toBe('{}');
    expect(_serialize([])).toBe('[]');
  });

  it('should handle primitive values', () => {
    expect(_serialize(123)).toBe('123');
    expect(_serialize('test')).toBe('"test"');
    expect(_serialize(true)).toBe('true');
    expect(_serialize(null)).toBe('null');
  });
});
