import * as express from 'express';
import { join } from 'path';

import log from './helpers/logger';
import getUsers from './github/getUsers';
import getRepos from './repo/get';
import putRepo from './repo/put';
import { ICache } from './types';

export default (app: express.Express, cache: ICache): void => {
    app.use('/static', express.static(join(`${__dirname}/../build/static`)));

    app.get('/', (_, res) => {
        res.sendFile(join(`${__dirname}/../build/index.html`));
    });

    app.put('/users', getUsers);

    app.get('/repos', getRepos(cache));
    app.put('/repos', putRepo(cache));

    app.all('*', (req, res) => {
        log.info('middleware.invalid.route', req.path);
        res.status(404);
        res.json({ message: `invalid.route ${req.path}` });
    });

    // need four args to identify error middleware 🤷🏽‍♂️
    // eslint-disable-next-line
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        log.error('middleware.error.log', err.stack);
        res.status(500).json({ error: err.message });
    });
};
