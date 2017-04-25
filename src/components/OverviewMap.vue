<template>
  <div class="overview-map-container">
    <div >This is a {{title}}</div>
    <img src="http://itf170b.cse.ust.hk/images/map.png" style="height:90%"> </img>
  </div>
</template>

<script>
  export default {
    name: 'OverviewMap',
    data(){
      return {
        title: 'OverviewMap'
      }
    }
  }
</script>

<style>
  .overview-map-container{
    background-color: #4fb699;
    /*height: 100%*/
  }
</style>
