const isObject = value => value && typeof value === 'object' && value.constructor === Object;

export default function clone(input) {
    if (isObject(input)) {
        return Object.entries(input).reduce(
            (obj, [key, value]) => ({
                ...obj,
                [key]: clone(value),
            }),
            {},
        );
    } else if (Array.isArray(input)) {
        return input.map(clone);
    }
    return input;
};
