import React from 'react';
import {mount, shallow} from 'enzyme';

import SiteTitle from './SiteTitle';

describe('SiteTitle', () => {
  test('does not render content', () => {
    const title = shallow(<SiteTitle>This is a title</SiteTitle>);

    expect(title.children()).toHaveLength(0);
  });

  test('updates the site title after mounting', () => {
    mount(<SiteTitle>This is a title</SiteTitle>);

    expect(document.title).toEqual('This is a title');
  });
});
