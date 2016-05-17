import React, {Component} from 'react'

const Authenticate = ({error, onSubmit, onEmailChange, onPasswordChange, processing, email, password}) => (
    <div>
        <img id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"/>
        <div className="alert alert-danger" hidden={error === ''}>
            {error}
        </div>
        <form className="form-signin" onSubmit={onSubmit}>

            <input onChange={onEmailChange}
                   type="text"
                   className="form-control"
                   placeholder="Email address"
                   required
                   autoFocus value={email}/>

            <input onChange={onPasswordChange}
                   type="password"
                   className="form-control"
                   placeholder="Password"
                   required
                   value={password}/>

            <button className="btn btn-lg btn-primary btn-block btn-signin"
                    type="submit"
                    disabled={processing}>Sign in
            </button>
        </form>
    </div>
)

export default Authenticate
