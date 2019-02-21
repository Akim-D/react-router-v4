import React from 'react';
import {MemoryRouter as Router} from 'react-router';
import {mount} from 'enzyme';

import AuthenticatedRoute from './AuthenticatedRoute';
import withAuthentication from './withAuthentication';

describe('AuthenticatedRoute', () => {
  const PrivateComponent = () => null;
  const authService = { isAuthorised: false, login: jest.fn() };
  const mountWithContext = (Component, location) => {
    const WrapperComponent = withAuthentication({ auth: authService })(() => Component);
    return mount(
      <Router initialEntries={location && [location]}>
        <WrapperComponent/>
      </Router>
    );
  };

  test('passes props to underlying route', () => {
    const route = mountWithContext(
      <AuthenticatedRoute path="the-path" component={PrivateComponent}/>
    );

    expect(route.find('Route').exists({path: 'the-path'})).toBeTruthy();
  });

  test('passes other properties to underlying route', () => {
    const route = mountWithContext(
      <AuthenticatedRoute attr="value" path="path" component={PrivateComponent}/>
    );

    expect(route.find('Route').exists({attr: 'value'})).toBeTruthy();
  });

  test('renders component if user is authenticated', () => {
    authService.isAuthorised = true;

    const route = mountWithContext(
      <AuthenticatedRoute path="/path" component={PrivateComponent}/>,
      '/path'
    );

    expect(route.find('PrivateComponent').exists()).toBeTruthy();
  });

  test('redirects if user is not authenticated', () => {
    authService.isAuthorised = false;

    const route = mountWithContext(
      <AuthenticatedRoute path="/private" component={PrivateComponent}/>,
      { pathname: '/private' }
    );

    expect(route.find('Router').prop('history').location).toMatchObject({
      pathname: '/login',
    });
  });

  test('stores browsing context in history when redirecting', () => {
    authService.isAuthorised = false;

    const route = mountWithContext(
      <AuthenticatedRoute path="/path" component={PrivateComponent}/>,
      { pathname: '/path', search: '?query', hash: '#hash' }
    );

    expect(route.find('Router').prop('history').location).toMatchObject({
      state: { from: { pathname: '/path', search: '?query', hash: '#hash' } },
    });
  });
});
