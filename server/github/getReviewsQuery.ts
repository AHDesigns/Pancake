import {
    MergeStateStatus,
    Mergeable,
    StatusState,
    IReviewRequest,
    reviewStates,
    DateTime,
    RateLimit,
} from '@shared/types';
import { PageInfo, IGitGQL } from '@types';

const reviewsQuery = `
    query ReviewsQuery($name: String!, $owner: String!, $prCount: Int = 5, $reviewsCount: Int = 5, $after: String) {
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
                baseRefName
                headRefName
                labels(first: 10) {
                    nodes {
                    name
                    }
                }
                repository {
                    id
                }
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
export default reviewsQuery;

export type TPrReview = {
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

type TCommit = {
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
};

export type TGithubPr = {
    baseRefName: string;
    headRefName: string;
    labels: {
        nodes: Array<{
            name: string;
        }>;
    };
    repository: {
        id: string;
    };
    updatedAt: DateTime;
    id: string;
    createdAt: DateTime;
    url: string;
    title: string;
    isDraft: boolean;
    mergeStateStatus: MergeStateStatus;
    mergeable: Mergeable;
    commits: {
        nodes: TCommit[];
    };
    author: {
        login: string;
        avatarUrl: string;
    };
    reviewRequests: {
        nodes: IReviewRequest[];
    };

    reviews: {
        nodes: TPrReview[];
    };
};

export type TReviews = {
    rateLimit: RateLimit;
    repository: {
        name: string;
        pullRequests: {
            pageInfo: PageInfo;
            nodes: TGithubPr[];
        };
    };
};

export interface ReviewsGitGQL extends IGitGQL {
    operationName: 'ReviewsQuery';
    query: typeof reviewsQuery;
    variables: {
        name: string;
        owner: string;
        prCount: number;
        reviewsCount: number;
        after?: string;
    };
}
