import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
};

export default function CalendarWeek({ children }) {
  return (
    <tr>
      {children}
    </tr>
  );
}

CalendarWeek.propTypes = propTypes;
