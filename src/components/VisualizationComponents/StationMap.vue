<template>
  <div class="station-map-container">
    <div class="layer-select-ratio">
      <el-radio v-for="layerObj in mapDataArr" class="radio" v-model="floorSelect" v-bind:label="layerObj.floor" :key="layerObj.floor">Layer:{{layerObj.floor}}</el-radio>
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
          if(_this.stationMap == null || _this.stationMap['stationId'] != mapData['stationId']) _this.stationMap = new StationMap(_this.$el, _this.mapDataArr);
          if(mapObj['floor'] == _this.floorSelect){
            _this.stationMap.setMap(mapObj);
          }
        })
      });
      // Update render
      pipeService.onRenderOneFrame(function(frame){
        console.log('frame', frame)
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
      }
    }
  }
</script>

<style scoped>
  .station-map-container{
    /*background-color: #b6b08f;*/
    height: 100%;
    width: 100%;
  }
  .layer-select-ratio{
    margin-top: -5px;
  }
</style>
