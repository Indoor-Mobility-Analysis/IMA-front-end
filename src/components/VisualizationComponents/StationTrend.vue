<template>
  <div class="station-trend-container">
  </div>
</template>

<script>
  import pipeService from '../../service/pipeService'
  import StationTrend from '../../lib/StationTrend'
  import * as d3 from 'd3'

  export default {
    name: 'Trend',
    data(){
      return {
        title: "Trend",
        stationTrend: null,
        trendTabFlag: 0
      }
    },
    mounted(){
      let _this = this;

       _this.stationTrend = new StationTrend(_this.$el);

      pipeService.onTrendTabClicked(function(trendTabFlag){
        if (trendTabFlag == 1) {
          setTimeout(function(){
            _this.stationTrend.initContainer();
            _this.trendTabFlag = trendTabFlag;
          }, 0)
        }
      });

      // Update render
      pipeService.onRenderOneFrame(function(frame){
          if(_this.trendTabFlag) {
            _this.stationTrend.updateLinechart(frame);
          }
          else {
            _this.stationTrend.updateData(frame);
          }
      });
    }
  }
</script>

<style>
  .station-trend-container{
    /*background-color: #b6b08f;*/
    height: 100%;
    width: 100%;
  }

  .graph .axis {
    stroke-width: 1;
    }

  .graph .axis .tick line {
    stroke: black;
  }

  .graph .axis .tick text {
    fill: black;
    font-size: 0.7em;
  }

  .graph .axis .domain {
    fill: none;
    stroke: black;
  }

  .graph .group {
    fill: none;
    stroke: black;
    stroke-width: 1.5;
  }
</style>
