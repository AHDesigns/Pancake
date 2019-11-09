import fs from 'fs';

export default () => {
    try {
        return JSON.parse(fs.readFileSync('./fixtures/cache.json', { encoding: 'utf8' }));
    } catch (e) {
        console.error(e);
        return {};
    }
};
