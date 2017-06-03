/**
 * Created by Qiaomu on 4/26/2017.
 */

import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

// Assume the port of the data Server is 5000, for test only
const dataServerUrl = "http://127.0.0.1:5000";
// const dataServerUrl = "/ima";

const $http = Vue.http

var socketService = new Vue({
  data:{

  },
  sockets:{
    // 'my_response': function(msg) {
    //   console.log('my_response', msg);
    // }
  },
  methods:{
    emit(msg){

    }
  }
});

function onSocket(event, func){

}

function test (callback) {
  const url = `${dataServerUrl}/test`
  $http.get(url).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

function readMap (mapId, callback) {
  const url = `${dataServerUrl}/getStationMap`
  $http.post(url, {'StationId': mapId}).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

function rendLegendConfiguration(mapId, callback){
  const url = `${dataServerUrl}/getLegendConfiguration`
  $http.post(url, {'StationId': mapId}).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

function readRecordWithTimeRange(mapId, startTime, timeRange , callback){
  const url = `${dataServerUrl}/getRecordWithTimeRange`
  $http.post(url, {'StationId': mapId, 'starttime':startTime, 'timerange':timeRange}).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

// For new features
function readStationRecord(callback){
  const url = `${dataServerUrl}/getStationRecord`
  $http.get(url).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

// Added by Qing Du (q.du@ust.hk)
function readPeopleCount(day, time, callback){
  const url = `${dataServerUrl}/getPeopleCount`
  $http.post(url, {'day': day, 'time': time}).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

export default{
  readMap,
  test,
  rendLegendConfiguration,
  readRecordWithTimeRange,
  readStationRecord,
  readPeopleCount
}
