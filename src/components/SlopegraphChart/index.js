import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './style.css';
import Slopegraph from './slopegraph';

class SlopegraphChart extends Component {
	componentDidMount() {
		if (this.props.data !== null)
		 this.calculateChart();
	};

	textAlign = m => {
		return (d, i) => i ? 'start' : 'end';
	};

	textMargin = m => {
		return (d, i) => i ? m * 1 : m * -1;
	};

  calculateChart = () => {
		const { data, width, height, margin } = this.props;
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

		const svg = d3
				.select('#slopegraphchart_container')
				.append('svg')
				.attr('width', svgWidth + margin.left + margin.right)
				.attr('height', svgHeight + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		d3.csv(data, d => ({
			year: parseInt(d.year),
			country: d.country,
			value: parseFloat(d.value),
		})).then(data => {
			let y_dom = d3.extent(data, d => d.value).reverse(),
					x_dom = d3.extent(data, d => d.year),

					y = d3.scaleLinear()
							.domain(y_dom)
							.range([0, svgHeight]),
					x = d3.scaleLinear()
							.domain(x_dom)
							.range([390, 570]),
					layout = new Slopegraph().init(data)
							.j('country').y('value').x('year')
							.textHeight((y_dom[0] - y_dom[1]) / svgHeight * 14);
			svg.append('g')
					.attr('class', 'years')
					.selectAll('text').data(x_dom).enter()
					.append('text')
					.attr('x', x)
					.attr('dx', (d, i) => i ? 10 : -10)
					.attr('y', -40)
					.style('text-anchor', this.textAlign())
					.text(String);

			var line = d3.line()
					.x(d => x(d.year))
					.y(d => y(d.y));

			var pairs = svg.append('g')
					.attr('class', 'lines')
					.selectAll('g')
					.data(layout.pairs()).enter()
					.append('g');

			pairs.append('path')
					.attr('d', line);

			pairs.selectAll('.country')
					.data(d => d).enter()
					.append('text')
					.attr('class', 'country')
					.attr('x', d => x(d.year))
					.attr('dx', this.textMargin(48))
					.attr('dy', '.32em')
					.attr('y', d => y(d.y))
					.style('text-anchor', this.textAlign())
					.text(d => d.country);

			pairs.selectAll('.value')
					.data(d => d).enter()
					.append('text')
					.attr('class', 'value')
					.attr('x', d => x(d.year))
					.attr('dy', '.32em')
					.attr('dx', this.textMargin(10))
					.attr('y', d => y(d.y))
					.style('text-anchor', this.textAlign())
					.text(d => d.value.toFixed(1));

			svg.append('g')
					.attr('class', 'desc')
					.selectAll('text')
					.data(['Current Receipts of Government as a'
								, 'Percentage of Gross Domestic'
								, 'Product, 1970 and 1979'
								]).enter()
					.append('text')
					.attr('y', (d,i) => i * 20)
					.attr('dy', '-.32em')
					.attr('x', 13)
					.text(String);
		});
	}

  render() {
		return (
			<div id="slopegraphchart_container" />
		);
	}
}

SlopegraphChart.propTypes = {
	data: PropTypes.string ,
 	width: PropTypes.number,
	height: PropTypes.number,
	margin: PropTypes.object,
};

SlopegraphChart.defaultProps = {
	data: null,
  width: 1000,
	height: 900,
	margin: { top: 100, right: 5, bottom: 20, left: 100 },
};

export default SlopegraphChart;
