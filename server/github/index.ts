export { default as getReviews } from './getReviews';
export { default as getUsers } from './getUsers';
export { default as updateBranch } from './updateBranch';
export { default as mergeBranch } from './mergeBranch';

// types
import { UsersGitGQL } from './getUsersQuery';
import { ReviewsGitGQL } from './getReviewsQuery';
import { UpdateBranchGitGQL } from './updateBranchMutation';

export type ParamsGitGQL = UsersGitGQL | ReviewsGitGQL | UpdateBranchGitGQL;
