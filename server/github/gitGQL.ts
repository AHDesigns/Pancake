import { Options } from 'request';
import clone from '@helpers/clone';
import { ParamsGitGQL } from '.';
import traverse from '@helpers/traverse';

export default function gitGQL(params: ParamsGitGQL): { options: Options; loggable: Options } {
    const options: Options = {
        method: 'POST',
        uri: 'https://api.github.com/graphql',
        body: {
            ...params,
            query: trim(params.query),
        },
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

function trim(str: string): string {
    return str.replace(/\n/g, '').replace(/ +/g, ' ');
}

function clean(params: Options): Options {
    const safe = clone(params);
    if (params.headers && params.headers.Authorization && safe.headers) {
        safe.headers.Authorization = params.headers.Authorization.replace(/./g, 'x');
    }
    safe.body.variables = traverse(safe.body.variables, (value: any) => (value + '').replace(/./g, 'x'));

    return safe;
}
