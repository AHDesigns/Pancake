import React, { useState, useEffect, useReducer } from 'react';
import './App.scss';
import { IPrData, TUser } from '../shared/types';
import { TRepoUserFilters } from '../types';
import { Provider } from './Socket';
import { RepoInfo } from './RepoSelector';
/* import { PrHistory } from './PrHistory'; */
import Repository from './Repo';
import { getUsers } from '../utils/fetchWrappers';

const initialSubscribedRepos: string[] = JSON.parse(window.localStorage.getItem('subscribedRepos') || '[]');
const initialUsers: TUser[] = [];
const intialRepoUserFilters: TRepoUserFilters = {
    all: {
        whitelist: false,
        users: [],
    },
};

export type filterAction =
    | { type: 'addUser'; data: { repo: string; user: TUser } }
    | { type: 'removeUser'; data: { repo: string; user: TUser } }
    | { type: 'setWhitelist'; data: { repo: string; whitelist: boolean } }
    | { type: 'whitelistApp'; data: { repo: string } }
    | { type: 'removeRepo'; data: { repo: string } };

function filterReducer(state: TRepoUserFilters, action: filterAction): TRepoUserFilters {
    console.log('filters: ', action, state);

    switch (action.type) {
        case 'removeRepo': {
            const { repo } = action.data;
            console.log('filters removeRepo', repo);
            return Object.entries(state).reduce(
                (filters, [repoName, values]) => (repoName === repo ? filters : { ...filters, [repoName]: values }),
                {},
            );
        }
        case 'whitelistApp': {
            const { repo } = action.data;
            console.log('filters whitelistApp', repo);
            if (state[repo]) {
                delete state[repo];
            }

            return {
                ...state,
                [repo]: {
                    whitelist: false,
                    users: [],
                },
            };
        }
        case 'setWhitelist': {
            const { repo, whitelist } = action.data;
            console.log('filters setWhitelist: ', repo, whitelist);
            return {
                ...state,
                [repo]: {
                    ...(state[repo] || {}),
                    whitelist,
                },
            };
        }
        case 'removeUser': {
            const { repo, user } = action.data;

            console.log('filters remove: ', repo, user);
            return {
                ...state,
                [repo]: {
                    ...(state[repo] || {}),
                    users: state[repo].users.filter(usr => usr !== user),
                },
            };
        }
        case 'addUser': {
            const { repo: repoName, user } = action.data;

            if (!user) {
                console.log('filters add: no user - bailing');
                return state;
            }

            const repo = state[repoName] || { whitelist: true, users: [] };

            if (repo.users.find(usr => usr === user)) {
                console.log('filters add: ignored existing user', repo, user);
                return state;
            }

            console.log('filters add: ', repo, user);
            return {
                ...state,
                [repoName]: {
                    ...repo,
                    users: [...repo.users, user],
                },
            };
        }
        default:
            return state;
    }
}

const App: React.FC = () => {
    const [subscribedRepos, setSubscribedRepos] = useState(initialSubscribedRepos);
    const [repoUserFilters, setRepoUserFilters] = useReducer(filterReducer, intialRepoUserFilters);

    const [users, setUsers] = useState(initialUsers);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(() => {});
    }, []);

    return (
        <div className="App">
            <RepoInfo
                repoUserFilters={repoUserFilters}
                setRepoUserFilters={setRepoUserFilters}
                users={users}
                subscribedRepos={subscribedRepos}
                setSubscribedRepos={setSubscribedRepos}
            />
            <Provider subscribedRepos={subscribedRepos}>
                {(reposData: IPrData[]): JSX.Element[] =>
                    reposData.map(data => (
                        <Repository key={data.name} reposData={data} repoUserFilters={repoUserFilters} />
                    ))
                }
            </Provider>
            {/* <PrHistory /> */}
        </div>
    );
};

export default App;
