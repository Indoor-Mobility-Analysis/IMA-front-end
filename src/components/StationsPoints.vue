<template>
	<div class="station"
		 v-bind:style="{left: stationObj.left, 
		 				top: stationObj.top, 
		 				height: stationObj.height, 
		 				width: stationObj.width,
		 				'background-color': backgroundColor,
		 				'box-shadow': boxShadow}"
	>
	</div>
</template>

<script>
	import pipeService from '../service/pipeService';
	import Color from '../lib/Color';
	export default {
		name: 'station',
		props:['stationObj'],
		data(){
			return {
				title: 'Station Point Component',
				stationId: null,
				count: null,
				max: null,
				backgroundColor: null,
				boxShadow: null,
				colorVal: null,

			}
		},
		mounted(){
			let _this = this;
			this.stationId = this.$el.id;
			pipeService.onDatetimeSelected(function(msg){
				_this.max = msg['max_count'];
				_this.count = msg[_this.stationId];
				_this.colorVal = 100 * _this.count / _this.max
				var step = 20;

	            var red = new Color(218, 4, 0),
		            yellow = new Color(209, 127, 32),
		            green = new Color(57, 157, 53),
		            start = green,
		            end = yellow;

		        if (_this.colorVal > 50) {
		            start = yellow,
		            end = red;
		            _this.colorVal = _this.colorVal % 51;
		        }

		        var startColors = start.getColors(),
		            endColors = end.getColors();

		        var Interpolate = function(start, end, steps, count) {
				    var s = start,
				        e = end,
				        final = s + (((e - s) / steps) * count);
				    return Math.floor(final);
				}

		        var r = Interpolate(startColors.r, endColors.r, step, _this.colorVal);
		        var g = Interpolate(startColors.g, endColors.g, step, _this.colorVal);
		        var b = Interpolate(startColors.b, endColors.b, step, _this.colorVal);

				_this.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", 0.4)";
				_this.boxShadow = "0px 0px 10px 5px rgba(" + r + ", " + g + ", " + b + ", 0.6)";
			})
		}
	}
</script>

<style scope>
	.station{
		cursor: pointer;
		position: absolute;
}
</style>
