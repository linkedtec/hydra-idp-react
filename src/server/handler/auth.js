/* global process */
import userService from 'src/common/service/userService'
import Hydra from 'src/common/service/hydra'
import request from 'superagent'
require('superagent-auth-bearer')(request)

const endpoint = process.env.HYDRA_URL

const hydra = new Hydra({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    endpoint
})

export default (app) => {
    app.post('/api/login', (r, w) => {
        const {email, password, challenge} = r.body
        const user = userService.authenticate(email, password)

        if (user === null) {
            w.status(401)
            w.send({error: 'Invalid credentials. Try john.doe@me.com:foobar'})
            return
        }

        hydra.verifyConsentChallenge(challenge).then(({challenge}) => {
            w.send({authenticated: true, challenge})
        }).catch((error) => {
            w.status(500)
            console.log(error)
            w.send(error)
        })
    })

    app.post('/api/consent', (r, w) => {
        const {challenge, email} = r.body
        hydra.generateConsentToken(email, challenge).then(({consent}) => {
            w.send({consent})
        }).catch((error) => {
            console.log('An error occurred on consent', error)
            w.status(500)
            w.send(error)
        })
    })
}
