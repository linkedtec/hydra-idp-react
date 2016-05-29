import React, {Component} from 'react'
import request from 'superagent'
import Authenticate from './Authenticate'
import Consent from './Consent'
import Info from './Info'

import './styles.css'

class SignIn extends Component {

    // The constructor is executed once on object instantiation.
    constructor(props) {
        super(props)

        const {query: {challenge}} = this.props.location

        // Initialize state
        this.state = {
            email: '',
            password: '',
            error: '',
            processing: false,
            challenge: challenge,
            decodedChallenge: {},
            authenticated: false
        }

        // Bind the methods to this instance.
        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onEmailChange = this.onEmailChange.bind(this)
        this.onAuthenticate = this.onAuthenticate.bind(this)
        this.onConsent = this.onConsent.bind(this)
        this.onAbortConsent = this.onAbortConsent.bind(this)
        this.handleResponse = this.handleResponse.bind(this)
    }

    handleResponse(success) {
        return (err, res) => {
            this.setState({processing: false})

            if (err || !res.ok) {
                if (res && res.body === null) {
                    this.setState({error: 'Could not connect to backend.'})
                    return
                }
                this.setState({error: res.body.error})
                return
            }

            success(res.body)
        }
    }

    onConsent() {
        this.setState({error: '', processing: true})
        request.post('/api/consent').send({
            challenge: this.state.challenge,
            // assume that all scopes have been granted
            scopes: this.state.decodedChallenge.scp,
            email: this.state.email
        }).end(this.handleResponse(({consent}) => {
            window.location.href = this.state.decodedChallenge.redir + '&consent=' + consent
        }))
    }

    onAbortConsent() {
        window.location.href = this.state.decodedChallenge.redir + '&consent=false'
    }

    // This callback will be executed when the user enters his email.
    onEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    // This callback will be executed when the user enters his password.
    onPasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    // This callback will be executed when the user submits his data.
    onAuthenticate(e) {
        // Stop the event's execution
        e.preventDefault()

        this.setState({error: '', processing: true})

        request.post('/api/login').send({
            email: this.state.email,
            password: this.state.password,
            challenge: this.state.challenge
        }).end(this.handleResponse((body) => {
            const {challenge, authenticated} = body
            if (!authenticated) {
                this.setState({error: 'Could not authenticate.'})
                return
            }

            this.setState({
                authenticated: authenticated,
                decodedChallenge: challenge
            })
        }))
    }

    render() {
        return (
            <div>
                {
                    this.props.location.query.error_description ?
                        <div className="panel panel-warning oauth2-error">
                            <div className="panel-heading">
                                An error was caused by a failed OAuth2 authentication attempt.
                            </div>
                            <div className="panel-body">
                                {this.props.location.query.error_description}.
                            </div>
                            <div className="panel-footer">
                                <small>If you are not an application administrator, you can ignore this warning.</small>
                            </div>
                        </div>
                        : null
                }
                <div className="card card-container">
                    {
                        this.state.authenticated ?
                            <Consent onConsent={this.onConsent}
                                     onAbort={this.onAbortConsent}
                                     challenge={this.state.decodedChallenge}/>
                            : <Authenticate onEmailChange={this.onEmailChange}
                                            onSubmit={this.onAuthenticate}
                                            onPasswordChange={this.onPasswordChange}
                            {...this.props} {...this.state}/>
                    }
                </div>
                { this.state.authenticated ? null : <Info /> }
            </div>
        )
    }
}

export default SignIn
