import { IGitGQL } from '@types';

const updateBranchMutation = `
mutation UpdateBranch($input: MergeBranchInput!) {
  mergeBranch(input: $input) {
    mergeCommit {
      id
    }
  }
}
`;
export default updateBranchMutation;

export type TUpdateBranch = {
    mergeBranch: {
        mergeCommit: {
            id: string;
        };
    };
};

export interface UpdateBranchGitGQL extends IGitGQL {
    operationName: 'UpdateBranch';
    query: typeof updateBranchMutation;
    variables: {
        input: {
            repositoryId: string;
            base: string;
            head: string;
        };
    };
}
