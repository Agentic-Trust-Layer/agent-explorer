import { Category } from "../log/category/Category";
export interface JSONType<T> {
    getValue(): T;
    toString(): string;
}
export declare type ArrayType = boolean | string | number | JSONObject | null;
export declare class JSONObject {
    private values;
    addBoolean(name: string, value: boolean): JSONObject;
    addNumber(name: string, value: number): JSONObject;
    addString(name: string, value: string): JSONObject;
    addNull(name: string): JSONObject;
    addArray(name: string, array: JSONArray<ArrayType>): JSONObject;
    addObject(name: string, object: JSONObject): JSONObject;
    toString(pretty?: boolean): string;
    private checkName;
    private static checkValue;
}
export declare class JSONArray<T extends ArrayType> {
    private objects;
    add(object: T): JSONArray<T>;
    toString(pretty?: boolean): string;
}
/**
 * Utility class that helps us convert things to and from json (not for normal usage).
 */
export declare class JSONHelper {
    static categoryToJSON(cat: Category, recursive: boolean): JSONObject;
    private static _categoryToJSON;
}
