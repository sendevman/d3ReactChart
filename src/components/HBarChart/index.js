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
				.scaleBand()
				.range([props.margin.left, props.width - props.margin.right])
				.padding(props.padding),
			yScale: d3
				.scaleLinear()
				.range([props.height - props.margin.bottom, props.margin.top]),
			xAxisRef: null,
			yAxisRef: null,
		};

		this.xAxis = d3.axisBottom().scale(this.state.xScale);
    this.yAxis = d3
      .axisLeft()
      .scale(this.state.yScale)
      .tickFormat(d => `${d}%`);
	}

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

  render() {
		const { svgWidth, svgHeight, svgMargin } = this.state;
		return (
			<div id="container">
				<svg id="hbarchart" width={svgWidth} height={svgHeight}>
					<g>
						<g
							ref={this.xAxisRef}
							transform={`translate(0, ${svgHeight - svgMargin.bottom})`}
						/>
						<g
							ref={this.yAxisRef}
							transform={`translate(${svgMargin.left}, 0)`} />
					</g>
				</svg>
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
