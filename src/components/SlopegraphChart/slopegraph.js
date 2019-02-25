import * as d3 from 'd3';

const _accessor = function(s) {
	return (typeof s === 'function') ? s : function(d) { return d[s]; }
}

const crunch = function(data, min_needed_dist, get_x, get_y, get_j) {

	min_needed_dist = min_needed_dist || 0.5;

	// step 1: group the values
	let rollup_rows = {},
			rollup_cols = {},
			xs = [],
			js = [];

	for (let di=0,dl=data.length; di<dl; di++) {
		let item = data[di],
				x = get_x(item),
				j = get_j(item);

		item.y = get_y(item);

		rollup_rows[j] = rollup_rows[j] || {};
		rollup_rows[j][x] = item;

		rollup_cols[x] = rollup_cols[x] || [];
		rollup_cols[x].push(item);

		xs.push(x);
		js.push(j);
	}

	xs = d3.set(xs).values().sort(d3.ascending);
	let facts = d3.set(js).values().map(function (j) {
		return xs.map(function (x) {
			return rollup_rows[j][x];
		});
	});

	// step 2: "fan out" label positions to remove overlaps
	for (let col_id in rollup_cols) {

		let column = rollup_cols[col_id].sort(function (a, b) {
			let r = get_y(a) - get_y(b);
			if (r === 0) {
				if (get_j(a) > get_j(b)) {
					return -1;
				}
				if (get_j(a) < get_j(b)) {
					return 1;
				}
			}
			return r;
		});

		let improoving = true,
				steps = 0;

		while (improoving) {

			let last_gap_size = null,
					smallest_gap = null,
					smallest_gap_size = -Infinity;

			// compute distances
			for (let i=0,l=column.length; i<l; i++) {
				let item = column[i],
						prev = column[i - 1],
						next = column[i + 1];
				// space above
				if (!prev) {
					item._top = Infinity;
				}
				else {
					item._top = item.y - prev.y;
					// remember it if it was important
					if (!smallest_gap || smallest_gap_size > item._top) {
						smallest_gap = [item, prev];
						smallest_gap_size = item._top;
					}
				}
				// space below
				if (!next) {
					item._bottom = Infinity;
				}
				else {
					item._bottom = next.y - item.y;
					// remember it if it was important
					if (!smallest_gap || smallest_gap_size > item._bottom) {
						smallest_gap = [next, item];
						smallest_gap_size = item._bottom;
					}
				}
			}
			// find the smallest gap
			if (smallest_gap_size >= min_needed_dist || /* no overlaps present */
					 steps > 1000 /* we're going nowhere fast */) {
				break;
			}
			steps++;

			// push items apart, aiming toward empty spaces
			let t = smallest_gap[0]._bottom + smallest_gap[1]._top,
					a = isFinite(t) ? smallest_gap[0]._bottom / t : 1,
					b = isFinite(t) ? smallest_gap[1]._top    / t : 1,
					force = min_needed_dist / 4;

			smallest_gap[0].y += force * a;
			smallest_gap[1].y -= force * b;

			// stop doing this when labels stop overlapping
			improoving = (smallest_gap_size >= (last_gap_size || 0));

			last_gap_size = smallest_gap_size;
		}

	}

	return facts;

}

class Slopegraph {
  constructor() {

		this.get_x = _accessor( 'x' );
		this.get_y = _accessor( 'y' );
		this.get_j = _accessor( Number );
		this.data = [];
		this.cached = undefined;
		this.min_needed_dist = undefined;
	}

	init(d) {
		if ( arguments.length ) {
			this.cached = undefined;
			this.data = d;
			return this;
		}
		return this.data;
	}

	data() { return this; };

	j( d ) {
		if ( arguments.length ) {
			this.get_j = _accessor( d );
			return this;
		}
		return this.get_j;
	};

	x( d ) {
		if ( arguments.length ) {
			this.get_x = _accessor( d );
			return this;
		}
		return this.get_x;
	};

	y( d ) {
		if ( arguments.length ) {
			this.get_y = _accessor( d );
			return this;
		}
		return this.get_y;
	};

	textHeight( h ) {
		if ( arguments.length ) {
			this.min_needed_dist = h;
			this.cached = undefined;
			return this;
		}
		return this.min_needed_dist;
	};

	left( d ) {
		return [];
	};

	right( d ) {
		return [];
	};

	pairs( d ) {
		return this.cached || (this.cached = crunch( this.data, this.min_needed_dist, this.get_x, this.get_y, this.get_j ));
	};
}

export default Slopegraph;
