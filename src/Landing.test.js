import React from 'react';
import {shallow} from 'enzyme';

import Landing from './Landing';

describe('Landing', () => {
  test('is welcoming', () => {
    const wrapper = shallow(<Landing/>);

    expect(wrapper.text()).toContain('Welcome');
  });
});
