import React from 'react';
import {Link} from 'react-router-dom';

import SiteTitle from './SiteTitle';

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <SiteTitle>Dashboard — Demo</SiteTitle>
        <p><Link to='/'>Home</Link></p>
        <p>Dashboard</p>
      </div>
    );
  }
}

export default Dashboard;
