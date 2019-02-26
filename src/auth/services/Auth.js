import {WebAuth} from 'auth0-js';

class Auth {
  _expiresAt = 0;
  _auth0;
  _logoutRedirectUri;

  constructor(
    {
      logoutRedirectUri = process.env.REACT_APP_AUTH0_LOGOUT_REDIRECT_URI
    } = {}
  ) {
    this._auth0 = new WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      responseType: 'token id_token',
      scope: 'openid'
    });

    this._logoutRedirectUri = logoutRedirectUri;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.verify = this.verify.bind(this);
  }

  get isAuthorised() {
    return this._expiresAt > Date.now();
  }

  login() {
    this._auth0.authorize();
  }

  logout() {
    this._auth0.logout({
      returnTo: this._logoutRedirectUri,
    });
  }

  verify() {
    return new Promise((resolve, reject) => {
      this._auth0.parseHash((err, res) => {
        if (err || !res || !res.accessToken || !res.idToken) {
          reject(err);
        } else {
          this._setSession(res);
          resolve(this);
        }
      });
    });
  }

  _setSession(res) {
    this._expiresAt = Date.now() + res.expiresIn * 1000;
  }
}

export default Auth;
