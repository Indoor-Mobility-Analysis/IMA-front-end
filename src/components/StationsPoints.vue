<template>
	<div class="station"
		 v-bind:style="{left: stationObj.left, 
		 				top: stationObj.top, 
		 				height: stationObj.height, 
		 				width: stationObj.width,
		 				'background-color': color,
		 				'box-shadow': shadow}"
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
				color: null,
				shadow: null,
				colorVal: null

			}
		},
		mounted(){
			let _this = this;
			// this.stationId = this.$el.id;
			console.log('AAAAA', _this.stationId);
			pipeService.onDatetimeSelected(function(msg){
				_this.max = msg['max_count'];
				_this.count = msg[_this.stationId];
				_this.colorVal = 100 * _this.count / _this.max

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

		        var r = Interpolate(startColors.r, endColors.r, 50, _this.colorVal);
		        var g = Interpolate(startColors.g, endColors.g, 50, _this.colorVal);
		        var b = Interpolate(startColors.b, endColors.b, 50, _this.colorVal);

				_this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.4";
				_this.shadow = "0px 0px 10px 5px rgba(" + r + ", " + g + ", " + b + ", 0.4";
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
