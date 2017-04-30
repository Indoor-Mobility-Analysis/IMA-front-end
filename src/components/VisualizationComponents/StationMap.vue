<template>
  <div class="station-map-container">
    <div class="layer-select-ratio">
      <el-radio v-for="layerObj in mapDataArr" class="radio" v-model="floorSelect" v-bind:label="layerObj.floor" :key="layerObj.floor">Layer:{{layerObj.floor}}</el-radio>
    </div>
    <div class="layer-station-map">
    </div>
  </div>
</template>

<script>
  import pipeService from '../../service/pipeService'
  import StationMap from '../../lib/StationMap'
  export default {
    name: 'Map',
    data(){
      return {
        title: 'Map',
        floorSelect: 0,
        mapDataArr:[],
        stationMap: null
      }
    },
    components:{

    },
    mounted(){
      let _this = this;
      pipeService.onMapReady(function(mapData){
        _this.mapDataArr = _this.parseMaps(mapData);
        _this.mapDataArr.forEach(function(mapObj){
          console.log('_this.$el: ', _this.$el);
          if(_this.stationMap == null || _this.stationMap['stationId'] != mapData['stationId']) _this.stationMap = new StationMap(_this.$el, _this.mapDataArr);
          if(mapObj['floor'] == _this.floorSelect){
            _this.stationMap.setMap(mapObj);
          }
        })
      });
      pipeService.onLegendConfigReady(function(data){
        console.log('_this.legendData: ', data);
        console.log('_this.StationMap: ', _this.stationMap);
        console.log('_this.StationMap.getStationId(): ', _this.stationMap.getStationId());
        _this.legendData = data;
        if(_this.legendData && _this.stationMap && (_this.stationMap.getStationId() == _this.legendData['stationId'])){
          console.log('create legend');
          _this.stationMap.setLegend(_this.legendData['legendConfig']);
        }
      });
      // Update render
      pipeService.onRenderOneFrame(function(frame){
        console.log('frame', frame)
        _this.frameData = _this.parseFrame(frame);
        console.log('frameData: ', _this.frameData);
        if(_this.stationMap){
          _this.stationMap.updateHeatmapCanvas(_this.frameData)
        }
      })
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
            //Update rendering

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
      }
    }
  }
</script>

<style>
  .station-map-container{
    /*background-color: #b6b08f;*/
    height: 100%;
    width: 100%;
  }
  .layer-select-ratio{
    margin-top: -5px;
  }

  .layer-station-map{
    height: calc(100% - 23px);
  }
</style>
