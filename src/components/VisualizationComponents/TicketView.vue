<template>
  <div class="ticket-view-container">
    ticket
  </div>
</template>

<script>
  import pipeService from '../../service/pipeService'

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

      console.log('mount ticket');

      pipeService.onTrendTabClicked(function(trendTabFlag){

      });


      pipeService.onRenderOneFrame(function(frame){

      });
    }
  }
</script>

<style>
  .ticket-view-container{
    /*background-color: #b6b08f;*/
    height: 100%;
    width: 100%;
  }

</style>
