<template>
  <div class="station-map-container">
    <!--<div class="layer-select-ratio">-->
    <!--<el-radio v-for="layerObj in mapDataArr" class="radio" v-model="floorSelect" v-bind:label="layerObj.floor" :key="layerObj.floor">Layer:{{layerObj.floor}}</el-radio>-->
    <!--</div>-->
    <div class="layer-station-map">
    </div>
    <el-dialog :modal = "true" title="Evacuation Simulation" :visible.sync="dialogVisible"
               @open="keepComponent = true"
               @close="keepComponent = false"
               size="tiny" >
      <FlowControl v-if="keepComponent"
                   :controlMaps="controlMaps"
                   :mapId="controlMapId"
                   :legendData="legendData"
                   :controlFrame="controlFrame"

      >
      </FlowControl>
    </el-dialog>
  </div>
</template>

<script>
  import pipeService from '../../service/pipeService'
  import StationMap from '../../lib/StationMap'
  import FlowControl from './FlowControl.vue'
  import * as d3 from "d3";

  export default {
    name: 'Map',
    data(){
      return {
        title: 'Map',
        containerClass: 'layer-station-map',
        drawContainerClass: 'layer-station-map_origin',
        type: 'origin',
        floorSelect: 0,
        mapDataArr:[],
        stationMap: null,
        stationMaps: null,
        dialogVisible: false,
        currentData: false,
        mapData:false,
        controlMaps: null,
        controlMapId: 0,
        legendData: null,
        frameData: null,
        controlFrame: null,
        keepComponent: true
      }
    },
    components:{
      FlowControl
    },
    mounted(){
      let _this = this;
      pipeService.onMapReady(function(mapData){
        _this.mapDataArr = _this.parseMaps(mapData);
        _this.controlMaps = _this.mapDataArr;
        _this.mapDataArr.forEach(function(mapObj){
          if(_this.stationMap == null || _this.stationMap['stationId'] != mapData['stationId']) _this.stationMap = new StationMap(d3.select('.'+_this.containerClass).node(), _this.drawContainerClass, _this.type);
          if(mapObj['floor'] == _this.floorSelect){
            _this.stationMap.setMap(_this.mapDataArr, _this.floorSelect);
            _this.stationMap.onEvent('flowControl', function(d){
              _this.controlFrame = Object.assign({},_this.frameData);
              _this.dialogVisible = true;
            })
          }
        })
      });
      pipeService.onLegendConfigReady(function(data){
        _this.legendData = data;
        if(_this.legendData && _this.stationMap && (_this.stationMap.getStationId() == _this.legendData['stationId'])){
          console.log('create legend', _this.legendData);
          _this.stationMap.setLegend(_this.legendData['legendConfig']);
        }
      });
      // Update render
      pipeService.onRenderOneFrame(function(frame){
        // console.log('one frame: ', frame)
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
            _this.stationMap.setMap(_this.mapDataArr, floorSelect);
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
  .el-dialog__body{
    padding: 20px 15px !important;
  }
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
