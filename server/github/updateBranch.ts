import send from '../helpers/send';
import gitGQL from './gitGQL';
import query, { TUpdateBranch, UpdateBranchGitGQL } from './updateBranchMutation';

export default function updateBranch(params: UpdateBranchGitGQL['variables']): Promise<TUpdateBranch> {
    return send<TUpdateBranch>(
        gitGQL({
            operationName: 'UpdateBranch',
            query,
            variables: params,
        }),
    );
}
