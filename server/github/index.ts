export { default as getReviews } from './getReviews';
export { default as getUsers } from './getUsers';

// types
import { UsersGitGQL } from './getUsersQuery';
import { ReviewsGitGQL } from './getReviewsQuery';

export type ParamsGitGQL = UsersGitGQL | ReviewsGitGQL;
