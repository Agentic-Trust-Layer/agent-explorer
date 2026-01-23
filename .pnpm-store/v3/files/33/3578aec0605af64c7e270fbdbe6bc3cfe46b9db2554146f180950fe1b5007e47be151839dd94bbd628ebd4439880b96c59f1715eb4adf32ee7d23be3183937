/**
 * Double linkedlist implementation.
 */
export declare class LinkedList<T> {
    private head;
    private size;
    addHead(value: T): void;
    addTail(value: T): void;
    clear(): void;
    getHead(): T | null;
    removeHead(): T | null;
    getTail(): T | null;
    removeTail(): T | null;
    getSize(): number;
    filter(f: (value: T) => boolean): T[];
    private createHeadIfNeeded;
    private getTailNode;
}
/**
 * Map implementation keyed by string (always).
 */
export declare class SimpleMap<V> {
    private array;
    put(key: string, value: V): void;
    get(key: string): V | undefined;
    exists(key: string): boolean;
    remove(key: string): V | undefined;
    keys(): string[];
    values(): V[];
    size(): number;
    isEmpty(): boolean;
    clear(): void;
    forEach(cbFunction: (key: string, value: V, index: number) => void): void;
    forEachValue(cbFunction: (value: V, index: number) => void): void;
}
/**
 * Tuple to hold two values.
 */
export declare class TuplePair<X, Y> {
    private _x;
    private _y;
    constructor(x: X, y: Y);
    get x(): X;
    set x(value: X);
    get y(): Y;
    set y(value: Y);
}
/**
 * Utility class to build up a string.
 */
export declare class StringBuilder {
    private data;
    append(line: string): StringBuilder;
    appendLine(line: string): StringBuilder;
    isEmpty(): boolean;
    clear(): void;
    toString(separator?: string): string;
}
