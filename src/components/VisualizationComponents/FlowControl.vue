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
      this.flowControl.updatePath(frameData, simulatedConfig);
//      console.log('framedata', simulatedConfig);
      setInterval(()=>{
        this.simulateNextFrame(layerFrame, simulatedConfig);
        this.flowControl.updateHeatmapCanvas(frameData);
        this.flowControl.updateControl(frameData, simulatedConfig);
        this.flowControl.updatePath(frameData, simulatedConfig);
      }, 1000);
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
          if(cluster.length < 5) {
            console.log('Data error');
            return
          }
          let magnitude = cluster[4];
          let cnt = cluster[cluster.length - 1];
          magnitude2CntSC.push([magnitude, cnt]);
          maxCp = maxCp[0] < magnitude? [magnitude, cnt]: maxCp;
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
          count+= cluster[cluster.length-1];
          if(cluster[4]>0){clusterNumber += 1}
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
