/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any | any[];
type AnyFn = (arg0: Any) => Any;

const isObject = (value: Any): value is object => value && typeof value === 'object' && value.constructor === Object;

const cautious = (evaluate: AnyFn): ((a: Any) => Any) => (args: Any): Any => {
    if (!args) return;
    try {
        const res = evaluate(args);
        return res;
    } catch (e) {
        console.warn(`traverse error: ${e.message}`); // eslint-disable-line no-console
        return args;
    }
};

const transformArr = (evaluate: AnyFn, arr: any[]): any[] => arr.map(evaluate);

const transformObj = (evaluate: AnyFn, obj: object): object =>
    Object.entries(obj).reduce(
        (newObj, [key, value]) => ({
            ...newObj,
            [key]: evaluate(value),
        }),
        {},
    );

const apply = (func: AnyFn): ((v: Any) => Any) => (value: Any): Any => {
    if (isObject(value)) {
        return transformObj(apply(func), value);
    } else if (Array.isArray(value)) {
        return transformArr(apply(func), value);
    }

    return func(value);
};

// takes a function and applies it to any leaf inside an object or array combination
// if called without a withFunction, will return a deep copy of the obj/array/value
export default (toLeafValue: Any, func = (x: Any): Any => x): Any => apply(cautious(func))(toLeafValue);
