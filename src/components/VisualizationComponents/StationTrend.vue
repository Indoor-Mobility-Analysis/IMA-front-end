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
        stationTrend: null
      }
    },
    mounted(){
      let _this = this;
      
    //   setTimeout(function(){
    //   console.log('width----',_this.$el.clientWidth);            
    //   }, 10000)

    //   console.log(d3.select('.el-tabs__nav'));
    //   console.log(d3.select('.el-tabs__nav').node());
    //   console.log(d3.select('.el-tabs__nav').node()[2]);

    //   console.log('---------------------------------------')
    //   console.log(document.getElementsByClassName("el-tabs__nav"));
    //   console.log(document.getElementsByClassName("el-tabs__nav")[0]);
    //   console.log(document.getElementsByClassName("el-tabs__nav")[0].childNodes);
    //   console.log(document.getElementsByClassName("el-tabs__nav")[0].childNodes[2]);

    //   console.log(document.getElementsByClassName("el-tabs__nav")[0].lastElementChild);

      pipeService.onTrendTabClicked(function(trendTabFlag){
        console.log('onTrendTabClicked');
        if (trendTabFlag == 1) {
          setTimeout(function(){
            console.log('width----',_this.$el.clientWidth);
            _this.stationTrend = new StationTrend(_this.$el);
          }, 0)
        }
      });

      // Update render
      pipeService.onRenderOneFrame(function(frame){
          console.log('TrendView, newRenderData', frame);
          if(_this.stationTrend != null) {
            _this.stationTrend.updateLinechart(frame);
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
