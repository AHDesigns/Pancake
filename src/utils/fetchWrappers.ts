import { constants } from '../constants';
import { IPrInfo, isPrInfo, TUser } from '../shared/types';
import { TPrHistory, isTPrHistory } from '../types';

export function getRepos(): Promise<IPrInfo[]> {
    return new Promise((resolve, reject): void => {
        fetch(`${constants.baseURL}/repos`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
        })
            .then(res => {
                res.json()
                    .then((data: IPrInfo[]) => {
                        if (data.every(isPrInfo)) {
                            resolve(data);
                        } else {
                            console.warn('repos.request.not.of.type.Repos', data);
                            reject();
                        }
                    })
                    .catch(e => {
                        console.error('json error', e);
                        reject();
                    });
            })
            .catch(e => {
                console.error('fetch error', e);
                reject();
            });
    });
}

export function putRepos(repos: IPrInfo[], cb: () => void): void {
    fetch(`${constants.baseURL}/repos`, {
        body: JSON.stringify(repos),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
    })
        .then(res => {
            res.json()
                .then((data: IPrInfo[]) => {
                    if (data.every(isPrInfo)) {
                        cb();
                    } else {
                        console.warn('repos.request.not.of.type.Repos', data);
                    }
                })
                .catch(e => console.error('json error', e));
        })
        .catch(e => console.error('fetch error', e));
}

export function getPrHistory(): Promise<TPrHistory> {
    return new Promise((resolve, reject): void => {
        fetch(`${constants.baseURL}/pr-history`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
                owner: 'sky-uk',
                name: 'skyport-graphql',
            }),
        })
            .then(res => {
                res.json()
                    .then((data: TPrHistory) => {
                        if (isTPrHistory(data)) {
                            console.log('yay', data);
                            resolve(data);
                        } else {
                            console.warn('repos.request.not.of.type.Repos', data);
                            reject();
                        }
                    })
                    .catch(e => {
                        console.error('json error', e);
                        reject();
                    });
            })
            .catch(e => {
                console.error('fetch error', e);
                reject();
            });
    });
}

export function getUsers(): Promise<TUser[]> {
    return new Promise((resolve, reject): void => {
        fetch(`${constants.baseURL}/users`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({ login: 'sky-uk' }),
        })
            .then(res => {
                res.json()
                    .then((data: { users: TUser[] }) => {
                        console.log('users returned', data);
                        resolve(data.users);
                    })
                    .catch(e => {
                        console.error('json error', e);
                        reject();
                    });
            })
            .catch(e => {
                console.error('fetch error', e);
                reject();
            });
    });
}
