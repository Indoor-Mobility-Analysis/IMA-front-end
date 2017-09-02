<template>
  <div class="visualization-container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane style="height: 100%">
        <span slot="label"><i class="el-icon-date"></i> Map</span>
        <StationMap style="height: 100%"></StationMap>
      </el-tab-pane>
      <el-tab-pane label="Ticket" style="height: 100%">
        <span slot="label"><i class="el-icon-date"></i> Ticket</span>
        <TicketView> </TicketView>
      </el-tab-pane>
      <el-tab-pane label="Trend" style="height: 100%">
        <span id="trendTab" slot="label"><i class="el-icon-date"></i> Trend</span>
        <StationTrend  style="height: 100%"></StationTrend>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import pipeService from '../service/pipeService'
  import dataService from '../service/dataService'
  import StationMap from './VisualizationComponents/StationMap.vue'
  import StationTrend from './VisualizationComponents/StationTrend.vue'
  import TicketView from './VisualizationComponents/TicketView.vue'

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
        lastTime: 0,
        trendTabFlag: 1,
        isConnected: false,
        socketMessage: ''
      }
    },

    mounted(){
      let _this = this;
      this.lastRecord = this.currentRecord;
      pipeService.onStationSelected(function(stationId){
        _this.stationId = stationId;

        _this.$socket.emit('client_join', {'station_id': _this.stationId});
        dataService.readMap(stationId, function(map){
          _this.stationMap = map;
          _this.initializeMap();
        });
      });

      //Once a station is select
      pipeService.onMapReady(function(mapsObj){
        _this.records = [];
        _this.startUpdate();
      });
      pipeService.onFloorSelected(function(msg){
//          console.log('msg', _this.currentRecord['time_stamp'])
        pipeService.emitCurrentTime(_this.currentRecord['time_stamp'])
      });

      this.$options.sockets.my_response = (data) => {
        console.log('recieve data', data);
        _this.recieveData(data['data']);
//        console.log('recieve', data)
      }

      window.onbeforeunload = function(e) {
//        var dialogText = 'Dialog text here';
//        e.returnValue = dialogText;
        _this.$socket.emit('client_depart', {'station_id': _this.stationId});
//        return dialogText;
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > 1000){
            break;
          }
        }
      };
    },
    components:{
      StationMap,
      StationTrend,
      TicketView
    },

    destroyed(){
      this.$socket.emit('client_depart');
      this.$socket.emit('disconnect');

    },
    methods: {
      handleClick(tab, event) {

        if (tab.label == 'Trend' && this.trendTabFlag == 1) {
          pipeService.emitTrendTabClicked(this.trendTabFlag);
          this.trendTabFlag = 0;
        }
        if (tab.label == 'Ticket') {
          pipeService.emitTrendTabClicked('ticket');
        }
      },

      selectOneStation(key){
        pipeService.emitStationSelected(key);
      },
      initializeMap(){
        let _this = this;
        // Initialize map
        pipeService.emitMapReady(_this.stationMap);

        // Get legend
        dataService.rendLegendConfiguration(_this.stationId, function (legendConfig) {
          pipeService.emitLegendConfigReady(legendConfig);
        });
      },

      startUpdate(){
        let _this = this;
        let time = new Date();
        let time_stamp = 0;
        let timeGap = 5000;

        setInterval(function () {
          if (_this.currentRecord['next']) {
            _this.currentRecord = _this.currentRecord['next'];
            pipeService.emitRenderOneFrame(_this.currentRecord);
            if (_this.currentRecord['time_stamp'] && _this.currentRecord['time_stamp'] % 5 == 0) {
              pipeService.emitFreshPlayer(_this.currentRecord['time_stamp']);
            }
          } else {
          }
          time = new Date();
        }, 1000);
        time_stamp += timeGap;
      },
      recieveData(recordObj){

        let _this = this;
        let people_activity = recordObj['people_activity'];
        let ticket_record = recordObj['ticket_record'];

        people_activity = _this.aggregateRecords(people_activity, ticket_record);

        if (!people_activity && people_activity.length == 0) return;

        for (var i = 0, ilen = people_activity.length; i < ilen; i++) {
          if (_this.lastTime < people_activity[i]['time_stamp']) {
            _this.lastRecord['next'] = people_activity[i];
            _this.lastRecord = people_activity[i];
          }
        }
        _this.lastTime = people_activity[people_activity.length - 1]['time_stamp'];
      },
      aggregateRecords(records, ticket_records){

        // The records with same time stamp will be aggregated together
        records.sort((a, b) => a['time_stamp'] - b['time_stamp']);
        let aggregates = [];
        let time_stamp = 0;
        let obj = {'time_stamp': 0, 'records': [], 'tickets': []}
        records.forEach(function (record, i) {
          if (i == 0) {
            obj['time_stamp'] = record['time_stamp'];
            obj['records'] = [];
            obj['tickets'] = [];
          } else if (obj['time_stamp'] != record['time_stamp']) {
            aggregates.push(obj);
            obj = {'time_stamp': record['time_stamp'], 'records': [], 'tickets': []};
          }
          obj['records'].push(record);
          if (i == records.length - 1) {
            aggregates.push(obj);
          }
        });
        ticket_records.forEach(function (ticket) {
          let t_time = ticket['time_stamp'];
          aggregates.forEach(function (agg) {
            if (t_time == agg['time_stamp']) {
              agg['tickets'].push(ticket);
            }
          })
        });
        return aggregates
      }
    },
    socket:{
      events: {
        change(msg){
          console.log('something changed', msg);
        }
      }
    }
  }
</script>

<style>
  .visualization-container{
    height: 100%;
    margin-left: 10px;
  }
  .el-tabs__content{
    height: calc(100% - 45px);
  }
  .el-tabs--border-card{
    height: calc(100% - 10px);
  }
</style>
