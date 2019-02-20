import {WebAuth} from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      responseType: 'token id_token',
      scope: 'openid'
    });
  }

  get isAuthorised() {
    return false;
  }

  login() {
    this.auth0.authorize();
  }
}

export default Auth;
