const send = require('../helpers/send');
const { gitGQL } = require('../helpers/endpoints');
const { reviewsQuery } = require('./queries');

module.exports = (repo, params) =>
    new Promise((resolve, reject) => {
        getAllReviews()
            .then(({ name, rateLimit, prs }) => {
                resolve({
                    name,
                    // reversed to put newest pr's at top
                    pullRequests: prs.reverse().map(pr => ({
                        ...pr,
                        reviews: calcReviewState(pr.reviews.nodes),
                        statuses: pr.commits.nodes[0].commit,
                    })),
                    rateLimit,
                });
            })
            .catch(() => {
                reject();
            });

        async function getAllReviews(allPrs = [], after) {
            const { repository, rateLimit } = await send(
                gitGQL({
                    query: reviewsQuery,
                    variables: { ...params, ...(after && after) },
                }),
            );

            const {
                name,
                pullRequests: { pageInfo, nodes },
            } = repository;

            const prs = allPrs.concat(nodes);

            return pageInfo.hasNextPage ? getAllReviews(prs, { after: pageInfo.endCursor }) : { name, rateLimit, prs };
        }
    });

const reviewStates = {
    PENDING: 'PENDING',
    COMMENTED: 'COMMENTED',
    APPROVED: 'APPROVED',
    CHANGES_REQUESTED: 'CHANGES_REQUESTED',
    DISMISSED: 'DISMISSED',
};

function calcReviewState(rawReviews) {
    const uniqueReviews = getLatestReviewStates(rawReviews);

    const state = uniqueReviews.reduce(reviewStateFromReviews, reviewStates.PENDIING);

    return { uniqueReviews, state };

    function getLatestReviewStates(reviews) {
        return reviews.reduceRight((allReviews, review) => {
            const hasAlreadyReviewed = allReviews.find(({ author }) => author.login === review.author.login);

            if (!hasAlreadyReviewed) {
                // TODO: authorAssociation NONE should be removed (as they have left the org)
                allReviews.push({
                    ...review,
                    onBehalfOf: review.onBehalfOf.nodes[0],
                });
            }
            return allReviews;
        }, []);

        function reviewerTeam({ nodes }) {
            // TODO: could be on behalf of more than one team but unlikely
            return nodes[0] && nodes[0].name;
        }
    }

    function reviewStateFromReviews(currState, review) {
        if (currState === reviewStates.CHANGES_REQUESTED) {
            return currState;
        }

        if (review.currState === reviewStates.CHANGES_REQUESTED) {
            return reviewStates.CHANGES_REQUESTED;
        }

        return reviewStates.APPROVED;
    }
}
