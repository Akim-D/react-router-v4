import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter as Router} from "react-router-dom";
import {mount} from 'enzyme';

import App from './App';
import Landing from './Landing';

describe('App', () => {
  test('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(
      <Router>
        <App/>
      </Router>,
      div);

    ReactDOM.unmountComponentAtNode(div);
  });

  test('loads landing page by default', () => {
    const wrapper = mount(
      <Router>
        <App/>
      </Router>
    );

    expect(wrapper.find(Landing).exists()).toBeTruthy();
  });
});
