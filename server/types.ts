import * as EventEmitter from 'events';
import { IPrData } from '@shared/types';
import { ParamsGitGQL } from './github';

export interface IGitGQL {
    operationName: ParamsGitGQL['operationName'];
    query: string;
    variables: object;
}

export type PageInfo = {
    hasNextPage: boolean;
    endCursor: string;
};

export type TCacheData = {
    [repo: string]: TRepoData;
};

type TRepoData = {
    params: TRepoParams;
    value: IPrData;
};

export type TRepoParams = {
    name: string;
    owner: string;
    prCount: number;
    reviewsCount: number;
};

export interface ICache {
    /**
     * Get clone of whole cache
     */
    all(): TCacheData;
    /**
     * Set details for repo in cache
     */
    set<R extends keyof TCacheData, K extends keyof TRepoData>(repo: R, key: K, value: TRepoData[K]): this;
    /**
     * Get value from cache by key
     */
    get<R extends keyof TCacheData, K extends keyof TRepoData>(repo: R, key: K): TRepoData[K] | undefined;
}

export type TServerInfo = {
    watchedRepos: {
        [key: string]: string[];
    };
    cache: ICache;
    reviewEmitter: EventEmitter;
};
