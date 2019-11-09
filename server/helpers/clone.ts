/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const isObject = (value: any): value is object => value && typeof value === 'object' && value.constructor === Object;

export default clone;

function clone<T>(input: T): T;
function clone<T>(input: T[]): T[];
function clone<T>(input: T | T[]): T[] | T {
    if (Array.isArray(input)) {
        return input.map(x => clone(x));
    } else if (isObject(input)) {
        return Object.entries(input).reduce(
            (obj, [key, value]) => ({
                ...obj,
                [key]: clone(value),
            }),
            {} as T,
        );
    }
    return input;
}
