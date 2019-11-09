module.exports = cache => (req, res, next) => {
    try {
        const { key, value } = validateArgs(req.body);
        cache.set([key, 'params'], value);
        res.json(Object.values(cache.all()).map(({ params }) => params));
    } catch (e) {
        next(e);
    }
};

function validateArgs(repos) {
    const [repo] = repos;
    return {
        key: repo.name,
        value: repo,
    };
}
