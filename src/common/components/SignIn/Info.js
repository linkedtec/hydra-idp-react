import React from 'react'

export default () => (
    <div className="panel panel-info">
        <div className="panel-heading">
            This exemplary app's code is
            {} <a href="https://github.com/ory-am/hydra-idp-react"><strong>available on GitHub.</strong></a>
        </div>
        <div className="panel-body">
            <div>
                <p>
                    Log in using one of the following credentials.
                </p>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Password</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><code>john.doe@me.com</code></td>
                        <td><code>foobar</code></td>
                    </tr>
                    <tr>
                        <td><code>alice.schwarz@me.com</code></td>
                        <td><code>mysecret</code></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)