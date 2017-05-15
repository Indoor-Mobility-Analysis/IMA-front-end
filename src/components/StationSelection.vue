<template>
  <div class="station-selection-container">
    <div class = "wrap">
      <div class ="navi-logo">
         <icon class = "logo" name="list" scale = "2" color="#fff"></icon>
      </div>
    <div class = "navi-selection">
      <p>Station Selection</p>
    </div>
    </div>

    <div class = "station-wapper">
      <ul class = "ul-station">
        <li class = "show">
          <div class = "station-logo"><icon name = "subway" scale="1" color ="#fff"></icon></div>
          <div class = "station-text">{{station}}</div>
        </li>
      </ul>
      <ul class = "ul-g" id = "ul-g-id" v-on:click="changeg()">
        <li class ="G">
          <div class = "g-logo"><icon name="circle-o" scale = "1" color="#fff"></icon></div>
          <div class = "g-text">Floor G</div>
        </li>
      </ul>
      <ul class = "ul-lg1" id="ul-lg1-id" v-on:click="changelg1()">
        <li class ="LG1">
          <div class="lg1-logo"><icon name="circle-o" scale = "1" color="#fff"></icon></div>
          <div class="lg1-text">Floor LG1</div>
        </li>
      </ul>
      <ul class = "ul-lg2" id = "ul-lg2-id" v-on:click="changelg2()">
        <li class ="LG2">
          <div class="lg2-logo"><icon name="circle-o" scale = "1" color="#fff"></icon></div>
          <div class="lg2-text">Floor LG2</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import bus from "../assets/eventBus";
  import pipeService from "../service/pipeService"
  export default {
    name: 'StationSelection',
    data(){
      return {
        title: 'Station Selection Component',
        station: 'Admiralty',
        src_1:"/static/video/motion.mp4"
      }
    },
    methods:{
        changelg1:function(){
             var self = this;
             document.getElementById("ul-lg1-id").style.background = "#ADD8E";
             document.getElementById("ul-g-id").style.background = "#B0E0E6";
             document.getElementById("ul-lg2-id").style.background = "#B0E0E6";
             bus.$emit("event1");
        },
        changeg:function(){
             document.getElementById("ul-g-id").style.background = "#ADD8E6";
             document.getElementById("ul-lg1-id").style.background = "#B0E0E6";
             document.getElementById("ul-lg2-id").style.background = "#B0E0E6";
             bus.$emit("event2");
        },
        changelg2:function(){
             document.getElementById("ul-lg2-id").style.background = "#ADD8E6";
             document.getElementById("ul-lg1-id").style.background = "#B0E0E6";
             document.getElementById("ul-g-id").style.background = "#B0E0E6";
             bus.$emit("event3");
        }
    }
  }
</script>

<style>
  .station-selection-container{
    background-color:#B0E0E6;
    /*height: 100%*/
  }
  .station-logo{
    padding-top:8px;
    padding-right:20px;
  }
  .station-text{
    padding-top:8px;
    padding-left:20px;
    font-weight:bold;
  }
  .lg2-logo{
    padding-top:8px;
    padding-right:20px;
  }
  .lg2-text{
    padding-top:8px;
    padding-left:20px;
    font-weight:bold;
  }
  .lg1-logo{
    padding-right:20px;
    padding-top:8px;
  }
  .lg1-text{
    padding-top:8px;
    padding-left:20px;
    font-weight:bold;
  }
  .g-logo{
    padding-right:20px;
    padding-top:8px;
  }
  .g-text{
    padding-top:8px;
    padding-left:20px;
    font-weight:bold;
  }
  .station-text{
    padding-left:10px;
    padding-top:5px;
  }
  .station-wapper{
    border-top:thin solid #aaa;
  }
  .wrap{
    display:-webkit-box;
    background-color:#B0E0E6;
    height:40px;
  }
  .logo{
    padding-top:10px;
    padding-left:10px;
  }
  .navi-selection{
    padding:10px;
    height:40px;
    color:#fff;
    font-weight:bold;
  }
  .navi-logo{
    height:40px;
  }
  .ul-station{
    margin-top:20px;
  }
  .ul-g{
    border-top:thin solid #aaa;
    border-bottom:thin solid #aaa;
    background-color:#ADD8E6;
  }
  .ul-g:hover{
    background-color:#DCDCDC;
  }
  .ul-lg1:hover{
    background-color:#DCDCDC;
  }
  .ul-lg2:hover{
    background-color:#DCDCDC;
  }
  .ul-lg1{
    border-bottom:thin solid #aaa;
    margin-top:-16px;
    background-color:#B0E0E6;
  }
  .ul-lg2{
    border-bottom:thin solid #aaa;
    margin-top:-16px;
  }
  .show{
    list-style-type:none;
    color:#fff;
    font-size:18px;
    display:-webkit-box;
    height:40px;
  }
  .G{
    list-style-type:none;
    color:#fff;
    font-size:18px;
    display:-webkit-box;
    height:40px;
  }
  .LG1{
     list-style-type:none;
     color:#fff;
     display:-webkit-box;
     height:40px;
     font-size:18px;
  }
  .LG2{
    list-style-type:none;
    color:#fff;
    display:-webkit-box;
    height:40px;
    font-size:18px;
  }
</style>
