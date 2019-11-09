import React from 'react';
import { IPullRequest, IUniqueReview, IReviewRequest, isUserReview } from '../shared/types';
import GitMerge from '../git-merge';
import octocat from '../Octocat.png';

const Img: React.FC<{
    author: { avatarUrl: string; login: string };
    cssClassNames?: string;
}> = ({ author, cssClassNames }) => {
    return (
        <span className="tooltip">
            <img className={cssClassNames} src={author.avatarUrl} alt={author.login} />
            <div className="tooltip-hover">{author.login}</div>
        </span>
    );
};

const Review: React.FC<IUniqueReview> = review => {
    return (
        <div className={`review state--${review.state}`}>
            <a href={review.url} target="_blank" rel="noopener noreferrer">
                {review.onBehalfOf ? (
                    <Img author={review.onBehalfOf} cssClassNames="review-image" />
                ) : (
                    <Img author={review.author} cssClassNames="review-image" />
                )}
            </a>
        </div>
    );
};

const Requested: React.FC<IReviewRequest> = ({ requestedReviewer }) => {
    const login = isUserReview(requestedReviewer) ? requestedReviewer.userName : requestedReviewer.teamName;
    const author = { avatarUrl: requestedReviewer.avatarUrl, login };
    return (
        <div className={'review state--PENDING'}>
            <Img author={author} cssClassNames="review-image" />
        </div>
    );
};

export default class Pr extends React.Component<IPullRequest> {
    shouldComponentUpdate(nextProps: IPullRequest): boolean {
        return this.props.boardStatus !== nextProps.boardStatus;
    }

    render(): React.ReactChild {
        const pr = this.props;
        const status = pr.statuses.status ? pr.statuses.status.state : 'PENDING';
        return (
            <li className="repo-item">
                <div className="pr">
                    <div className="pr-image">{pr.author ? <Img author={pr.author} /> : <img src={octocat} />}</div>
                    <div className="pr-info">
                        <div className="pr-title">
                            <a href={pr.url} target="_blank" rel="noopener noreferrer">
                                {pr.title}
                            </a>
                        </div>

                        <ul className="pr-statuses">
                            <li>
                                {pr.mergeable.toLocaleString().toLowerCase()}:{' '}
                                <GitMerge className={`merge-icon status--${pr.mergeable}`} />
                            </li>
                            <li>
                                Checks:{' '}
                                <span className={`status--${status}`}>{status.toLocaleString().toLowerCase()}</span>
                            </li>
                            <li>
                                Created:{' '}
                                {new Date(pr.createdAt).toLocaleString('en-UK', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </li>
                        </ul>
                    </div>

                    <ul className="pr-reviews">
                        {pr.reviewRequests.nodes.map((request: IReviewRequest) => (
                            <li key={request.requestedReviewer.avatarUrl}>
                                <Requested {...request} />
                            </li>
                        ))}
                        {pr.reviews.uniqueReviews.map((review: IUniqueReview) => (
                            <li key={review.author.login}>
                                <Review {...review} />
                            </li>
                        ))}
                    </ul>
                </div>
            </li>
        );
    }
}
