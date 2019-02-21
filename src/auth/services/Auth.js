import {WebAuth} from 'auth0-js';

class Auth {
  _expiresAt = 0;
  _auth0;

  constructor() {
    this._auth0 = new WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      responseType: 'token id_token',
      scope: 'openid'
    });

    this.login = this.login.bind(this);
    this.verify = this.verify.bind(this);
  }

  get isAuthorised() {
    return this._expiresAt > Date.now();
  }

  login() {
    this._auth0.authorize();
  }

  verify(callback) {
    this._auth0.parseHash((err, res) => {
      if (!err && res && res.accessToken && res.idToken) {
        this._setSession(res);
        callback && callback();
      }
    });
  }

  _setSession(res) {
    this._expiresAt = Date.now() + res.expiresIn * 1000;
  }
}

export default Auth;
