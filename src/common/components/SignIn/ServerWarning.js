import React from 'react'

export default () => (
    <div className="panel panel-warning">
        <div className="panel-heading">
            <h4>Misconfiguration error!</h4>
        </div>
        <div className="panel-body">
            <div>
                <p>You are seeing this page because you did not set up a custom consent endpoint for
                    <strong> <a href="https://github.com/ory-am/hydra">Hydra</a></strong>. You will not be able to
                    authenticate!
                </p>
                <p><strong>
                    Please <a href="https://github.com/ory-am/hydra/tree/refactor#oryhydra">read the instructions</a>.
                </strong></p>
                <p>
                    This app is {}
                    <a href="https://github.com/ory-am/hydra-idp-react"><strong>available on GitHub.</strong></a>
                </p>
            </div>
        </div>
    </div>
)