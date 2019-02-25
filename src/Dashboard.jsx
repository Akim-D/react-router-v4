import React from 'react';

import SiteTitle from './SiteTitle';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <SiteTitle>Dashboard — Demo</SiteTitle>
        <p>This would be the dashboard.</p>
      </div>
    );
  }
}

export default Dashboard;
