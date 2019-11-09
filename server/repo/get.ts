export default cache => (_, res, next) => {
    try {
        res.json(Object.values(cache.all()).map(({ params }) => params));
    } catch (e) {
        next(e);
    }
};
