import { IPrData, reviewStates, IUniqueReview, IPullRequest, RateLimit } from '@shared/types';

import send from '@helpers/send';
import gitGQL from './gitGQL';
import reviewsQuery, { TReviews, TGithubPr, TPrReview, ReviewsGitGQL } from './getReviewsQuery';

const { PENDING, APPROVED, CHANGES_REQUESTED } = reviewStates;

type TAllReviews = {
    name: string;
    prs: TGithubPr[];
    rateLimit: RateLimit;
};

export default (params: ReviewsGitGQL['variables']): Promise<IPrData> =>
    new Promise((resolve, reject): void => {
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

        async function getAllReviews(allPrs = [] as TGithubPr[], after?: string): Promise<TAllReviews> {
            const { repository, rateLimit } = await send<TReviews>(
                gitGQL({
                    operationName: 'ReviewsQuery',
                    query: reviewsQuery,
                    variables: { ...params, ...(after && { after }) },
                }),
            );

            const {
                name,
                pullRequests: { pageInfo, nodes },
            } = repository;

            const prs = allPrs.concat(nodes);

            return pageInfo.hasNextPage ? getAllReviews(prs, pageInfo.endCursor) : { name, rateLimit, prs };
        }
    });

function calcReviewState(rawReviews: TPrReview[]): IPullRequest['reviews'] {
    const uniqueReviews = getLatestReviewStates(rawReviews);

    const state = uniqueReviews.reduce(reviewStateFromReviews, PENDING);

    return { uniqueReviews, state };

    function getLatestReviewStates(reviews: TPrReview[]): IUniqueReview[] {
        return reviews.reduceRight<IUniqueReview[]>((allReviews, review) => {
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

        // function reviewerTeam({ nodes }) {
        //     // TODO: could be on behalf of more than one team but unlikely
        //     return nodes[0] && nodes[0].name;
        // }
    }

    function reviewStateFromReviews(currState: reviewStates, review: IUniqueReview): reviewStates {
        if (currState === CHANGES_REQUESTED) {
            return currState;
        }

        // this was currState so what the hell?
        if (review.state === CHANGES_REQUESTED) {
            return CHANGES_REQUESTED;
        }

        return APPROVED;
    }
}
