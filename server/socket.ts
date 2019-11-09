import log from './helpers/logger';
import { Socket } from 'socket.io';
import { TServerInfo } from './types';
import { IPrData } from '@shared/types';

export default ({ watchedRepos, cache, reviewEmitter }: TServerInfo) => (socket: Socket): void => {
    const id = (Math.random() * 100000).toFixed(0);
    let userRepos: string[] = [];

    log.info(`user ${id} connected`);
    log.info('watched: ', watchedRepos);

    socket.on('connected', () => {
        socket.emit('connected', { id });
    });

    socket.on('availableRepos', data => {
        log.info('client subscribing to repos', data);
        userRepos = data;
        watchedRepos[id] = data;
        userRepos.forEach(repo => {
            const repoData = cache.get(repo, 'value');
            if (repoData) {
                socket.emit('reviews', repoData);
            }
        });
    });

    reviewEmitter.on('new-reviews', updateReviews);
    reviewEmitter.on('rate-limit', rate => {
        socket.emit('rate-limit', rate);
    });

    socket.on('disconnect', () => {
        log.info(`user ${id} disconnected`);
        reviewEmitter.removeListener('new-reviews', updateReviews);
        delete watchedRepos[id];
    });

    function updateReviews({ repo, data }: { repo: string; data: IPrData }): void {
        if (userRepos.includes(repo)) {
            log.info(`user ${id} recieved data for repo ${repo}`);
            socket.emit('reviews', data);
        }
    }
};
