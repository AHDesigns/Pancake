import React from 'react';
import { IPrData, IPullRequest } from '../shared/types';
import { TRepoUserFilters } from '../types';
import Pr from './Pr';

const filteredUsers = (repoUserFilters: TRepoUserFilters, repoName: string) => {
    const allUsers = repoUserFilters.all.users.map(u => u.login);
    const { whitelist: allWhitelist } = repoUserFilters.all;

    const hasRepoFilters = Boolean(repoUserFilters[repoName]);

    let users: string[];
    let whitelist: boolean;
    if (hasRepoFilters) {
        users = repoUserFilters[repoName].users.map(u => u.login);
        whitelist = repoUserFilters[repoName].whitelist;
    }

    return (user: string): boolean => {
        if (hasRepoFilters) {
            return whitelist ? users.includes(user) : !users.includes(user);
        }

        return allWhitelist ? allUsers.includes(user) : !allUsers.includes(user);
    };
};

const Repo: React.FC<{ reposData: IPrData; repoUserFilters: TRepoUserFilters }> = ({ reposData, repoUserFilters }) => {
    const validUser = filteredUsers(repoUserFilters, reposData.name);
    return (
        <div className="repo">
            <p className="repo-title">
                {reposData.name} [{reposData.pullRequests.length}]
            </p>
            <ul>
                {reposData.pullRequests.length > 0 &&
                    reposData.pullRequests
                        .filter((pr: IPullRequest) => !pr.isDraft && pr.author && validUser(pr.author.login))
                        .map((pr: IPullRequest) => <Pr key={pr.id + pr.boardStatus} {...pr} />)}
            </ul>
        </div>
    );
};
export default Repo;
