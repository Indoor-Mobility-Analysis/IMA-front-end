<template>
  <div class="station" v-bind:style="{left: stationObj.left, top: stationObj.top, height: stationObj.height, width: stationObj.width}"></div>
</template>

<script>
  import pipeService from '../service/pipeService';
  import dataService from '../service/dataService';
  export default {
    name: 'station',
    props:['stationObj'],
    data(){
      return {
        title: 'Station Point Component',
        stationId: null,
        day: null,
        time: null,
        count: null,
        color: null,
        max: null,

      }
    },
    mounted(){
      let _this = this;
      this.stationId = this.$el.id;
      pipeService.onDatetimeSelected(function(datetime){
        var dt = new Date(datetime);
        var hour = dt.getHours();
        var minu = dt.getMinutes();

        _this.day = dt.getDay();
        _this.time = (hour - 8) * 12 + Math.floor(minu / 5);
        var tup = dataService.readPeopleCount(_this.stationId, _this.day, _this.time);
        _this.count = tup[1];
        _this.max = tup[0];

        var rrr = new Color(218, 4, 0),
            ggg = new Color(57, 157, 53),
            yyy = new Color(209, 127, 32);

        if (_this.count > _this.max / 2) {
          start = yyy,
            end = rrr;
        }
        var startColors = start.getColors(),
          endColors = end.getColors();
        var r = Interpolate(startColors.r, endColors.r, 50, _this.count);
        var g = Interpolate(startColors.g, endColors.g, 50, _this.count);
        var b = Interpolate(startColors.b, endColors.b, 50, _this.count);
        console.log('run here', datetime);

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

<style>
  .station{
    cursor: pointer;
    position: absolute;
    background-color: rgba(56, 158, 44, 0.2);
    box-shadow: 0px 0px 10px 5px rgba(56, 158, 44, 0.4);
  }
</style>
