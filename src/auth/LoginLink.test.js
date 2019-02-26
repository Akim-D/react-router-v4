import React from 'react';
import {MemoryRouter as Router} from 'react-router';
import {mount} from 'enzyme';

import Auth from './services/Auth';
import LoginLink from './LoginLink';
import {AuthContext} from './AuthContext';

jest.mock('./services/Auth');

describe('LoginLink', () => {
  const auth = new Auth();
  const mountWithContext = (Component, location) => mount(
    <Router initialEntries={location && [location]}>
      <AuthContext.Provider value={{ auth, path: '/login' }}>
        {Component}
      </AuthContext.Provider>
    </Router>
  );

  beforeEach(() => {
    auth.isAuthorised = false;
  });

  test('links to the login route', () => {
    const wrapper = mountWithContext(<LoginLink>text</LoginLink>);

    expect(wrapper.find('NavLink').prop('to')).toMatchObject({
      pathname: '/login'
    });
  });

  test('uses children as link content', () => {
    const wrapper = mountWithContext(
      <LoginLink>text with <span className="the-class">other elements</span></LoginLink>
    );

    expect(wrapper.text()).toEqual('text with other elements');
    expect(wrapper.exists('span.the-class')).toBeTruthy();
  });

  test('uses current location as the post-authentication destination', () => {
    const wrapper = mountWithContext(
      <LoginLink>text</LoginLink>,
      '/here?and#now'
    );

    expect(wrapper.find('NavLink').prop('to')).toMatchObject({
      state: { from: { pathname: '/here', search: '?and', hash: '#now' } }
    });
  });

  test('forwards props', () => {
    const wrapper = mountWithContext(<LoginLink className="a-class" aria-label="navigation">content</LoginLink>);

    expect(wrapper.find('NavLink').props()).toMatchObject({
      className: 'a-class',
      'aria-label': 'navigation',
    });
  });

  test.each(
    ['staticContext', 'match', 'location', 'history']
  )('does not forward route prop "%s"', (omittedProp) => {
    const wrapper = mountWithContext(<LoginLink>link text</LoginLink>);

    expect(wrapper.find('NavLink').prop(omittedProp)).toBeUndefined();
  });

  test('to prop cannot be overridden', () => {
    const wrapper = mountWithContext(<LoginLink to="/nowhere">link text</LoginLink>);

    expect(wrapper.find('NavLink').prop('to')).not.toEqual('/nowhere');
  });

  test('does not normally render when authorised', () => {
    auth.isAuthorised = true;

    const wrapper = mountWithContext(<LoginLink>content</LoginLink>);

    expect(wrapper.text()).not.toEqual('content');
  });

  test('render if forced when authorised', () => {
    auth.isAuthorised = true;

    const wrapper = mountWithContext(<LoginLink alwaysShow>content</LoginLink>);

    expect(wrapper.text()).toEqual('content');
  });
});
