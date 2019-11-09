import { MergeStateStatus, Mergeable, StatusState, IReviewRequest, reviewStates } from '@shared/types';
import gql from '@helpers/gql';
// can do something with this later
type DateTime = string;

type PageInfo = {
    hasNextPage: boolean;
    endCursor: string;
};

export type PrReview = {
    url: string;
    createdAt: string;
    state: reviewStates;
    authorAssociation: string;
    author: {
        login: string;
        avatarUrl: string;
    };
    onBehalfOf: {
        nodes: Array<{
            login: string;
            avatarUrl: string;
        }>;
    };
};

export type TGithubPullRequest = {
    pageInfo: PageInfo;
    nodes: Array<{
        updatedAt: DateTime;
        id: string;
        createdAt: DateTime;
        url: string;
        title: string;
        isDraft: boolean;
        mergeStateStatus: MergeStateStatus;
        mergeable: Mergeable;
        commits: {
            nodes: Array<{
                commit: {
                    commitUrl: string;
                    message: string;
                    status: {
                        contexts: {
                            description: string;
                            avatarUrl: string;
                            state: StatusState;
                        };
                        state: StatusState;
                    };
                };
            }>;
        };
        author: {
            login: string;
            avatarUrl: string;
        };
        reviewRequests: {
            nodes: IReviewRequest[];
        };

        reviews: {
            nodes: PrReview[];
        };
    }>;
};

export type RateLimit = {
    limit: number;
    cost: number;
    nodeCount: number;
    remaining: number;
    resetAt: DateTime;
};

type TReviews = {
    rateLimit: RateLimit;
    repository: {
        name: string;
        pullRequests: TGithubPullRequest;
    };
};

type TReviewsInput = {
    name: string;
    owner: string;
    prCount: number;
    reviewsCount: number;
    after: string;
};

const reviewsQuery = gql`
    query reviewsQuery($name: String!, $owner: String!, $prCount: Int = 5, $reviewsCount: Int = 5, $after: String) {
        rateLimit {
            limit
            cost
            nodeCount
            remaining
            resetAt
        }
        repository(name: $name, owner: $owner) {
            name
            ...pullRequests
        }
    }

    fragment pullRequests on Repository {
        pullRequests(first: $prCount, states: [OPEN], after: $after) {
            pageInfo {
                hasNextPage
                endCursor
            }

            nodes {
                updatedAt
                id
                createdAt
                url
                title
                isDraft
                mergeStateStatus
                mergeable

                ...commits

                author {
                    login
                    avatarUrl
                }

                reviewRequests(first: 1) {
                    nodes {
                        requestedReviewer {
                            ... on User {
                                userName: name
                                avatarUrl
                            }
                            ... on Team {
                                teamName: name
                                avatarUrl
                            }
                        }
                    }
                }

                reviews(first: $reviewsCount, states: [CHANGES_REQUESTED, APPROVED]) {
                    nodes {
                        url
                        createdAt
                        state
                        authorAssociation

                        author {
                            login
                            avatarUrl
                        }

                        onBehalfOf(first: 1) {
                            nodes {
                                login: name
                                avatarUrl
                            }
                        }
                    }
                }
            }
        }
    }

    fragment commits on PullRequest {
        commits(last: 1) {
            nodes {
                commit {
                    commitUrl
                    message
                    status {
                        contexts {
                            description
                            avatarUrl
                            state
                        }
                        state
                    }
                }
            }
        }
    }
`;

export { reviewsQuery, TReviews, TReviewsInput };
