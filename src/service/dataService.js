/**
 * Created by Qiaomu on 4/26/2017.
 */

import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

// Assume the port of the data Server is 5000, for test only
const dataServerUrl = "http://127.0.0.1:5000";
const $http = Vue.http

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

export default{
  readMap,
  test,
  rendLegendConfiguration,
  readRecordWithTimeRange
}
