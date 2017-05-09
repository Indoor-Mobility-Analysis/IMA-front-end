<template>
  <div class="overview-map-container">
    <div >This is a {{title}}</div>
    <div class="component-container">
      <div class="map-container">
        <img src="http://itf170b.cse.ust.hk/images/map.png" style="width:100%; height: auto"/>
        <StationPoints v-for="station in stations" v-bind:stationObj="station" v-bind:key="station.stationId"></StationPoints>
      </div>
    </div>
    <div class="col-md-4">
      <label>Please select a date and a timestamp that you would like to review:</label>
      <datetimepicker></datetimepicker>
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
        stations:[]
      }
    },
    mounted(){
      let _this = this;
      dataService.readStationRecord(function(stationRecords){
        _this.stations = stationRecords;
      })
    }
  }
</script>

<style>
  .overview-map-container{
    background-color: #4fb699;
    /*height: 100%*/
  }

  .map-container{
    position: relative;
    width: 80%;
    margin:0 auto
  }

  .components-container{
    line-height: 300%;
  }

  .col-md-4{
    line-height: 250%;
    margin-left: 9%;
  }

</style>
