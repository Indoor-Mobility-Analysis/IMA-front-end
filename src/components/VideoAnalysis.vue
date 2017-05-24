<template>
  <div class="video-analysis-container">
    <div class = "wrapper">
      <div class ="nav-logo">
        <icon class = "logo" name="play-circle" scale = "2" color="#fff"></icon>
      </div>
      <div class = "nav-selection">
        <p>{{title}}</p>
      </div>
    </div>
    <div class = "video-player-1">
      <video-player  ref="videoPlayer" :options="playerOptions"></video-player>
    </div>
    <div class = "video-player-2">
      <video-player ref="videoPlayer" :options="playerOptions2"></video-player>
    </div>
    <div class ="video-player-3">
      <video-player ref="videoPlayer" :options="playerOptions3"></video-player>
    </div>
    <div style = "display:none"></div>
  </div>
</template>

<script>
  import bus from "../assets/eventBus";
  import pipeService from "../service/pipeService";

  export default {
    name: 'VideoAnalysis',
    data(){
      return {
        title:'Video Analysis',
        playerOptions: {
          start: 0,
          playsinline: false,
          muted: true,
          controls:false,
          language: 'en',
          height:200,
          autoplay:true,
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: "/ima/static/video/admiralty/g/111.mp4"
          }],
        },
        playerOptions2:{
          start:0,
          playsinline:false,
          muted:true,
          controls:false,
          language:'en',
          playbackRates:[0.7, 1.0, 1.5, 2.0],
          height:200,
          autoplay:true,
          sources: [{
            type: "video/mp4",
            src: "/ima/static/video/admiralty/g/110.mp4"
          }],
        },
        playerOptions3:{
          start:0,
          playsinline:false,
          controls:false,
          muted:true,
          language:'en',
          playbackRates:[0.7, 1.0, 1.5, 2.0],
          height:200,
          autoplay:true,
          sources: [{
            type: "video/mp4",
            src: "/ima/static/video/admiralty/g/109.mp4"
          }],
        }
      }
    },
    mounted(player){
      var self = this;
      bus.$on("event1",function(){
        self.playerOptions.sources = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/lg1/113.mp4"
        }];
        self.playerOptions2.sources = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/lg1/112.mp4"
        }];
        self.playerOptions3.sources  = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/lg1/114.mp4"
        }];
      });
      bus.$on("event2",function(){
        self.playerOptions.sources = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/g/111.mp4"
        }];
        self.playerOptions2.sources = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/g/110.mp4"
        }];
        self.playerOptions3.sources  = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/g/109.mp4"
        }];
      });
      bus.$on("event3",function(){
        self.playerOptions.sources = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/lg2/115.mp4"
        }];
        self.playerOptions2.sources = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/lg2/116.mp4"
        }];
        self.playerOptions3.sources  = [{
          type: "video/mp4",
          src: "/ima/static/video/admiralty/lg2/117.mp4"
        }];
      });

      pipeService.onFreshPlayer(function(timestampe){

      });
    }
  }
</script>

<style>
  .video-analysis-container{
    background-color: #FFF;
    /*height: 100%*/
  }
  .wrapper{
    display:-webkit-box;
    background-color:#9CC;
    height:40px;
  }
  .nav-logo{
    height:50px;
  }
  .nav-selection{
    padding:5px;
    height:50px;
    color:#fff;
    font-weight:bold;
  }
  .video-player-1{
    height:150px;
    width:100%;
    background-color:#fff;
  }
  .video-player-2{
    height:150px;
    width:100%;
    background-color:#ccc;
  }
  .video-player-3{
    height:152px;
    width:100%;
    background-color:#fff;
  }
</style>
