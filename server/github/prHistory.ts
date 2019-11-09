// import send from '../helpers/send';
// import { gitGQL } from '../helpers/endpoints';
// import { prHistory } from './queries';
//
// export default (req, res, next) => {
//     const params = req.body; // TODO: validate
//
//     getAllPrs()
//         .then(({ name, rateLimit, prs }) => {
//             res.json({
//                 name,
//                 rateLimit,
//                 prs: dedupeByAuthor(prs),
//                 histogram: histogram(prs),
//                 histogramU: histogram(dedupeByAuthor(prs)),
//             });
//         })
//         .catch(next);
//
//     async function getAllPrs(allPrs = [], after) {
//         const { repository, rateLimit } = await send(
//             gitGQL({
//                 query: prHistory,
//                 variables: { ...params, ...(after && after) },
//             }),
//         );
//
//         const {
//             name,
//             pullRequests: { pageInfo, nodes },
//         } = repository;
//
//         const prs = allPrs.concat(nodes);
//
//         return pageInfo.hasNextPage && process.env.NODE_ENV === 'production'
//             ? getAllPrs(prs, { after: pageInfo.endCursor })
//             : { name, rateLimit, prs };
//     }
// };
//
// function dedupeByAuthor(prs = []) {
//     return prs.reduce((allPrs, pr) => {
//         if (!pr.author) {
//             return allPrs;
//         }
//
//         const hasAlreadyRaisedPr = allPrs.find(({ author }) => author.login === pr.author.login);
//
//         if (!hasAlreadyRaisedPr) {
//             allPrs.push(pr);
//         }
//         return allPrs;
//     }, []);
// }
//
// function histogram(prs = []) {
//     const dates = getDaysArray(new Date('7/20/2016'), new Date()).reduce((days, day) => {
//         days[day] = 0; // eslint-disable-line no-param-reassign
//         return days;
//     }, {});
//
//     prs.forEach(pr => {
//         const date = ukDate(pr.createdAt);
//
//         dates[date] += 1;
//     });
//
//     return dates;
// }
//
// function getDaysArray(start, end) {
//     const a = [];
//     for (let arr = a, dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
//         arr.push(ukDate(dt));
//     }
//     return a;
// }
//
// function ukDate(timestamp) {
//     return new Date(timestamp)
//         .toLocaleDateString()
//         .replace(/(\d+?)\/(\d+?)\/(\d{4})/, (match, m, d, y) => `${d}/${m}/${y}`);
// }
