import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HBarChart extends Component {
  render() {
		return (
			<div>
				here
			</div>
		);
	}
}

HBarChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

HBarChart.defaultProps = {
  width: 1000,
  height: 600,
};

export default HBarChart;
