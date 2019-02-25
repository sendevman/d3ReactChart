import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class RidgelineChart extends Component {
	componentDidMount() {
		if (this.props.data !== null)
		 this.calculateChart();
	};

	kernelDensityEstimator = (kernel, X) =>
		V => X.map(x => [x, d3.mean(V, v => kernel(x - v))]);

	kernelEpanechnikov = k =>
		v => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;

  calculateChart = () => {
		const { data, width, height, margin } = this.props;
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

		const svg = d3
				.select('#ridgelinechart_container')
				.append('svg')
				.attr('width', svgWidth + margin.left + margin.right)
				.attr('height', svgHeight + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		d3.csv(data, d => d).then(data => {
			const categories = data.columns;
			const n = categories.length;
		
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

			const kde = this.kernelDensityEstimator(this.kernelEpanechnikov(7), x.ticks(40));
			const allDensity = [];
			for (let i = 0; i < n; i++) {
					const key = categories[i];
					const density = kde(data.map(d => d[key]));
					allDensity.push({ key, density });
			}

			svg.selectAll('areas')
				.data(allDensity)
				.enter()
				.append('path')
				.attr('transform', d => 'translate(0,' + (yName(d.key) - svgHeight) + ')')
				.datum(d => d.density)
				.attr('fill', '#69b3a280')
				.attr('stroke', '#000')
				.attr('stroke-width', 1)
				.attr('d', d3.line()
					.curve(d3.curveBasis)
					.x(d => x(d[0]))
					.y(d => y(d[1]))
				);
		});
	}

  render() {
		return (
			<div id="ridgelinechart_container" />
		);
	}
}

RidgelineChart.propTypes = {
	data: PropTypes.string ,
 	width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
};

RidgelineChart.defaultProps = {
	data: null,
  width: 1000,
	height: 600,
	margin: { top: 100, right: 5, bottom: 20, left: 100 },
};

export default RidgelineChart;
