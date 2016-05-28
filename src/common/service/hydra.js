/* global process */
import jwt from 'jsonwebtoken';
import OAuth2 from 'simple-oauth2'
import request from 'superagent'
import jwkToPem from 'jwk-to-pem'
import yaml from 'js-yaml'
import fs from 'fs'
import fileExists from 'file-exists'

require('superagent-auth-bearer')(request)

const configFromFile = () => {
    const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
    if (!fileExists(`${home}/.hydra.yml`)) {
        return
    }
    const config = yaml.safeLoad(fs.readFileSync(`${home}/.hydra.yml`, 'utf8')) || {};
    return {
        clientID: config.client_id,
        clientSecret: config.client_secret,
        endpoint: config.cluster_url,
        tokenPath: '/oauth2/token',
        authorizationPath: '/oauth2/auth',
        scope: 'core hydra.keys.get'
    }
}

const filter = (obj, predicate) => {
    let result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
}

const warn = () => {
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
        console.warn('Skipping TLS Verification because NODE_TLS_REJECT_UNAUTHORIZED is set to 0')
    }
}

class Hydra {
    constructor(config) {
        this.config = config
        this.token = null
    }

    authenticate() {
        warn()
        return new Promise((resolve, reject) => {
            if (this.token !== null && !this.token.expired()) {
                return resolve(this.token)
            }

            const fileConfig = configFromFile()
            const options = Object.assign({}, fileConfig, filter(this.config, (c) => !Boolean(c)))
            this.oauth2 = OAuth2({
                ...options,
                site: options.endpoint
            })
            this.endpoint = options.endpoint
            this.scope = options.scope || 'core hydra.keys.get'
            this.oauth2.client.getToken({scope: this.scope}, (error, result) => {
                if (error) {
                    return reject({error: 'Could not retrieve access token: ' + error})
                }

                this.token = this.oauth2.accessToken.create(result);
                resolve(this.token)
            })
        })
    }

    getKey(set, kid) {
        warn()
        return new Promise((resolve, reject) => {
            this.authenticate().then(() => {
                request.get(`${this.endpoint}/keys/${set}/${kid}`).authBearer(this.token.token.access_token).end((err, resp) => {
                    if (err || !resp.ok) {
                        if (resp.body) {
                            return reject({error: 'Could not retrieve validation key: ' + JSON.stringify(resp.body)})
                        }
                        return reject({error: 'Could not retrieve validation key: ' + err})
                    }
                    return resolve(resp.body.keys[0])
                })
            }).catch(reject)
        })
    }

    verifyConsentChallenge(challenge) {
        warn()
        return new Promise((resolve, reject) => {
            this.getKey('consent.challenge', 'public').then((key) => {
                jwt.verify(challenge, jwkToPem(key), (error, decoded) => {
                    if (error) {
                        return reject({error: 'Could not verify consent challenge: ' + error})
                    }
                    resolve({challenge: decoded})
                })
            }).catch(reject)
        })
    }

    generateConsentToken(subject, challenge) {
        warn()
        return new Promise((resolve, reject) => {
            this.getKey('consent.endpoint', 'private').then((key) => {
                const {signature, payload}  = jwt.decode(challenge, {complete: true})
                jwt.sign({
                    ...payload,
                    sub: subject,
                    sig: signature
                }, jwkToPem({
                    ...key,
                    // the following keys are optional in the spec but for some reason required by the library.
                    dp: '', dq: '', qi: ''
                }, {private: true}), {algorithm: 'RS256'}, (error, token) => {
                    if (error) {
                        return reject({error: 'Could not verify consent challenge: ' + error})
                    }
                    resolve({consent: token})
                })
            }).catch(reject)
        })
    }
}

export default Hydra