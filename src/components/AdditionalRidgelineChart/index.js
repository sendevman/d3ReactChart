import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class AdditionalRidgelineChart extends Component {
	componentDidMount() {
		if (this.props.data !== null)
		 this.calculateChart();
	};

  calculateChart = () => {
		const { data, width, height, margin } = this.props;
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

		const svg = d3
				.select('#additionalridgelinechart_container')
				.append('svg')
				.attr('width', svgWidth + margin.left + margin.right)
				.attr('height', svgHeight + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		const categories = Object.keys(data);

		const x = d3
			.scaleLinear()
			.domain([-10, 140])
			.range([ 0, svgWidth ]);

		svg
			.append('g')
			.attr('transform', 'translate(0,' + svgHeight + ')')
			.call(d3.axisBottom(x));

		const y = d3
			.scaleLinear()
			.domain([0, 0.4])
			.range([ svgHeight, 0]);

		const yName = d3
			.scaleBand()
			.domain(categories)
			.range([0, svgHeight])
			.paddingInner(1);

		svg
			.append('g')
			.call(d3.axisLeft(yName));

		const allDensity = categories.map(d => ({ key: d, density: data[d].density, lower_bound: data[d].lower_bound, upper_bound: data[d].upper_bound	}));
		
		allDensity.forEach(edata => {
			let nfirst = 0, nSecond = 0, nThird = 0;
			edata.density.forEach(densityData => {
				if (densityData[0] < edata.lower_bound) {
					nfirst = nfirst + 1;
				} else if (densityData[0] >= edata.lower_bound && densityData[0] < edata.upper_bound) {
					nSecond = nSecond + 1;
				} else {
					nThird = nThird + 1;
				}
			});
			const density_first = edata.density.slice(0, nfirst);
			const density_second = edata.density.slice(nfirst - 1, nfirst + nSecond);
			const density_third = edata.density.slice(nfirst + nSecond - 1, nfirst + nSecond + nThird);
			const data = [
				{ density: density_first, fillColor: '#7b7b7b', key: edata.key },
				{ density: density_second, fillColor: '#3131ff63', key: edata.key },
				{ density: density_third, fillColor: '#7b7b7b', key: edata.key }
			];
			svg.selectAll('areas')
				.data(data)
				.enter()
				.append('path')
				.attr('transform', d => 'translate(0,' + (yName(d.key) - svgHeight) + ')')
				.attr('stroke', '#7b7b7b')
				.attr('fill', d => d.fillColor)
				.attr('stroke-width', 1)
				.datum(d => d.density)
				.attr('d', d3.area()
					.curve(d3.curveBasis)
					.x(d => x(d[0]))
					.y0(height - 120)
					.y1(d => y(d[1]))
				);
		});
	}

  render() {
		return (
			<div id="additionalridgelinechart_container" />
		);
	}
}

AdditionalRidgelineChart.propTypes = {
	data: PropTypes.object ,
 	width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
};

AdditionalRidgelineChart.defaultProps = {
	data: null,
  width: 1000,
	height: 600,
	margin: { top: 100, right: 5, bottom: 20, left: 100 },
};

export default AdditionalRidgelineChart;
