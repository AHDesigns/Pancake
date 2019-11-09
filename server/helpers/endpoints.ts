const clone = require('./clone');

function gitGQL({ query, variables = '{}' }) {
    const options = {
        method: 'POST',
        uri: 'https://api.github.com/graphql',
        body: {
            query,
            variables,
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
        loggable: clean(clone(options)),
    };

    /* eslint-disable prefer-template */
    function clean(params) {
        const safe = params;
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
}

module.exports = { gitGQL };
