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
		// console.log('here', allDensity);
		// svg.selectAll('areas')
		// 	.data(allDensity)
		// 	.enter()
		// 	.append('path')
		// 	.attr('transform', d => 'translate(0,' + (yName(d.key) - svgHeight) + ')')
		// 	.attr('stroke', '#000')
		// 	.attr('stroke-width', 2)
		// 	.datum(d => d.density)
		// 	.attr('fill', '#ffffff')
		// 	.attr('d', d3.line()
		// 		.curve(d3.curveBasis)
		// 		.x(d => x(d[0]))
		// 		.y(d => y(d[1]))
		// 	);
		
		allDensity.forEach(edata => {
			let nfirst = 0, nSecond = 0, nThird = 0;
			edata.density.map(densityData => {
				if (densityData[0] < edata.lower_bound) {
					nfirst = nfirst + 1;
				} else if (densityData[0] >= edata.lower_bound && densityData[0] < edata.upper_bound) {
					nSecond = nSecond + 1;
				} else {
					nThird = nThird + 1;
				}
			});
			const density_first = edata.density.slice(0, nfirst);
			const density_second = edata.density.slice(nfirst - 1, nfirst + nSecond + 1);
			const density_third = edata.density.slice(nfirst + nSecond, nfirst + nSecond + nThird);
			console.log(edata.density, density_first, density_second, density_third);
			svg.selectAll('areas')
				.data([{ density: density_first }])
				.enter()
				.append('path')
				.attr('transform', 'translate(0,' + (yName(edata.key) - svgHeight) + ')')
				.attr('stroke', '#000')
				.attr('stroke-width', 1)
				.datum(d => d.density)
				.attr('fill', '#69b3a2')
				.attr('d', d3.area()
					.curve(d3.curveBasis)
					.x(d => x(d[0]))
					.y0(height - 120)
					.y1(d => y(d[1]))
				);
			svg.selectAll('areas')
				.data([{ density: density_second }])
				.enter()
				.append('path')
				.attr('transform', 'translate(0,' + (yName(edata.key) - svgHeight) + ')')
				.attr('stroke', '#000')
				.attr('stroke-width', 1)
				.datum(d => d.density)
				.attr('fill', '#908753')
				.attr('d', d3.area()
					.curve(d3.curveBasis)
					.x(d => x(d[0]))
					.y0(height - 120)
					.y1(d => y(d[1]))
				);
			svg.selectAll('areas')
				.data([{ density: density_third }])
				.enter()
				.append('path')
				.attr('transform', 'translate(0,' + (yName(edata.key) - svgHeight) + ')')
				.attr('stroke', '#000')
				.attr('stroke-width', 1)
				.datum(d => d.density)
				.attr('fill', '#69b3a2')
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
