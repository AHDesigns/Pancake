const getReviews = require('./github/reviews');

module.exports = ({ cache, reviewEmitter, log, watchedRepos }) => {
    const requests = Object.values(watchedRepos).reduce(dedupe, []);

    log.info('fetching data', requests);

    Promise.all(
        requests.map(repo =>
            getReviews(repo, cache.get([repo, 'params']))
                .then(data => {
                    const oldData = cache.get([repo, 'value']) || {};
                    const changes = getChanges(oldData.pullRequests, data.pullRequests);
                    cache.set([repo, 'value'], data);

                    if (changes.every(pr => pr.boardStatus === 'UNCHANGED')) {
                        log.info(`no new data for ${repo}`);
                    } else {
                        log.info(`emitting data for ${repo}`);
                        reviewEmitter.emit('new-reviews', { repo, data: { name: repo, pullRequests: changes } });
                    }
                    reviewEmitter.emit('rate-limit', data.rateLimit);
                })
                .catch(e => {
                    console.log(e);
                }),
        ),
    );
};

const dedupe = (all, curr) => {
    curr.forEach(repo => {
        if (all.includes(repo)) {
            return;
        }
        all.push(repo);
    });
    return all;
};

function getChanges(old = [], current = []) {
    // TODO: can add removed for animation
    return current.reduce((prs, pr) => {
        const maybeEdited = old.find(oldPr => oldPr.id === pr.id);
        const unchanged = pr.updatedAt === (maybeEdited || {}).updatedAt;
        /* eslint-disable no-param-reassign */
        if (!maybeEdited) {
            pr.boardStatus = 'NEW';
        } else if (unchanged) {
            pr.boardStatus = 'UNCHANGED';
        } else {
            pr.boardStatus = 'UPDATED';
        }
        /* eslint-enable no-param-reassign */

        prs.push(pr);
        return prs;
    }, []);
}
