<template>
  <div class="overview-map-container">
    <div >This is an {{title}}</div>
    <div class="component-container">
      <div class="map-container">
        <!-- <img src="http://itf170b.cse.ust.hk/images/map.png" style="width:100%; height: auto"/> -->
        <img src="http://maxwell.ielm.ust.hk/thales/mtr-visualization/images/mtr-system-map.jpg"/>
        <StationPoints v-for="station in stations"
                       v-bind:stationObj="station"
                       v-bind:key="station.StationId"
                       v-bind:id="station.StationId">
        </StationPoints>
        <!--</img>-->
        <datetimepicker class="picker"></datetimepicker>
      </div>
    </div>
  </div>

</template>

<script>
  import StationPoints from './StationsPoints.vue';
  import datetimepicker from './DatetimePicker.vue';
  import pipeService from '../service/pipeService';
  import dataService from '../service/dataService';

  export default {
    name: 'OverviewMap',
    components: {
      StationPoints,
      "datetimepicker": datetimepicker
    },
    data(){
      return {
        title: 'OverviewMap',
        stations: [],
      }
    },
    mounted(){
      let _this = this;
      dataService.readStationRecord(function(stationRecords){
        _this.stations = stationRecords;
      })
    }
  };
</script>

<style scope>
  .overview-map-container{
    background-color: #4fb699;
    height: 100%
  }

  .component-container{
    line-height: 500%;
  }

  .map-container{
    position: relative;
    margin: auto;
    width: 75%;
  }

  img {
    display: block;
    margin: auto;
    max-width: 100%;
    max-height: 90%;
    width: 100%;
    height: auto;
    z-index: 50;
  }

  .picker{
    float: left;
    z-index: 100;
    top: 1%;
    right: 1%;
  }

</style>
