import React from 'react';
import PropTypes from 'prop-types';

function updateTitle(title) {
  document.title = title;
}

class SiteTitle extends React.Component {
  componentDidMount() {
    updateTitle(this.props.children);
  }

  render() {
    return null;
  }
}

SiteTitle.propTypes = {
  children: PropTypes.string.isRequired,
};

export default SiteTitle;
export {updateTitle};
