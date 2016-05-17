import React, {Component} from 'react'

const scopes = {
    core: 'generate an access and refresh token on your behalf',
    openid: 'issue an ID token',
    hydra: 'access all of hydra\'s endpoints on your behalf'
}

const Consent = ({onConsent, onAbort, challenge}) => (
    <div className="">
        <div className="">
            <p><strong>App {challenge.aud}</strong></p>
        </div>
        <div className="">
            <p>
                This app would like to:
                <ul>
                    {challenge.scp.map((scope) => <li>{scopes[scope] || scope}</li>)}
                </ul>
            </p>

            <div className="row">
                <div className="col-xs-6">
                    <button className="btn btn-lg btn-danger btn-block btn-signin" onClick={onAbort}>
                        Cancel
                    </button>
                </div>
                <div className="col-xs-6">
                    <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={onConsent}>
                        Grant Access
                    </button>
                </div>
            </div>
        </div>
    </div>
)

export default Consent
