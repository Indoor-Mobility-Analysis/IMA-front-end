<template>
  <div class="station-selection-container">
    This is {{title}}
  </div>
</template>

<script>
  export default {
    name: 'StationSelection',
    data(){
      return {
        title: 'Station Selection Component'
      }
    }
  }
</script>

<style>
  .station-selection-container{
    background-color: #8bb6a6;
    /*height: 100%*/
  }
</style>
