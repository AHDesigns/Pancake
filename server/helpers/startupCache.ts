import fs from 'fs';
import { TCacheData } from '@types';

export default (): TCacheData => {
    try {
        return JSON.parse(fs.readFileSync('./fixtures/cache.json', { encoding: 'utf8' }));
    } catch (e) {
        console.error(e);
        return {};
    }
};
