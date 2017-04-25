<template>
  <div class="video-analysis-container">
    This is {{title}}
  </div>
</template>

<script>
  export default {
    name: 'VideoAnalysis',
    data(){
      return {
        title: 'Video Analysis Component'
      }
    }
  }
</script>

<style>
  .video-analysis-container{
    background-color: #7574b6;
    /*height: 100%*/
  }
</style>
