<template>
  <div id="app">
    <OverviewMap class="top-container"></OverviewMap>
    <div class="analysiscontainer">
      <section id="analysisview" class="middle-container">
        <StationSelection class="middle-left"></StationSelection>
        <VideoAnalysis class="middle-middle"></VideoAnalysis>
        <Visualization class="middle-right"></Visualization>
      </section>
    </div>
    <footer class="def-footer">
      footer
    </footer>
  </div>
</template>

<script>
  import OverviewMap from './components/OverviewMap.vue'
  import StationSelection from './components/StationSelection.vue'
  import VideoAnalysis from './components/VideoAnalysis.vue'
  import Visualization from './components/Visualization.vue'
  import pipeService from './service/pipeService'
  import dataService from './service/dataService'
  export default {
    name: 'app',
    components:{
      OverviewMap,
      StationSelection,
      VideoAnalysis,
      Visualization
    },
    data(){
      return {

      }
    },
    mounted(){
//      window.onwheel = function(){ return false; }
    },
    methods:{
      startUpdate(){

      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #5e7382;
    /*margin-top: 60px;*/
    /*overflow-y: visible;*/
  }
  html::-webkit-scrollbar
  {
    background-color: #ffffff;
    width: 1px;
  }

  .top-container{
    height: 100%
  }
  .analysiscontainer{
    height: 100%;
    background-color:#f3f3f3;
  }
  .middle-container{
    margin-top: 10px;
    width: 80%;
    height: 98%;
    display: inline-block
  }
  .middle-left{
    width: 20%;
    height: 98%;
    float: left;
  }
  .middle-middle{
    height: 98%;
    width: 30%;
    float: left;
  }
  .middle-right{
    height: 100%;
    width: 48%;
    float: left;
  }
  .def-footer{
    background-color: #4fb699;
    height: 10%
  }
</style>
