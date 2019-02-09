import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './style.css';

class HBarChart extends Component {
	componentDidMount() {
		if (this.props.data !== null)
		 this.calculateChart();
	};

  calculateChart = () => {
		const { data, width, height, margin } = this.props;
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

		const x = d3
				.scaleLinear()
				.range([0, svgWidth]);

		const y = d3
				.scaleBand()
				.range([0, svgHeight])
				.paddingInner(0.2)
				.paddingOuter(0.2);

		const yLabel = d3
				.scaleBand()
				.range([0, svgHeight])
				.paddingInner(0.2)
				.paddingOuter(0.2);

		const xAxis = d3
				.axisBottom()
				.scale(x);

		const yAxis = d3
				.axisLeft()
				.scale(y)
				.tickSize(0)
				.tickPadding(6);

		const yLabelAxis = d3
				.axisLeft()
				.scale(yLabel)
				.tickSize(0)
				.tickPadding(6);

		const svg = d3
				.select('#hbarchart_container')
				.append('svg')
				.attr('width', svgWidth + margin.left + margin.right)
				.attr('height', svgHeight + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		d3.tsv(data, d => ({
			name: d.name,
			value: d.value,
		}))
		.then(data => {
			x.domain(d3.extent(data, d => parseInt(d.value))).nice();
			y.domain(data.map(d => d.name));
			yLabel.domain(data.map(d => d.value));
			svg.selectAll('.bar')
				.data(data)
				.enter().append('rect')
				.attr('class', d => 'bar bar--' + (d.value < 0 ? 'negative' : 'positive'))
				.attr('x', d => x(Math.min(0, d.value)))
				.attr('y', d => y(d.name))
				.attr('width', d => Math.abs(x(d.value) - x(0)))
				.attr('height', y.bandwidth);

			svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + svgHeight + ')')
				.call(xAxis);

  		svg.append('g')
				.attr('class', 'y axis')
				.attr('transform', 'translate(' + x(0) + ', 0)')
				.call(yAxis)
				.selectAll('text').remove();

			svg.append('g')
				.attr('class', 'ylabelL axis')
				.attr('transform', 'translate(-30, 0)')
				.call(yAxis)
				.call(g => g.select('.domain').remove());

			svg.append('g')
				.attr('class', 'ylabel axis')
				.attr('transform', 'translate(0, 0)')
				.call(yLabelAxis)
				.call(g => g.select('.domain').remove());

			svg.selectAll('g.ylabel .tick')
				.filter(d => parseInt(d) > 0)
				.select('text')
				.style('color', 'steelblue')

			svg.selectAll('g.ylabel .tick')
				.filter(d => parseInt(d) <= 0)
				.select('text')
				.style('color', 'darkorange')
		});
	}

  render() {
		return (
			<div id="hbarchart_container" />
		);
	}
}

HBarChart.propTypes = {
	data: PropTypes.string ,
  width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
};

HBarChart.defaultProps = {
	data: null,
  width: 1000,
	height: 600,
	margin: { top: 20, right: 5, bottom: 20, left: 65 },
};

export default HBarChart;
