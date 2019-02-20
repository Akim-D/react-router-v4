import Auth from './Auth';
import {WebAuth} from 'auth0-js';

jest.mock('auth0-js');

describe('Auth', () => {
  let auth;

  beforeEach(() => {
    auth = new Auth();
  });

  test('is not authorised by default', () => {
    expect(auth.isAuthorised).toBeFalsy();
  });

  test('login triggers authorisation flow', () => {
    auth.login();

    expect(WebAuth.mock.instances[0].authorize).toBeCalled();
  });
});
