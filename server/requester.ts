import { getReviews } from './github';
import log from '@helpers/logger';
import { env } from '@helpers/config';
import { TServerInfo } from './types';
import { IPullRequest, EnumBoardStatus, IPrData } from '@shared/types';

const { NEW, UPDATED, UNCHANGED } = EnumBoardStatus;

export default (sharedInfo: TServerInfo): void => {
    // eslint-disable-next-line no-unused-expressions
    env === 'production'
        ? setInterval(() => {
              requester(sharedInfo);
          }, 30 * 1000)
        : setTimeout(() => {
              requester(sharedInfo);
          }, 2 * 1000);
};

function requester({ cache, reviewEmitter, watchedRepos }: TServerInfo): void {
    const requests = Object.values(watchedRepos).reduce(dedupe, []);

    log.info('fetching data', requests);

    Promise.all(
        requests.map(repo => {
            const repoParams = cache.get(repo, 'params');
            return repoParams
                ? getReviews(repoParams)
                      .then((data: IPrData) => {
                          const { pullRequests } = cache.get(repo, 'value') || { pullRequests: [] as IPullRequest[] };
                          const changes = getChanges(pullRequests, data.pullRequests);
                          cache.set(repo, 'value', data);

                          if (changes.every(pr => pr.boardStatus === UNCHANGED)) {
                              log.info(`no new data for ${repo}`);
                          } else {
                              log.info(`emitting data for ${repo}`);
                              reviewEmitter.emit('new-reviews', {
                                  repo,
                                  data: {
                                      name: repo,
                                      pullRequests: changes,
                                  },
                              });
                          }
                          reviewEmitter.emit('rate-limit', data.rateLimit);
                      })
                      .catch((e: Error) => {
                          console.log(e);
                      })
                : Promise.resolve();
        }),
    );
}

function dedupe<T>(all: T[], curr: T[]): T[] {
    curr.forEach(repo => {
        if (all.includes(repo)) {
            return;
        }
        all.push(repo);
    });
    return all;
}

function getChanges(old: IPullRequest[], current: IPullRequest[]): IPullRequest[] {
    return current.map(pr => {
        const maybeEdited = old.find(oldPr => oldPr.id === pr.id);

        return { ...pr, boardStatus: status(pr, maybeEdited) };
    }, []);

    function status(pr: IPullRequest, maybeEdited?: IPullRequest): EnumBoardStatus {
        // TODO: can add removed for animation
        if (!maybeEdited) {
            return NEW;
        } else if (pr.updatedAt === maybeEdited.updatedAt) {
            return UNCHANGED;
        } else {
            return UPDATED;
        }
    }
}
