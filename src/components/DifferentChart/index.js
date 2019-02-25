import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class DifferentChart extends Component {
	componentDidMount() {
		// if (this.props.data !== null)
		 this.calculateChart();
	};

  calculateChart = () => {
		const { width, height, margin } = this.props;
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

		const svg = d3
				.select('#differentchart_container')
				.append('svg')
				.attr('width', svgWidth + margin.left + margin.right)
				.attr('height', svgHeight + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// const categories = Object.keys(data);

		// const x = d3
		// 	.scaleLinear()
		// 	.domain([-10, 140])
		// 	.range([ 0, svgWidth ]);

		// svg
		// 	.append('g')
		// 	.attr('transform', 'translate(0,' + svgHeight + ')')
		// 	.call(d3.axisBottom(x));

		// const y = d3
		// 	.scaleLinear()
		// 	.domain([0, 0.4])
		// 	.range([ svgHeight, 0]);

		// const yName = d3
		// 	.scaleBand()
		// 	.domain(categories)
		// 	.range([0, svgHeight])
		// 	.paddingInner(1);

		// svg
		// 	.append('g')
		// 	.call(d3.axisLeft(yName));

		const initdata = [
			{date: '2011-10-01T00:00', value0: 63.4, value1: 62.7},
			{date: '2011-10-02T00:00', value0: 58, value1: 59.9},
			{date: '2011-10-03T00:00', value0: 53.3, value1: 59.1},
			{date: '2011-10-04T00:00', value0: 55.7, value1: 58.8},
			{date: '2011-10-05T00:00', value0: 64.2, value1: 58.7},
			{date: '2011-10-06T00:00', value0: 58.8, value1: 57},
			{date: '2011-10-07T00:00', value0: 57.9, value1: 56.7},
			{date: '2011-10-08T00:00', value0: 61.8, value1: 56.8},
			{date: '2011-10-09T00:00', value0: 69.3, value1: 56.7},
			{date: '2011-10-10T00:00', value0: 71.2, value1: 60.1},
			{date: '2011-10-11T00:00', value0: 68.7, value1: 61.1},
			{date: '2011-10-12T00:00', value0: 61.8, value1: 61.5},
			{date: '2011-10-13T00:00', value0: 63, value1: 64.3},
			{date: '2011-10-14T00:00', value0: 66.9, value1: 67.1},
			{date: '2011-10-15T00:00', value0: 61.7, value1: 64.6},
			{date: '2011-10-16T00:00', value0: 61.8, value1: 61.6},
			{date: '2011-10-17T00:00', value0: 62.8, value1: 61.1},
			{date: '2011-10-18T00:00', value0: 60.8, value1: 59.2},
			{date: '2011-10-19T00:00', value0: 62.1, value1: 58.9},
			{date: '2011-10-20T00:00', value0: 65.1, value1: 57.2},
			{date: '2011-10-21T00:00', value0: 55.6, value1: 56.4},
			{date: '2011-10-22T00:00', value0: 54.4, value1: 60.7},
			{date: '2011-10-23T00:00', value0: 54.4, value1: 65.1},
			{date: '2011-10-24T00:00', value0: 54.8, value1: 60.9},
			{date: '2011-10-25T00:00', value0: 57.9, value1: 56.1},
			{date: '2011-10-26T00:00', value0: 54.6, value1: 54.6},
			{date: '2011-10-27T00:00', value0: 54.4, value1: 56.1},
			{date: '2011-10-28T00:00', value0: 42.5, value1: 58.1},
			{date: '2011-10-29T00:00', value0: 40.9, value1: 57.5},
			{date: '2011-10-30T00:00', value0: 38.6, value1: 57.7},
			{date: '2011-10-31T00:00', value0: 44.2, value1: 55.1},
			{date: '2011-11-01T00:00', value0: 49.6, value1: 57.9},
			{date: '2011-11-02T00:00', value0: 47.2, value1: 64.6},
			{date: '2011-11-03T00:00', value0: 50.1, value1: 56.2},
			{date: '2011-11-04T00:00', value0: 50.1, value1: 50.5},
			{date: '2011-11-05T00:00', value0: 43.5, value1: 51.3},
			{date: '2011-11-06T00:00', value0: 43.8, value1: 52.6},
			{date: '2011-11-07T00:00', value0: 48.9, value1: 51.4},
			{date: '2011-11-08T00:00', value0: 55.5, value1: 50.6},
			{date: '2011-11-09T00:00', value0: 53.7, value1: 54.6},
			{date: '2011-11-10T00:00', value0: 57.7, value1: 55.6}
		];
		const data = initdata.map(d => ({
			date: new Date(d.date),
			value0: d.value0, // The primary value.
			value1: d.value1, // The secondary comparison value.
		}));
		data.y = "°F"
		const x = d3.scaleTime()
			.domain(d3.extent(data, d => d.date))
			.range([margin.left, width - margin.right])

		const y = d3.scaleLinear()
			.domain([
				d3.min(data, d => Math.min(d.value0, d.value1)),
				d3.max(data, d => Math.max(d.value0, d.value1))
			]).nice(5)
			.range([height - margin.bottom, margin.top])
		
		const xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x)
					.ticks(width / 80)
					.tickSizeOuter(0))
			.call(g => g.select(".domain").remove())
		
		const yAxis = g => g.append("g")
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
			.call(g => g.select(".domain").remove())
			.call(g => g.select(".tick:last-of-type text").clone()
					.attr("x", 3)
					.attr("text-anchor", "start")
					.attr("font-weight", "bold")
					.text(data.y))
			
		const colors = [
			"#91bfdb",
			"#fc8d59"
		];

		const curve = d3.curveStep

		const aboveUid = "above";
		const belowUid = "below";

		svg.datum(data);

		svg.append("g")
				.call(xAxis);

		svg.append("g")
				.call(yAxis);

		svg.append("clipPath")
				.attr("id", aboveUid)
				.append("path")
				.attr("d", d3.area()
					.curve(curve)
					.x(d => x(d.date))
					.y0(0)
					.y1(d => y(d.value1)));

		svg.append("clipPath")
				.attr("id", belowUid)
				.append("path")
				.attr("d", d3.area()
						.curve(curve)
						.x(d => x(d.date))
						.y0(height)
						.y1(d => y(d.value1)));

		svg.append("path")
				.attr("clip-path", aboveUid)
				.attr("fill", colors[1])
				.attr("d", d3.area()
						.curve(curve)
						.x(d => x(d.date))
						.y0(height)
						.y1(d => y(d.value0)));

		svg.append("path")
				.attr("clip-path", belowUid)
				.attr("fill", colors[0])
				.attr("d", d3.area()
						.curve(curve)
						.x(d => x(d.date))
						.y0(0)
						.y1(d => y(d.value0)));

		svg.append("path")
				.attr("fill", "none")
				.attr("stroke", "black")
				.attr("stroke-width", 1.5)
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("d", d3.line()
						.curve(curve)
						.x(d => x(d.date))
						.y(d => y(d.value0)));
	}

  render() {
		return (
			<div id="differentchart_container" />
		);
	}
}

DifferentChart.propTypes = {
	data: PropTypes.object ,
 	width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
};

DifferentChart.defaultProps = {
	data: null,
  width: 1000,
	height: 600,
	margin: { top: 100, right: 5, bottom: 20, left: 100 },
};

export default DifferentChart;
