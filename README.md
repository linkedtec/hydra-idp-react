# hydra-idp-react

Please be aware that documentation is still work in progress. To run this example you can use docker:

```
$ docker run -d -p 3000:3000 oryam/hydra-idp-react --name my-hydra-consent-ui

# On Linux
$ open http://localhost:3000/

# In Docker Shell On OSX
$ open http://$(docker-machine ip default):3000/

# In Docker Shell On Windows
$ start "" http://$(docker-machine ip default):3000/
```

Or run the source using [NodeJS](https://nodejs.org/en/):

```
$ npm i
$ npm run dev

# Linux / OSX
$ open http://localhost:3000

# Windows
$ start "" http://localhost:3000/
```

Because this project is using webpack and react, there are a lot of files and directories. If you want to see how the
log in example works, those are the files to look at:

* [src/common/components/SignIn/index.js](src/common/components/SignIn/index.js): This is the "root" component that handles
 all login and consent logic. It sets up event handlers ("what happens when pressing *login*"), shows either the login or the
 consent user interface and redirects the user back to hydra after consenting.
* [src/common/components/SignIn](src/common/components/SignIn): All other components are simple JSX (read: HTML) templates.
* [src/common/service/hydra.js](src/common/service/hydra.js): A helper for dealing with the Hydra REST API.
* [src/common/service/userService.js](src/common/service/userService.js): This is what your user service could look like. It
 could be backed by LDAP, Postgres, MySQL, MongoDB or do other amazing things.
* [src/server/handler/auth.js](src/server/handler/auth.js): Serves two endpoints:
 * `/api/login`: Handles log in requests. Receives a username and a password. Additionally validates and decodes the consent challenge.
 * `/api/consent`: Creates a signed consent token.

In order to connect with hydra, this app requires either a `.hydra.yml` with valid credentials in your home directory or
the environment variables `CLIENT_ID`, `CLIENT_SECRET`, `HYDRA_URL` set to an OAuth2 client id, OAuth2 client secret and hydra's url.
Please be aware that the client must be allowed to perform the `authorize_code` and `client_credentials` flow, be able to receive `code` and `token` response type
and be granted scopes `hydra.keys.get` and `core`.

**WARNING**
In development hydra usually uses self signed TLS certificates. This is why `npm run dev` sets `NODE_TLS_REJECT_UNAUTHORIZED=0`.
Please be aware that this option **skips all TLS verification and must never be used except when trying stuff on your local machine.**