<template>
  <div><a >
    <div v-on:click="clickPoint"
         class="station"
         v-bind:style="{left: stationObj.left,
		 				top: stationObj.top,
		 				height: stationObj.height,
		 				width: stationObj.width,
		 				'background-color': backgroundColor,
		 				'box-shadow': boxShadow}">
    </div></a>
  </div>
</template>

<script>
  import pipeService from '../service/pipeService';
  import Color from '../lib/Color';
  import jquery from 'jquery'
  export default {
    name: 'station',
    props:['stationObj'],
    data(){
//        //href="#analysisview"
      return {
        title: 'Station Point Component',
        stationId: null,
        count: null,
        max: null,
        backgroundColor: null,
        boxShadow: null,
        colorVal: null,
        tweeningValue: 0
      }
    },
    mounted(){
      let _this = this;
      this.stationId = this.$el.id;
      pipeService.onDatetimeSelected(function(msg){
        var max = msg['max_count'];
        var count = msg[_this.stationId];
        var colorVal = 100 * count / max
        var step = 20;

        var red = new Color(218, 4, 0),
          yellow = new Color(209, 127, 32),
          green = new Color(57, 157, 53),
          start = green,
          end = yellow;

        if (colorVal > 50) {
          start = yellow,
            end = red;
          colorVal = colorVal % 51;
        }

        var startColors = start.getColors(),
          endColors = end.getColors();

        var Interpolate = function(start, end, steps, count) {
          var s = start,
            e = end,
            final = s + (((e - s) / steps) * count);
          return Math.floor(final);
        }

        var r = Interpolate(startColors.r, endColors.r, step, colorVal);
        var g = Interpolate(startColors.g, endColors.g, step, colorVal);
        var b = Interpolate(startColors.b, endColors.b, step, colorVal);

        _this.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", 0.4)";
        _this.boxShadow = "0px 0px 10px 5px rgba(" + r + ", " + g + ", " + b + ", 0.6)";
      })
    },
    methods:{
      clickPoint(){
        pipeService.emitStationSelected('admiralty');

        jquery('html, body').stop().animate({
          scrollTop:jquery(jquery('#analysisview')).offset().top
        }, 500, 'swing');
      }
    },
    watch:{
      tweeningValue(d){
        console.log('dx', d)
      }
    }
  }
</script>

<style scope>
  .station{
    cursor: pointer;
    /*position: absolute;*/
  }
</style>
