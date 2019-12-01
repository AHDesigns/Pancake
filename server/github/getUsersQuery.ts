import { RateLimit } from '@shared/types';
import { PageInfo, IGitGQL } from '@types';

const usersQuery = `
    query UsersQuery($login: String!, $after: String) {
        rateLimit {
            limit
            cost
            nodeCount
            remaining
            resetAt
        }
        organization(login: $login) {
            membersWithRole(first: 100, after: $after) {
                pageInfo {
                    hasNextPage
                    endCursor
                }

                nodes {
                    name
                    avatarUrl
                    id
                    login
                }
            }
        }
    }
`;

export default usersQuery;

export type TUsers = {
    rateLimit: RateLimit;
    organization: {
        membersWithRole: {
            pageInfo: PageInfo;
            nodes: Array<{
                name: string;
                avatarUrl: string;
                id: string;
                login: string;
            }>;
        };
    };
};

export interface UsersGitGQL extends IGitGQL {
    operationName: 'UsersQuery';
    query: typeof usersQuery;
    variables: {
        login: string;
        after?: string;
    };
}
