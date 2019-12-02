import { updateBranch } from './github';
import log from '@helpers/logger';
import { TServerInfo } from './types';
import { MergeStateStatus, IPullRequest } from '@shared/types';
import { TUpdateBranch } from 'github/updateBranchMutation';

type NewReviews = {
    repo: string;
    data: {
        name: string;
        pullRequests: IPullRequest[];
    };
};

export default branchUpdater;
function branchUpdater({ reviewEmitter }: TServerInfo): void {
    reviewEmitter.on('new-reviews', (newReviews: NewReviews) => {
        const { name: repo, pullRequests } = newReviews.data;
        log.info('updating branches for:', repo);

        const prsToUpdate = pullRequests.filter(validPrWithStatus(MergeStateStatus.BEHIND));
        const prToMerge = pullRequests.find(validPrWithStatus(MergeStateStatus.CLEAN));

        mergeBranch(prToMerge)
            .then(() =>
                Promise.all(
                    prsToUpdate.map(pr =>
                        updateBranch({
                            input: {
                                repositoryId: pr.repository.id,
                                head: 'develop',
                                base: pr.headRefName,
                            },
                        }),
                    ),
                ),
            )
            .catch(console.log);
    });
}

function validPrWithStatus(status: MergeStateStatus): (pr: IPullRequest) => boolean {
    return (pr: IPullRequest): boolean => {
        return (
            !(
                pr.isDraft ||
                pr.labels.nodes.find(({ name }) => name === 'Do Not Merge') ||
                pr.baseRefName !== 'develop'
            ) && pr.mergeStateStatus === status
        );
    };
}

async function mergeBranch(pr?: IPullRequest): Promise<TUpdateBranch | null> {
    return pr
        ? updateBranch({
              input: {
                  repositoryId: pr.repository.id,
                  base: 'develop',
                  head: pr.headRefName,
              },
          })
        : Promise.resolve(null);
}
