<template>
  <div class="overview-map-container">
    <div >This is an {{title}}</div>
    <div class="component-container">
      <div class="map-container">
        <img src="http://itf170b.cse.ust.hk/images/map.png" style="width:100%; height: auto"/>
        <StationPoints v-for="station in stations" v-bind:stationObj="station" v-bind:key="station.StationId" v-bind:id="station.StationId"></StationPoints>
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
    /*height: 100%*/
  }

  .map-container{
    position: relative;
    width: 60%;
    height: auto;
    margin:0 auto
  }

  .component-container{
    line-height: 500%;
  }

  .picker{
    float: left;
  }

</style>
