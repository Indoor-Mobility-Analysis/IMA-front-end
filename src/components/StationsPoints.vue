<template>
	<div class="station"
		 v-bind:style="{left: stationObj.left,
		 				top: stationObj.top,
		 				height: stationObj.height, 
		 				width: stationObj.width,
		 				'background-color': color,
		 				'box-shadow': shadow}">
	</div>
</template>

<script>
	import pipeService from '../service/pipeService';
	export default {
		name: 'station',
		props:['stationObj'],
		data(){
			return {
				title: 'Station Point Component',
				stationId: null,
				count: null,
				max: null,
				color: null,
				shadow: null

			}
		},
		mounted(){
			let _this = this;
			this.stationId = this.$el.id;
			pipeService.onDatetimeSelected(function(msg){
				_this.max = msg['max_count'];
				_this.count = msg[_this.stationId];

				var rrr = new Color(218, 4, 0),
					ggg = new Color(57, 157, 53),
					yyy = new Color(209, 127, 32);

				if (_this.count > _this.max / 2) {
					start = yyy,
					end = rrr;
				}
				var startColors = start.getColors(),
					endColors = end.getColors();
				var r = Interpolate(startColors.r, endColors.r, 50, _this.count),
					g = Interpolate(startColors.g, endColors.g, 50, _this.count),
					b = Interpolate(startColors.b, endColors.b, 50, _this.count);

				_this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.4";
				_this.shadow = "0px 0px 10px 5px rgba(" + r + ", " + g + ", " + b + ", 0.4";
			})
		},
		methods: {
			Interpolate(start, end, steps, count) {
				var s = start,
				e = end,
				final = s + (((e - s) / steps) * count);
				return Math.floor(final);
			},

			Color(_r, _g, _b) {
			    var r, g, b;
			    var setColors = function(_r, _g, _b) {
					r = _r;
					g = _g;
					b = _b;
			 	};
				setColors(_r, _g, _b);
				this.getColors = function() {
					var colors = {
						r: r,
						g: g,
						b: b
					};
			    	return colors;
				};
			}
		}
	}
</script>

<style scope>
	.station{
		cursor: pointer;
		position: absolute;
		background-color: rgba(56, 158, 44, 0.4);
		box-shadow: 0px 0px 10px 5px rgba(56, 158, 44, 0.4);
}
</style>
