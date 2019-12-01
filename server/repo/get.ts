import { ICache } from '@types';
import { Request, NextFunction, Response } from 'express';

export default (cache: ICache) => (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.json(
            Object.values(cache.all())
                .filter(Boolean)
                .map(({ params }) => params),
        );
    } catch (e) {
        next(e);
    }
};
