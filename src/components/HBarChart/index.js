import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class HBarChart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			svgWidth: props.width,
			svgHeight: props.height,
			svgMargin: props.margin,
			padding: props.padding,

			xScale: d3
				.scaleLinear()
				.range([props.margin.left, props.width - props.margin.right - props.margin.left]),
			yScale: d3
				.scaleBand()
				.range([props.margin.top, props.height - props.margin.bottom - props.margin.top])
				.paddingInner(props.padding)
				.paddingOuter(props.padding),
			xAxisRef: null,
			yAxisRef: null,
		};

		this.xAxis = d3
			.axisBottom()
			.scale(this.state.xScale);
    this.yAxis = d3
      .axisRight()
      .scale(this.state.yScale)
			.tickSize(0)
    	.tickPadding(6);
	}

	componentDidMount() {
		if (this.props.data) {
			this.calculateChart();
		}
	};

	componentDidUpdate() {
    d3.select(this.state.xAxisRef).call(this.xAxis);
    d3.select(this.state.yAxisRef).call(this.yAxis);
	}

	xAxisRef = element => {
    this.setState({ xAxisRef: element });
    d3.select(element).call(this.xAxis);
	};

	yAxisRef = element => {
    this.setState({ yAxisRef: element });
    d3.select(element).call(this.yAxis);
	};

	type = d => {
		d.value = +d.value;
		return d;
	};

  calculateChart = () => {
		const { svgWidth, svgHeight, svgMargin, xScale, yScale } = this.state;
		const { tData } = this.props;
		const width = svgWidth - svgMargin.left - svgMargin.right,
					height = svgHeight - svgMargin.top - svgMargin.bottom,
					margin = svgMargin;

		const svg = d3.select("#container svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g");

		d3.tsv(this.props.data, d => ({
			name: d.name,
			value: d.value,
		}))
		.then(data => {
			this.setState({
				xScale: xScale.domain(d3.extent(data, d => parseInt(d.value))).nice(),
				yScale: yScale.domain(data.map(d => d.name)),
			}, () => {
				svg.selectAll(".bar")
						.data(data)
						.enter().append("rect")
						.attr("class", d => "bar bar--" + (d.value < 0 ? "negative" : "positive"))
						.attr("x", d => this.state.xScale(Math.min(0, d.value)))
						.attr("y", d => this.state.yScale(d.name))
						.attr("width", d => Math.abs(xScale(d.value) - this.state.xScale(0)))
						.attr("height", this.state.yScale.bandwidth);
			});
		});
	}

  render() {
		const { svgHeight, svgMargin, xScale } = this.state;
		return (
			<div id="container">
				<svg id="hbarchart">
					<g>
						<g
							className="x axis"
							ref={this.xAxisRef}
							transform={`translate(0, ${svgHeight - svgMargin.top - svgMargin.bottom})`}
						/>
						<g
							className="y axis"
							ref={this.yAxisRef}
							transform={`translate(${xScale(0)}, 0)`} />
					</g>
				</svg>
			</div>
		);
	}
}

HBarChart.propTypes = {
	data: PropTypes.element,
  width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
	padding: PropTypes.number,
};

HBarChart.defaultProps = {
	data: null,
  width: 1000,
	height: 600,
	margin: { top: 20, right: 5, bottom: 20, left: 35 },
	padding: 0.2,
};

export default HBarChart;
