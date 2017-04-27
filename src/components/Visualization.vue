<template>
  <div class="visualization-container">
    <el-dropdown @command="selectOneStation" >
        <span class="el-dropdown-link">
          Select Station: <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="admiralty">Admiralty</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-tabs type="border-card" style="height: 100%">
      <el-tab-pane style="height: 100%">
        <span slot="label"><i class="el-icon-date"></i> Map</span>
        <StationMap  style="height: 100%"></StationMap>
      </el-tab-pane>
      <el-tab-pane label="Ticket">
        <span slot="label"><i class="el-icon-date"></i> Ticket</span>
        Ticket
      </el-tab-pane>
      <el-tab-pane label="Trend">
        <span slot="label"><i class="el-icon-date"></i> Trend</span>
        Trend
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import pipeService from '../service/pipeService'
  import dataService from '../service/dataService'
  import StationMap from './VisualizationComponents/StationMap.vue'
  export default {
    name: 'Visualization',
    data(){
      return {
        title: 'Visualization Component',
        stationId: null,
        stationMap: null,

        records: {},
        currentRecord:{next: undefined},
        lastRecord: null,
        lastTime: 0
      }
    },
    mounted(){
      let _this = this;
      this.lastRecord = this.currentRecord;
      pipeService.onStationSelected(function(stationId){
        _this.stationId = stationId;
        dataService.readMap(stationId, function(map){
          _this.stationMap = map;
          _this.initializeMap();
        });
      });

      //Once a station is select
      pipeService.onMapReady(function(mapsObj){
        _this.records = [];
        _this.startUpdate();
      })
    },
    components:{
      StationMap
    },
    methods:{
      selectOneStation(key){
        pipeService.emitStationSelected(key);
      },
      initializeMap(){
        let _this = this;
        // Initialize map
        pipeService.emitMapReady(_this.stationMap);

        // Get legend
        dataService.rendLegendConfiguration(_this.stationId, function(legendConfig){
          pipeService.emitLegendConfigReady(legendConfig);
        });
      },

      startUpdate(){
        let _this = this;
        let time = new Date();
        let time_stamp = 0;
        let timeGap = 5000;

        setInterval(function(){
          if(_this.currentRecord['next']){
            _this.currentRecord = _this.currentRecord['next'];
            pipeService.emitRenderOneFrame(_this.currentRecord);
          }else{

          }
          time = new Date();
        }, 1000);

        setInterval(function(){
          _this.getRecordsFromTime(time_stamp, timeGap);
          time_stamp += timeGap;
        }, 3000)
      },
      getRecordsFromTime(time_stamp, timeRange) {
        let _this = this;
        dataService.readRecordWithTimeRange(_this.stationId, time_stamp, timeRange, function(records){

          records = _this.aggregateRecords(records);
          if(!records && records.length == 0) return;

          for(var i = 0, ilen = records.length; i < ilen; i++){
            if(_this.lastTime < records[i]['time_stamp']){
              _this.lastRecord['next'] = records[i];
              _this.lastRecord = records[i];
            }
          }
          _this.lastTime = records[records.length - 1]['time_stamp'];
        });
      },
      aggregateRecords(records){
        // The records with same time stamp will be aggregated together
        records.sort((a, b)=> a['time_stamp'] - b['time_stamp']);
        let aggregates = [];
        let time_stamp = 0;
        let obj = {'time_stamp': 0, 'records': []}
        records.forEach(function(record, i){
          if(i == 0) {
            obj['time_stamp'] = record['time_stamp'];
//            console.log('time', record['time_stamp']);
            obj['records'] = [];
          }else if(obj['time_stamp'] != record['time_stamp']){
            aggregates.push(obj);
            obj = {'time_stamp': record['time_stamp'], 'records': []};
          }
          obj['records'].push(record);
          if( i == records.length - 1){
            aggregates.push(obj);
          }
        });

        return aggregates
      }
    }
  }
</script>

<style>
  .visualization-container{
    background-color: #ae93b6;
    height: 100%
  }
  .el-tabs__content{
    height: 90%
  }
</style>
