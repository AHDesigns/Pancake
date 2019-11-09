const request = require('request');
const fs = require('fs');
const log = require('./logger');

module.exports = ({ options, loggable }) =>
    new Promise((resolve, reject) => {
        log.debug(options);
        log.info('request.sending', loggable);
        request(options, (error, response) => {
            // only locally
            if (error) {
                // no internet, use fixture locally
                fs.readFile('./fixtures/fixture.json', { encoding: 'utf8' }, (err, data) => {
                    if (err) {
                        log.error(err);
                        reject(new Error('request.error'));
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
            } else {
                const { body, headers } = response;
                log.info('request.response', {
                    headers,
                    statusCode: response.statusCode,
                });
                log.debug(body);

                if (response.statusCode === 200) {
                    if (body.errors) {
                        log.error(body.errors);
                        reject(new Error('request.remote.errors'));
                    } else if (body.data) {
                        resolve(body.data);
                    } else {
                        log.debug(body);
                        reject(new Error('request.no.body'));
                    }
                } else if (response.statusCode === 401) {
                    reject(new Error('request.unauthenticated'));
                } else if (response.statusCode === 404) {
                    reject(new Error('request.invalid.route'));
                } else {
                    reject(new Error('request.unknown.error'));
                }
            }
        });
    });
