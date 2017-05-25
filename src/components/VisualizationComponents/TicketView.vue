<template>
  <div class="ticket-view-container">
  </div>
</template>

<script>
  import pipeService from '../../service/pipeService'
  import TicketTrend from '../../lib/TicketTrend'

  import * as d3 from 'd3'

  export default {
    name: 'Trend',
    data(){
      return {
        title: "Trend",
      }
    },
    mounted(){
      let _this = this;
      _this.ticketTrend = new TicketTrend(this.$el);

      pipeService.onTrendTabClicked(function(msg){
        if(msg == 'ticket'){
          setTimeout(function(){
            _this.ticketTrend.initContainer();
          }, 0);
        }
      });

      pipeService.onRenderOneFrame(function(frame){
        if(_this.ticketTrend){
          _this.ticketTrend.addData(frame['tickets'],frame['time_stamp']);
        }
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
