import React from 'react';
import {MemoryRouter as Router} from 'react-router';
import {mount} from 'enzyme';

import Auth from './services/Auth';
import LogoutLink from './LogoutLink';
import {AuthContext} from './AuthContext';

jest.mock('./services/Auth');

describe('LogoutLink', () => {
  const auth = new Auth();
  const mountWithContext = (Component, location) => mount(
    <Router initialEntries={location && [location]}>
      <AuthContext.Provider value={{ auth, logoutPath: '/logout' }}>
        {Component}
      </AuthContext.Provider>
    </Router>
  );

  beforeEach(() => {
    auth.isAuthorised = true;
  });

  test('links to the logout route', () => {
    const wrapper = mountWithContext(<LogoutLink>text</LogoutLink>);

    expect(wrapper.find('NavLink').prop('to')).toMatchObject({
      pathname: '/logout'
    });
  });

  test('uses children as link content', () => {
    const wrapper = mountWithContext(
      <LogoutLink>text with <span className="some-class">another element</span></LogoutLink>
    );

    expect(wrapper.text()).toEqual('text with another element');
    expect(wrapper.exists('span.some-class')).toBeTruthy();
  });

  test('uses given URL as the post-authentication destination', () => {
    const wrapper = mountWithContext(<LogoutLink returnUrl="/home?attr=value#fragment">text</LogoutLink>);

    expect(wrapper.find('NavLink').prop('to')).toMatchObject({
      state: { to: '/home?attr=value#fragment' }
    });
  });

  test('forwards props', () => {
    const wrapper = mountWithContext(<LogoutLink className="a-class" aria-label="navigation">content</LogoutLink>);

    expect(wrapper.find('NavLink').props()).toMatchObject({
      className: 'a-class',
      'aria-label': 'navigation',
    });
  });

  test('to prop cannot be overridden', () => {
    const wrapper = mountWithContext(<LogoutLink to="/nowhere">link text</LogoutLink>);

    expect(wrapper.find('NavLink').prop('to')).not.toEqual('/nowhere');
  });

  test('does not normally render when unauthorised', () => {
    auth.isAuthorised = false;

    const wrapper = mountWithContext(<LogoutLink>link text</LogoutLink>);

    expect(wrapper.text()).not.toEqual('link text');
  });

  test('render if forced when unauthorised', () => {
    auth.isAuthorised = false;

    const wrapper = mountWithContext(<LogoutLink alwaysShow>content</LogoutLink>);

    expect(wrapper.text()).toEqual('content');
  });
});
