import { TUser } from '@shared/types';
import { Request, NextFunction, Response } from 'express';
import send from '../helpers/send';
import { gitGQL } from '../helpers/endpoints';
import { getUsers } from './queries';

// hacky cache
let userStore: TUser[] = [];

export default (req: Request, res: Response, next: NextFunction): void => {
    const params = req.body; // TODO: validate

    if (userStore.length > 0) {
        res.json({ users: userStore });
    } else {
        getAllUsers()
            .then(({ users }) => {
                userStore = users;
                res.json({ users: userStore });
            })
            .catch(next);
    }

    async function getAllUsers(allUsers: TUser[] = [], after?: any): Promise<{ users: TUser[]; rateLimit: any }> {
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
