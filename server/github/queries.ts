import gql from '@helpers/gql';
// TODO: deal with reviewRequests needing variable
// TODO: deal with onBahalfOf needing variable

const prHistory = gql`
    query prHistory($name: String!, $owner: String!, $after: String) {
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
        pullRequests(first: 100, after: $after) {
            pageInfo {
                hasNextPage
                endCursor
            }

            nodes {
                id
                createdAt
                title

                author {
                    login
                    avatarUrl
                }
            }
        }
    }
`;

const getUsers = gql`
    query usersQuery($login: String!, $after: String) {
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

const exported = {
    prHistory,
    getUsers,
};

export default exported;
export { prHistory, getUsers };
