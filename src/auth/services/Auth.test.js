import Auth from './Auth';
import {WebAuth} from 'auth0-js';

jest.mock('auth0-js');

describe('Auth', () => {
  let auth;
  let webAuth;
  let originalDate;

  beforeAll(() => {
    originalDate = global.Date;
    global.Date = { now: jest.fn() };
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  beforeEach(() => {
    auth = new Auth({
      logoutRedirectUri: '/auth/post-logout'
    });

    webAuth = WebAuth.mock.instances[0];
    global.Date.now.mockReturnValue(0);
  });

  test('is not authorised by default', () => {
    expect(auth.isAuthorised).toBeFalsy();
  });

  test('login triggers authorisation flow', () => {
    auth.login();

    expect(webAuth.authorize).toBeCalled();
  });

  test('logout triggers de-authorisation flow', () => {
    auth.logout();

    expect(webAuth.logout).toBeCalledWith(expect.objectContaining({
      returnTo: '/auth/post-logout',
    }));
  });

  test('verification checks authenticated credentials', () => {
    auth.verify();

    expect(webAuth.parseHash).toBeCalledWith(expect.any(Function));
  });

  test('returns a promise while awaiting verification', () => {
    const result = auth.verify();

    expect(result).toBeInstanceOf(Promise);
  });

  test('promise resolves after successful verification', () => {
    givenSuccessfulAuthorisation({
      accessToken: 'token',
      idToken: 'another-token',
      expiresIn: 60,
    });

    return expect(auth.verify()).resolves.toEqual(auth);
  });

  test('promise rejects with error after failed verification', () => {
    givenFailedAuthorisation({ error: 'description' });

    return expect(auth.verify()).rejects.toEqual({
      error: 'description'
    });
  });

  test('is authorised after successful verification', () => {
    givenSuccessfulAuthorisation({
      accessToken: 'access',
      idToken: 'id',
      expiresIn: 3600,
    });

    expect.assertions(1);
    return auth.verify().then(() => {
      advanceTime(3599);
      expect(auth.isAuthorised).toBeTruthy();
    });
  });

  test('authorisation expires when token expires', () => {
    givenSuccessfulAuthorisation({
      accessToken: 'access',
      idToken: 'id',
      expiresIn: 1800,
    });

    expect.assertions(1);
    return auth.verify().then(() => {
      advanceTime(1800);
      expect(auth.isAuthorised).toBeFalsy();
    });
  });

  test('is not authorised if verification fails', () => {
    givenFailedAuthorisation();

    expect.assertions(1);
    return auth.verify().catch(() => {
      expect(auth.isAuthorised).toBeFalsy();
    });
  });

  test('is not authorised if no token is available', () => {
    givenSuccessfulAuthorisation(null);

    expect.assertions(1);
    return auth.verify().catch(() => {
      expect(auth.isAuthorised).toBeFalsy();
    });
  });

  test('is not authorised if access token is missing', () => {
    givenSuccessfulAuthorisation({
      expiresIn: 60,
      idToken: 'id'
    });

    expect.assertions(1);
    return auth.verify().catch(() => {
      expect(auth.isAuthorised).toBeFalsy();
    });
  });

  test('is not authorised if id token is missing', () => {
    givenSuccessfulAuthorisation({
      expiresIn: 60,
      accessToken: 'access'
    });

    expect.assertions(1);
    return auth.verify().catch(() => {
      expect(auth.isAuthorised).toBeFalsy();
    });
  });

  // TODO: Test is not authorised after logging out

  function givenSuccessfulAuthorisation(result) {
    webAuth.parseHash.mockImplementation((callback) => {
      callback(null, result);
    });
  }

  function givenFailedAuthorisation(error = {}) {
    webAuth.parseHash.mockImplementation((callback) => {
      callback(error, null);
    });
  }

  function advanceTime(seconds) {
    global.Date.now.mockReturnValue(global.Date.now() + seconds * 1000);
  }
});
