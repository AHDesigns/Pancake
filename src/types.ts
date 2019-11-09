import { TUser } from './shared/types';
/*
 * The details relating to a github repo that will be used
 * by the server to fetch reviews.
 */
export type TPr = {
    id: string;
    createdAt: string;
    isDraft: boolean;
    title: string;
    url: string;
    author: {
        login: string;
        avatarUrl: string;
    };
};

export type TPrHistory = {
    name: string;
    prs?: TPr[];
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isTPrHistory(data: any): data is TPrHistory {
    return typeof data === 'object' && typeof data.name === 'string' && Array.isArray(data.prs);
}

export type TRepoUserFilters = {
    [repoName: string]: {
        whitelist: boolean;
        users: TUser[];
    };
};
