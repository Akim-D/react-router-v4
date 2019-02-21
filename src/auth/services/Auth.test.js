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
    auth = new Auth();

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

  test('verification checks authenticated credentials', () => {
    auth.verify();

    expect(webAuth.parseHash).toBeCalledWith(expect.any(Function));
  });

  test('is authorised after successful verification', () => {
    givenSuccessfulVerification({
      accessToken: 'access',
      idToken: 'id',
      expiresIn: 3600,
    });

    auth.verify();
    advanceTime(3599);

    expect(auth.isAuthorised).toBeTruthy();
  });

  test('invokes callback after successful verification', () => {
    const callback = jest.fn();
    givenSuccessfulVerification({
      accessToken: 'token',
      idToken: 'another-token',
      expiresIn: 60,
    });

    auth.verify(callback);

    expect(callback).toBeCalled();
  });

  test('authorisation expires when token expires', () => {
    givenSuccessfulVerification({
      accessToken: 'access',
      idToken: 'id',
      expiresIn: 1800,
    });

    auth.verify();
    advanceTime(1800);

    expect(auth.isAuthorised).toBeFalsy();
  });

  test('is not authorised if verification fails', () => {
    givenFailedVerification({});

    auth.verify();

    expect(auth.isAuthorised).toBeFalsy();
  });

  test('is not authorised if no token is available', () => {
    givenSuccessfulVerification(null);

    auth.verify();

    expect(auth.isAuthorised).toBeFalsy();
  });

  test('is not authorised if access token is missing', () => {
    givenSuccessfulVerification({
      expiresIn: 60,
      idToken: 'id'
    });

    auth.verify();

    expect(auth.isAuthorised).toBeFalsy();
  });

  test('is not authorised if id token is missing', () => {
    givenSuccessfulVerification({
      expiresIn: 60,
      accessToken: 'access'
    });

    auth.verify();

    expect(auth.isAuthorised).toBeFalsy();
  });

  // TODO: defers to configured callback on authentication error

  function givenSuccessfulVerification(result) {
    webAuth.parseHash.mockImplementation((callback) => {
      callback(null, result);
    });
  }

  function givenFailedVerification(error) {
    webAuth.parseHash.mockImplementation((callback) => {
      callback(error, null);
    });
  }

  function advanceTime(seconds) {
    global.Date.now.mockReturnValue(global.Date.now() + seconds * 1000);
  }
});
