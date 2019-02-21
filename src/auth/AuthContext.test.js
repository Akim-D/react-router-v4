import React from 'react';
import {MemoryRouter as Router} from 'react-router';
import {mount} from 'enzyme';

import Auth from './services/Auth';
import {AuthContext} from './AuthContext';
import AuthenticatedRoute from './AuthenticatedRoute';
import withAuthentication from './withAuthentication';

jest.mock('./services/Auth');

describe('AuthContext', () => {
  const ProtectedComponent = () => null;
  const authService = new Auth();

  test('exposes auth context property', () => {
    const callback = jest.fn();
    const expected = expect.objectContaining({ auth: expect.any(Auth) });

    mount(
      <AuthContext.Consumer>
        {ctx => callback(ctx)}
      </AuthContext.Consumer>
    );

    expect(callback).nthCalledWith(1, expected);
  });

  test('default Auth implementation is not authorised', () => {
    const wrapper = mount(
      <AuthContext.Consumer>
        {({ auth }) => auth.isAuthorised ? 'authorised' : 'not authorised'}
      </AuthContext.Consumer>
    );

    expect(wrapper.text()).not.toEqual('authorised');
  });

  test('login route should propagate to authenticated route redirects', () => {
    // noinspection JSUnresolvedVariable: Jest does not mock getters
    authService.isAuthorised = false;

    const Component = withAuthentication({ path: '/path/to/login', auth: authService })(() => (
      <AuthenticatedRoute path="/private" component={ProtectedComponent}/>
    ));
    const wrapper = mount(
      <Router initialEntries={['/private']}>
        <Component/>
      </Router>
    );

    expect(wrapper.find('Router').prop('history').location).toMatchObject({
      pathname: '/path/to/login',
    });
  });
});
