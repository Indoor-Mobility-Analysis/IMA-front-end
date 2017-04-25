<template>
  <div class="visualization-container">
    This is {{title}}
  </div>
</template>

<script>
  export default {
    name: 'Visualization',
    data(){
      return {
        title: 'Visualization Component'
      }
    }
  }
</script>

<style>
  .visualization-container{
    background-color: #ae93b6;
    /*height: 100%*/
  }
</style>
