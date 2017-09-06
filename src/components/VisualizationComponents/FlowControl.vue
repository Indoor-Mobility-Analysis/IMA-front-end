<template>
  <div class="flow-control">
  </div>
</template>

<script>
  import FlowControl from '../../lib/FlowControl'

  export default {
    name: 'flowcontrol',
    props:['controlMaps', 'mapId', 'legendData', 'controlFrame'],
    data(){
      return {
        title: 'flowcontrol',

      }
    },
    components:{

    },
    beforeDestroy(){
      console.log('beforeDestroy');
    },
    destroyed(){
      console.log('destroy');
    },
    mounted(){
      let _this = this;

      let frameData = this.controlFrame;
      if(!frameData || !frameData[0]){
        console.log('no input');
        return
      }

      this.flowControl = new FlowControl(this.$el);
      this.flowControl.setMap(this.controlMaps, this.mapId);
      this.flowControl.setLegend(this.legendData['legendConfig']);
      this.flowControl.updateHeatmapCanvas(frameData);



      let layerFrame = frameData[0];

      let simulatedConfig = this.processFrameData(layerFrame);
      let frameNumber = 0;
      this.flowControl.updateMap(frameData, simulatedConfig, frameNumber);

      setInterval(()=>{
        frameNumber ++;
        this.simulateNextFrame(layerFrame, simulatedConfig);
        this.flowControl.updateMap(frameData, simulatedConfig, frameNumber);
        this.flowControl.updateControl(frameData, simulatedConfig, frameNumber);
        console.log('frameNumber',frameNumber);
      }, 500);
    },
    watch:{

    },
    methods:{
      processFrameData(layerFrame){
        let magnitude2CntSC = [];
        let gate2Clusters = {};
        let maxCp = [-1, null];
        let smallClusters = layerFrame['small_clusters'];
        let gates = [];
        smallClusters.forEach(function(cluster, index){
//            这个地方可能会到值前端的cluster个数与数据库中的cluster个数不同
          if(cluster.length < 6 || !cluster[6]) {
            console.log('Data error');
            return
          }
          let magnitude = cluster[4];
          let stepNumber = cluster[6].length;
          magnitude2CntSC.push([magnitude, stepNumber]);
          maxCp = maxCp[1] < stepNumber? [magnitude, stepNumber]: maxCp;

          let gate = cluster[5];

          if(gate2Clusters[gate] == undefined){
            gate2Clusters[gate] = {};
            gates.push(gate);
          }
          gate2Clusters[gate][index] = cluster;
        });
        let estTime = maxCp[1];

        //The decease unit of one cluster per second
        let magDecUnit = estTime == 0? 5: (maxCp[0] - 0) / estTime;

        let simulatedConfig = {
          'estTime': maxCp[1],
          'magDecUnit': magDecUnit,
          'peopleCnt': layerFrame['ppl_cnt'],
          'cNumber': smallClusters.length,
          'gate2Clusters': gate2Clusters,
          'gateIds': gates
        };

        return simulatedConfig
      },
      simulateNextFrame(layerFrame, simulatedConfig){
        let smallClusters = layerFrame["small_clusters"];
        let magDecUnit = simulatedConfig['magDecUnit'];
//        people count
        let count = 0;
        let clusterNumber = 0;
        simulatedConfig['gates'] = {};
        smallClusters.forEach(function(cluster){
          if(cluster.length < 5){
            console.log('Data error');
            return
          }
          cluster[4] = cluster[4] - magDecUnit;
          cluster[4] = cluster[4] < 0? -1: cluster[4];
          cluster[cluster.length-1] = cluster[cluster.length-1] <=0? 0: cluster[cluster.length-1] - 1;
          count = 0;

        });
        simulatedConfig['estTime'] = simulatedConfig['estTime'] <= 0? 0: simulatedConfig['estTime'] - 1;
        simulatedConfig['peopleCnt'] = count;
        simulatedConfig['cNumber'] = clusterNumber;
      }
    }
  }
</script>

<style scoped>
  .flow-control{
    height: 700px;
  }
  .container{
    height: 100%;
    width: 100%;
    position:absolute;
  }

</style>
