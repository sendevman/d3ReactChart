import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import tData from './data.tsv';

class HBarChart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// svgWidth: props.width,
			// svgHeight: props.height,
			// svgMargin: props.margin,
			// padding: props.padding,

			// xScale: d3
			// 	.scaleBand()
			// 	.range([props.margin.left, props.width - props.margin.right])
			// 	.padding(props.padding),
			// yScale: d3
			// 	.scaleLinear()
			// 	.range([props.height - props.margin.bottom, props.margin.top]),
			// xAxisRef: null,
			// yAxisRef: null,
		};

		// this.xAxis = d3.axisBottom().scale(this.state.xScale);
    // this.yAxis = d3
    //   .axisRight()
    //   .scale(this.state.yScale)
		// 	.tickFormat(d => `${d * 100}%`);
	}

	componentDidMount() {
    this.calculateChart();
	};

	componentDidUpdate() {
    // d3.select(this.state.xAxisRef).call(this.xAxis);
    // d3.select(this.state.yAxisRef).call(this.yAxis);
	}

	// xAxisRef = element => {
  //   this.setState({ xAxisRef: element });
  //   d3.select(element).call(this.xAxis);
	// };

	// yAxisRef = element => {
  //   this.setState({ yAxisRef: element });
  //   d3.select(element).call(this.yAxis);
	// };

	type = d => {
		d.value = +d.value;
		return d;
	};

  calculateChart = () => {
		var margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

		var x = d3.scaleLinear()
				.range([0, width]);

		var y = d3.scaleBand()
				.range([0, height])
				.paddingInner(0.2);

		var xAxis = d3.axisBottom()
				.scale(x);

		var yAxis = d3.axisRight()
				.scale(y)
				.tickSize(0)
    		.tickPadding(6);
		
		var svg = d3.select("#container").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.tsv(tData, d => ({
			name: d.name,
			value: d.value,
		}))
		.then(data => {
			x.domain(d3.extent(data, d => parseInt(d.value))).nice()
			y.domain(data.map(d => d.name))
			svg.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", d => "bar bar--" + (d.value < 0 ? "negative" : "positive"))
					.attr("x", d => x(Math.min(0, d.value)))
					.attr("y", d => y(d.name))
					.attr("width", d => Math.abs(x(d.value) - x(0)))
					.attr("height", y.bandwidth);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

  		svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + x(0) + ",0)")
				.call(yAxis);
		});
	}

  render() {
		const { svgWidth, svgHeight, svgMargin } = this.state;
		return (
			<div id="container">
				{/* <svg id="hbarchart" width={svgWidth} height={svgHeight}>
					<g id="wrapper" transform="translate(40, 20)">
  				</g>
					<g>
						<g
							ref={this.xAxisRef}
							transform={`translate(0, ${svgHeight - svgMargin.bottom})`}
						/>
						<g
							ref={this.yAxisRef}
							transform={`translate(${svgMargin.left}, 0)`} />
					</g>
				</svg> */}
			</div>
		);
	}
}

HBarChart.propTypes = {
  width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
	padding: PropTypes.number,
};

HBarChart.defaultProps = {
  width: 1000,
	height: 600,
	margin: { top: 20, right: 5, bottom: 20, left: 35 },
	padding: 0.2,
};

export default HBarChart;
