import { ICache } from '@types';
import { Request, NextFunction, Response } from 'express';
import { IPrInfo } from '@shared/types';

export default (cache: ICache) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { key, value } = validateArgs(req.body);
        cache.set(key, 'params', value);
        res.json(Object.values(cache.all()).map(({ params }) => params));
    } catch (e) {
        next(e);
    }
};

function validateArgs(repos: IPrInfo[]): { key: string; value: IPrInfo } {
    const [repo] = repos;
    return {
        key: repo.name,
        value: repo,
    };
}
