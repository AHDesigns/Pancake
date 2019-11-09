import send from '../helpers/send';
import { gitGQL } from '../helpers/endpoints';
import { getUsers } from './queries';

// hacky cache
let userStore = [];

export default (req, res, next) => {
    const params = req.body; // TODO: validate

    if (userStore.length > 0) {
        res.json({ users: userStore });
    } else {
        getAllUsers()
            .then(({ users }) => {
                userStore = users;
                res.json(userStore);
            })
            .catch(next);
    }

    async function getAllUsers(allUsers = [], after?: any) {
        const { organization, rateLimit } = await send(
            gitGQL({
                query: getUsers,
                variables: { ...params, ...(after && after) },
            }),
        );

        const {
            membersWithRole: { nodes, pageInfo },
        } = organization;

        const users = allUsers.concat(nodes);

        return pageInfo.hasNextPage && process.env.NODE_ENV === 'production'
            ? getAllUsers(users, { after: pageInfo.endCursor })
            : { rateLimit, users };
    }
};
