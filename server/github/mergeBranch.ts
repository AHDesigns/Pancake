// import send from '@helpers/send';
import request, { Options } from 'request';

interface IGitApi {
    params: object;
    body: object;
}

enum MergeMethods {
    merge = 'merge',
    squash = 'squash',
    rebase = 'rebase',
}

// https://github.com/AHDesigns/release-tester/pull/47
// https://developer.github.com/v3/pulls/#merge-a-pull-request-merge-button

// TODO: split out 'send' for rest and graphql
export interface MergeBranchInput extends IGitApi {
    params: {
        owner: string;
        repo: string;
        pullNumber: number;
    };
    body: {
        commit_title: string;
        commit_message: string;
        sha: string;
        merge_method: MergeMethods;
    };
}

// type MergeBranchResSuccess = {
//     sha: string;
//     merged: boolean;
//     message: string;
// };
//
/*
 * Response if merge cannot be performed
 */
// type MergeBranchResFail = {
//     message: string;
//     documentation_url: string;
// };
//
export default mergeBranch;
function mergeBranch(input: MergeBranchInput): Promise<number | null> {
    const { owner, pullNumber, repo } = input.params;
    const options: Options = {
        method: 'PUT',
        uri: 'https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/merge',
        body: input.body,
        headers: {
            'User-Agent': 'Pancake',
            // isDraft, mergeStateStatus
            Accept: 'application/vnd.github.shadow-cat-preview+json, application/vnd.github.merge-info-preview+json',
            Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
        json: true,
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res) => {
            if (err) {
                if (res.statusCode === 405) {
                    console.log('method not allowed');
                } else if (res.statusCode === 409) {
                    console.log('conflict');
                } else {
                    console.log('unkown error');
                }

                reject(null);
            }
            resolve(pullNumber)
        });
    })
}
