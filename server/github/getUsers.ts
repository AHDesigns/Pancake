import { TUser, RateLimit } from '@shared/types';
import send from '../helpers/send';
import gitGQL from './gitGQL';
import getUsers, { TUsers, UsersGitGQL } from './getUsersQuery';

type AllUsers = {
    users: TUser[];
    rateLimit: RateLimit;
};

let userStore: TUser[] = [];

export default (params: UsersGitGQL['variables']): Promise<{ users: TUser[] }> =>
    new Promise((resolve, reject): void => {
        if (userStore.length > 0) {
            resolve({ users: userStore });
        } else {
            getAllUsers()
                .then(({ users }) => {
                    userStore = users;
                    resolve({ users: userStore });
                })
                .catch(reject);
        }

        async function getAllUsers(allUsers: TUser[] = [], after?: string): Promise<AllUsers> {
            const { organization, rateLimit } = await send<TUsers>(
                gitGQL({
                    operationName: 'UsersQuery',
                    query: getUsers,
                    variables: { ...params, ...(after && { after }) },
                }),
            );

            const {
                membersWithRole: { nodes, pageInfo },
            } = organization;

            const users = allUsers.concat(nodes);

            return pageInfo.hasNextPage && process.env.NODE_ENV === 'production'
                ? getAllUsers(users, pageInfo.endCursor)
                : { rateLimit, users };
        }
    });
