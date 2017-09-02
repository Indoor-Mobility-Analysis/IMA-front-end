<template>
  <div class="station-map-container">
    <!--<div class="layer-select-ratio">-->
    <!--<el-radio v-for="layerObj in mapDataArr" class="radio" v-model="floorSelect" v-bind:label="layerObj.floor" :key="layerObj.floor">Layer:{{layerObj.floor}}</el-radio>-->
    <!--</div>-->
    <div class="layer-station-map">
    </div>
    <el-dialog :modal = "true" title="Flow Control" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
      <FlowControl></FlowControl>
    </el-dialog>
  </div>
</template>

<script>
  import pipeService from '../../service/pipeService'
  import StationMap from '../../lib/StationMap'
  import FlowControl from './FlowControl.vue'

  export default {
    name: 'Map',
    data(){
      return {
        title: 'Map',
        floorSelect: 0,
        mapDataArr:[],
        stationMap: null,
        dialogVisible: false,
        currentData: false,
        mapData:false
      }
    },
    components:{
      FlowControl
    },
    mounted(){
      let _this = this;
      pipeService.onMapReady(function(mapData){
        console.log('mapdata', mapData);
        _this.mapDataArr = _this.parseMaps(mapData);
        _this.mapDataArr.forEach(function(mapObj){
          if(_this.stationMap == null || _this.stationMap['stationId'] != mapData['stationId']) _this.stationMap = new StationMap(_this.$el, _this.mapDataArr);
          if(mapObj['floor'] == _this.floorSelect){
            _this.stationMap.setMap(mapObj);
            _this.stationMap.onEvent('flowcontrol', function(d){
              _this.dialogVisible = true;
            })
          }
        })
      });
      pipeService.onLegendConfigReady(function(data){
        _this.legendData = data;
        if(_this.legendData && _this.stationMap && (_this.stationMap.getStationId() == _this.legendData['stationId'])){
          console.log('create legend');
          _this.stationMap.setLegend(_this.legendData['legendConfig']);
        }
      });
      // Update render
      pipeService.onRenderOneFrame(function(frame){
        _this.frameData = _this.parseFrame(frame);
        if(_this.stationMap){
          _this.stationMap.updateHeatmapCanvas(_this.frameData);
          _this.stationMap.updateArrowmap(_this.frameData);
          // _this.stationMap.updateBubblemap(_this.frameData);
        }
      });
      pipeService.onFloorSelected(function(floor){
        console.log('floor', floor);
        let formatFloor = parseInt(floor);
        if(floor != undefined || floor != null){
          _this.mapDataArr.forEach(function(mapObj){
            if(mapObj['floor'] == formatFloor){
              _this.floorSelect = formatFloor
            }
          })
        }
      });
    },
    watch:{
      floorSelect(floorSelect){
        let _this = this;
        if(!this.stationMap){
          console.log('No map');
          return;
        }
        _this.mapDataArr.forEach(function(mapObj){
          if(mapObj['floor'] == floorSelect){
            _this.stationMap.setMap(mapObj);
          }
        })
        _this.stationMap.setLegend(_this.legendData['legendConfig']);
      }
    },
    methods:{
      parseMaps(mapData){
        let mapDataArr = [];
        for(var i = 10, smallest = -10; i > smallest; i--){
          if(mapData[i]!= undefined){
            mapDataArr.push({
              map: mapData[i],
              floor: i,
              stationId: mapData['stationId']
            })
          }
        }
        return mapDataArr;
      },
      parseFrame(oneFrame){
        let _this = this;
        if(!oneFrame['records']) return;
        let records = oneFrame['records']
        let recordsObj = {}
        for(var i = 10, smallest = -10; i > smallest; i--){
          if(records[i]!= undefined){
            recordsObj[i==0?i: -i] = records[i];
          }
        }
        return recordsObj;
      },
      handleClose(){
        console.log('close');
      }
    }
  }
</script>

<style>

  .el-dialog{
    left: 35% !important;
    top: 8% !important;
  }
  .station-map-container{
    /*background-color: #b6b08f;*/
    height: 100%;
    width: 100%;
  }
  .layer-select-ratio{
    margin-top: -5px;
  }

  .layer-station-map{
    height: calc(100% - 40px);
  }
  canvas{
    pointer-events: none;
  }
</style>
