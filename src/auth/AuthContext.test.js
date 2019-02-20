import React from 'react';
import {MemoryRouter as Router} from 'react-router';
import {mount} from 'enzyme';

import Auth from './services/Auth';
import {AuthContext} from './AuthContext';
import AuthenticatedRoute from './AuthenticatedRoute';
import withAuthentication from './withAuthentication';

describe('AuthContext', () => {
  const ProtectedComponent = () => null;
  const authService = { isAuthenticated: false, login: jest.fn() };

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

  test('login route should propagate to authenticated route redirects', () => {
    authService.isAuthenticated = false;

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
