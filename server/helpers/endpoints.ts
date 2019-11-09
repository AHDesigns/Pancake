import { Options } from 'request';
import clone from './clone';

export interface IGitGQL {
    query: string;
    variables: object;
}

export function gitGQL(params: IGitGQL): { options: Options; loggable: Options } {
    const options: Options = {
        method: 'POST',
        uri: 'https://api.github.com/graphql',
        body: params,
        headers: {
            'User-Agent': 'Pancake',
            // isDraft, mergeStateStatus
            Accept: 'application/vnd.github.shadow-cat-preview+json, application/vnd.github.merge-info-preview+json',
            Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
        json: true,
    };

    return {
        options,
        loggable: clean(options),
    };
}

function clean(params: Options): Options {
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
