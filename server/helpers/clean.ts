import { Options } from 'request';
import clone from '@helpers/clone';

export default function clean(params: Options): Options {
    const safe = clone(params);
    safe.headers.Authorization = params.headers.Authorization.replace(/./g, 'x');
    safe.body.variables = Object.entries(safe.body.variables).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: (value + '').replace(/./g, 'x'),
        }),
        {},
    );

    return safe;
}
