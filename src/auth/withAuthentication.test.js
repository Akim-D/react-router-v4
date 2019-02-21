import React from 'react';
import {MemoryRouter as Router} from 'react-router';
import {mount, shallow} from 'enzyme';

import withAuthentication from './withAuthentication';

describe('withAuthentication', () => {
  const StubComponent = () => null;
  const mountWithRouter = (Component, location) => mount(
    <Router initialEntries={location && [location]}>
      {Component}
    </Router>
  );

  test('configuration step returns a component factory', () => {
    const componentFactory = withAuthentication();

    expect(componentFactory).toBeInstanceOf(Function);
  });

  test('generates a component containing the wrapped component', () => {
    const componentFactory = withAuthentication();

    const Component = componentFactory(StubComponent);
    const wrapper = mountWithRouter(<Component attr="value"/>);

    expect(wrapper.find(StubComponent).exists({ attr: 'value' })).toBeTruthy();
  });

  test('sets up AuthContext provider', () => {
    const Component = withAuthentication({ path: '/somewhere', auth: {} })(StubComponent);

    const wrapper = shallow(<Component/>);

    expect(wrapper.find('ContextProvider').props()).toMatchObject({
      value: { path: '/somewhere', auth: {} }
    });
  });

  test('registers login route at the configured path', () => {
    const Component = withAuthentication({ path: '/do-auth' })(StubComponent);

    const wrapper = mountWithRouter(<Component/>);

    expect(wrapper.find('Route').filter({ path: '/do-auth' }).props()).toMatchObject({
      exact: true
    });
  });

  test('login route defaults to /login', () => {
    const Component = withAuthentication()(StubComponent);

    const wrapper = mountWithRouter(<Component/>);

    expect(wrapper.find('Route').exists({ path: '/login' })).toBeTruthy();
  });

  test('login route starts authorization flow', () => {
    const auth = { login: jest.fn() };
    const Component = withAuthentication({ auth })(StubComponent);

    mountWithRouter(<Component/>, { pathname: '/login', state: { from: {} } });

    expect(auth.login).toBeCalled();
  });

  test('login route persists post-auth destination', () => {
    const auth = { login: jest.fn() };
    const Component = withAuthentication({ auth, storageKey: 'kept-here' })(StubComponent);

    mountWithRouter(
      <Component/>,
      {
        pathname: '/login',
        state: {
          from: {
            pathname: '/private',
            search: '?attr=value',
            hash: '#fragment',
          }
        }
      }
    );

    expect(JSON.parse(sessionStorage['kept-here'])).toMatchObject({
      pathname: '/private',
      search: '?attr=value',
      hash: '#fragment',
    });
  });

  test('registers callback route at the configured path', () => {
    const Component = withAuthentication({ callback: '/verify-auth' })(StubComponent);

    const wrapper = mountWithRouter(<Component/>);

    expect(wrapper.find('Route').filter({ path: '/verify-auth' }).props()).toMatchObject({
      exact: true
    });
  });

  test('callback route defaults to {path}/callback', () => {
    const Component = withAuthentication({ path: '/somewhere' })(StubComponent);

    const wrapper = mountWithRouter(<Component/>);

    expect(wrapper.find('Route').exists({ path: '/somewhere/callback' })).toBeTruthy();
  });

  test('callback route verifies token from authorization flow', () => {
    const auth = { verify: jest.fn() };
    const storageKey = 'storage-key';
    const Component = withAuthentication({ auth, storageKey })(StubComponent);
    sessionStorage[storageKey] = JSON.stringify({
      pathname: '/path',
    });

    mountWithRouter(<Component/>, '/login/callback');

    expect(auth.verify).toBeCalled();
  });

  test('callback route navigates to original destination after verification', (done) => {
    const auth = {
      isAuthorised: false,
      verify(callback) {
        setTimeout(() => {
          this.isAuthorised = true;
          callback();
        }, 0);
      }
    };
    const storageKey = 'storage-key';
    const Component = withAuthentication({ auth, storageKey })(StubComponent);
    sessionStorage[storageKey] = JSON.stringify({
      pathname: '/private',
      search: '?attr=value',
      hash: '#fragment',
    });

    const wrapper = mountWithRouter(<Component/>, '/login/callback');

    setTimeout(() => {
      expect(wrapper.find(Router).instance().history.location).toMatchObject({
        pathname: '/private',
        search: '?attr=value',
        hash: '#fragment',
      });
      done();
    }, 5);
  });
});
