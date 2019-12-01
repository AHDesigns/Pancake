import log from './helpers/logger';
import { Socket } from 'socket.io';
import { TServerInfo } from './types';
import { IPrData } from '@shared/types';
import { SocketIOEvents, PancakeEvents } from '@shared/constants';

export default ({ watchedRepos, cache, reviewEmitter }: TServerInfo) => (socket: Socket): void => {
    const id = (Math.random() * 100000).toFixed(0);
    let userRepos: string[] = [];

    log.info(`user ${id} connected`);
    log.info('watched: ', watchedRepos);

    socket.emit(PancakeEvents.clientId, { id });

    socket.on(PancakeEvents.availableRepos, data => {
        log.info('client subscribing to repos', data);
        userRepos = data;
        watchedRepos[id] = data;
        userRepos.forEach(repo => {
            const repoData = cache.get(repo, 'value');
            if (repoData) {
                socket.emit(PancakeEvents.reviews, repoData);
            }
        });
    });

    reviewEmitter.on('new-reviews', updateReviews);
    reviewEmitter.on('rate-limit', rate => {
        socket.emit(PancakeEvents.rateLimit, rate);
    });

    socket.on(SocketIOEvents.disconnect, () => {
        log.info(`user ${id} disconnected`);
        reviewEmitter.removeListener('new-reviews', updateReviews);
        delete watchedRepos[id];
    });

    function updateReviews({ repo, data }: { repo: string; data: IPrData }): void {
        if (userRepos.includes(repo)) {
            log.info(`user ${id} recieved data for repo ${repo}`);
            socket.emit(PancakeEvents.reviews, data);
        }
    }
};
