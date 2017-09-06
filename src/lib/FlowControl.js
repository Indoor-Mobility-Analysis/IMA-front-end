/**
 * Created by qshen on 2/9/2017.
 */
import * as d3 from "d3";
import h337 from "heatmap.js";

let FlowControl = function(el, maps){
  this.$el = el;
  // this.svg = d3.select(this.$el).select('svg');
  this.height = this.$el.clientHeight;
  this.width = this.$el.clientWidth;
  this.isGateStatusInited = false;
  this.clusterGlyphInited = false;
  this.fleePathInited = false;
};

FlowControl.prototype.setMap = function(maps, mapId){
  let mapObj = maps[mapId];

  this.layerId = mapObj['floor'];
  this.stationId = mapObj['stationId'];
  this.map = mapObj['map'];
  this.maps = maps;
  this.transform = {k: 1, x: 0, y:0};

  this.initContainer();
  this.initControlConfig();
  this.renderMap();
  this.initHeatmapContainer();
};

FlowControl.prototype.initContainer = function(){

  d3.select(this.$el).selectAll('.layer-station-map_control').remove();

  this.divContainer = d3.select(this.$el)
    .append('div')
    .attr('class', 'layer-station-map_control')
    .style('border-style', 'dashed')
    .style('border-color','#777')
    .style('border-width', '0.1px')
    .style('border-opacity', 0.3)
    .style('height', this.height)
    .style('width', this.width);

  // to make the svg and canvas have same height and width, we use this.height, and this.width.
  this.svg = this.divContainer
    .append('svg')
    .attr('class', 'navmapcontainer')
    .attr('height', this.height+6)
    .attr('width', this.width)

  this.mapComponent = this.svg.append('g');
  this.mapWidth = this.width * 0.5;
  this.controlComponent = this.svg.append('g').attr('transform', 'translate(' + this.mapWidth + ',0)')
  this.controlWidth = this.width * 0.5;


  // this.svg.append('rect').attr('width', this.width).attr('height', this.height)
  //   .attr('fill', 'red').attr('fill-opacity', 0.1)

  // this.mapComponent.append('rect').attr('width', this.mapWidth).attr('height', this.height)
  //   .attr('fill', 'red').attr('fill-opacity', 0.1);
  //
  // this.controlComponent.append('rect').attr('width', this.controlWidth).attr('height', this.height)
  //   .attr('fill', 'blue').attr('fill-opacity', 0.1);

  this.rootContainer = this.mapComponent;

  var largestX = 0;
  var largestY = 0;

  var smallestX = 10000;
  var smallestY = 10000;
  this.mapAttr = {};
  this.maps.forEach(function(meshes){
    let meshElements = meshes['map'];

    meshElements.forEach(function(eles){
      eles.forEach(function(ele){
        largestX = largestX>ele[0]?largestX:ele[0];
        smallestX = smallestX<ele[0]?smallestX:ele[0];
        largestY = largestY>ele[1]?largestY:ele[1];
        smallestY = smallestY<ele[1]?smallestY:ele[1];
      })
    })
  });

  this.mapAttr['largestX'] = largestX;
  this.mapAttr['smallestX'] = smallestX;
  this.mapAttr['largestY'] = largestY;
  this.mapAttr['smallestY'] = smallestY;

};

FlowControl.prototype.renderMap = function(){
  let _this = this;
  this.widthPerSvg = this.mapWidth;
  this.heightPerSvg = this.height;


  var largestX = this.mapAttr['largestX'];
  var smallestX = this.mapAttr['smallestX'];
  var largestY = this.mapAttr['largestY'];
  var smallestY = this.mapAttr['smallestY'];

  let yxRatioInData = (largestY - smallestY) / (largestX - smallestX);


  let yxRatioForSvg = this.heightPerSvg / this.widthPerSvg;
  let _tempWidth = this.widthPerSvg;
  let _tempHeight = this.heightPerSvg;

  if(yxRatioInData > yxRatioForSvg){
    _tempWidth = _tempHeight / yxRatioInData;
  }else{
    _tempHeight = _tempWidth * yxRatioInData;
  }

  this.xScale = d3.scaleLinear().domain([smallestX, largestX]).range([5, _tempWidth - 5]);
  this.yScale = d3.scaleLinear().domain([smallestY, largestY]).range([_tempHeight - 5, 5]);

  this.reXScale = this.xScale.invert;
  let offsetX = (this.widthPerSvg - _tempWidth) / 2;
  this.offsetX = offsetX;

  let elePath = d3.line()
    .x(function(d) { return _this.xScale(d[0]); })
    .y(function(d) { return _this.yScale(d[1]); });

  this.layerContainer = this.rootContainer.append('g').attr('class','mapContainer').attr('transform', 'translate(' + this.offsetX + ',0)');

  let meshes = this.map;
  this.layerContainer.selectAll('.mapele').data(meshes).enter()
    .append('path').attr('class', 'mapele')
    .attr('d', elePath)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 0.3)
    .attr('stroke-opacity', 0.4)


  this.legendContainer = this.rootContainer.append('g').attr('class', 'legendContainer').attr('transform', 'translate(' + this.offsetX + ',0)');
  // bubble container
  this.bubbleContainer = this.rootContainer.append('g').attr('class', 'bubblesContainer').attr('transform', 'translate(' + this.offsetX + ',0)');
  // this.layerContainer.call(brush);
  // arrow container
  this.arrowContainer = this.rootContainer.append('g').attr('class', 'arrowContainer').attr('transform', 'translate(' + this.offsetX + ',0)');
};

FlowControl.prototype.setLegend = function(legendConfig){
  let _this = this;
  this.legendConfig = legendConfig;
  let legendArray = legendConfig[this.layerId];

  if(legendArray == undefined) return
  let lcs = this.legendContainer.selectAll('.legend').data(legendArray).enter().append('g')
    .attr('transform', function(d, i){
      let x = _this.xScale(d['pos'][0]);
      let y = _this.yScale(d['pos'][1]);
      return 'translate(' + x + ',' + y + ')'
    });
  let lcsContainer = lcs.append('g');
  lcsContainer.each(function(d, i){
    let _container = d3.select(this);
    if(d['type'] != "Ticket Exit" && d['type'] != "Ticket Entry" && d['type'] != "Barrier"){
      _container.append('svg:image')
        .attr('x',-3)
        .attr('y',-3)
        .attr('width',6)
        .attr('height', 6)
        .attr("xlink:href",function(d){
          return 'static/legend/' + d['model']
        })
        .on('mouseover', function(d){
          console.log('over', d['pos'][0],d['pos'][1]);
        })
    }else{
      _container.append('rect')
        .attr('x',-3)
        .attr('y',-3)
        .attr('width',3)
        .attr('height', 6)
        .attr("fill",function(d){
          return d.type == 'Ticket Exit'? 'blue': d.type == "Ticket Entry" ? 'red' : "grey"
        })
        .on('mouseover', function(d){
          console.log('over', d['pos'][0],d['pos'][1]);
        })
    }
  })
};

// Canvas Heatmap Part
FlowControl.prototype.initHeatmapContainer = function(){
  if (this.canvasHeatmap != null) {
    this.canvasHeatmap.remove();
  }
  let config = {
    // container: document.getElementById('#' + this.heatmapId),
    container: this.divContainer.node(), // document.querySelector('#' + this.heatmapId),
    radius: 15,
    maxOpacity: 0.5,
    minOpacity: 0,
    blur: 0.85
  }
  this.heatmapInstance = h337.create(config)
  this.canvasHeatmap = this.$el.querySelector('.heatmap-canvas')
}
FlowControl.prototype.updateMap = function(frameData, simulatedConfig, frameNumber){
  this.updateHeatmapCanvas(frameData);
  this.updatePath(frameData, simulatedConfig, frameNumber);
  this.updateClusterPosition(frameData, simulatedConfig, frameNumber);

};

FlowControl.prototype.updateHeatmapCanvas = function(frameData) {
  let record = frameData[this.layerId];
  let points = [];

  // let max = 0
  for (let pointIdx in record['small_clusters']) {
    let temp = {
      x: Math.round((this.xScale(record['small_clusters'][pointIdx][0])+this.offsetX)*this.transform.k+this.transform.x),
      y: Math.round(this.yScale(record['small_clusters'][pointIdx][1])*this.transform.k+this.transform.y),
      value: record['small_clusters'][pointIdx][4],
      radius: 15*this.transform.k
    };
    points.push(temp);
  }

  // heatmap data format
  let data = {
    max: 1.5,
    data: points
  };
  // if you have a set of data points always use setData instead of addData
  // for data initialization
  this.heatmapInstance.setData(data)
};

FlowControl.prototype.clearHeatmapCanvas = function() {
  this.heatmapInstance.setData({ max: 0, data: [] })
};

FlowControl.prototype.updateControl = function(frameData, simulatedConfig, frameNumber){
  this.updateStatus(frameData, simulatedConfig, frameNumber);
  this.updateGateStatus(frameData,simulatedConfig);
};

FlowControl.prototype.initControlConfig = function(){
  this.statusContainer = this.controlComponent.append('g').attr('class', 'all_status').attr('transform', 'translate(0,'+ ( 2) + ')');
  let stautsHeight = this.height * 0.2;
  this.gateContainer = this.controlComponent.append('g').attr('class','gate_status').attr('transform', 'translate(0,'+ (this.height * 0.2 + 4) + ')');
  let gateStatusHeight = this.height * 0.7;
  this.progressContainer = this.controlComponent.append('g').attr('class', 'progress_status').attr('transform', 'translate(0,'+ (this.height * 0.9 + 6) + ')');
  let progressHeight=  this.height * 0.1;

  this.statusContainer.append('rect').attr('width', this.controlWidth).attr('height', stautsHeight)
    .attr('fill', 'red').attr('fill-opacity', 0.0)
    .attr('stroke-dasharray', '5,2');
  this.gateContainer.append('rect').attr('width', this.controlWidth).attr('height', gateStatusHeight + progressHeight)
    .attr('fill', 'green').attr('fill-opacity', 0.0)
    .attr('stroke', 'orange')
    .attr('stroke-dasharray', '5,2');

  this.initStatus();
};

FlowControl.prototype.initStatus = function(){
  let statusOffsetX = 10;
  let gap = 15;
  let statusOffsetY = 45;
  let statusText = this.statusContainer.append('text').text('Status: ').attr('font-size', 20);
  statusText.attr('y', statusText.node().getBBox().height + 5);

  let numberContainer = this.statusContainer.append('g');
  let numberText = numberContainer.append('text').text("Cluster Number:");
  let numberBox = numberText.node().getBBox();
  statusOffsetY +=  numberBox.height;
  numberContainer.attr('transform','translate(15, ' + statusOffsetY + ')');
  this.number = numberContainer.append('text').text('').attr('x', numberBox.width + statusOffsetX + 10)

  let countContainer = this.statusContainer.append('g');
  let countText = countContainer.append('text').text("Current Count:");

  let countBox = countText.node().getBBox();
  statusOffsetY += (countBox.height + gap);
  countContainer.attr('transform','translate(15, ' + statusOffsetY + ')');
  this.count = countContainer.append('text').text('').attr('x', numberBox.width + statusOffsetX + 10)

  let timeContainer = this.statusContainer.append('g');
  let timeText = timeContainer.append('text').text("Estimate Time:");
  let timeBox = timeText.node().getBBox();
  statusOffsetY += (timeBox.height + gap);
  timeContainer.attr('transform','translate(15, ' + statusOffsetY + ')');
  this.time = timeContainer.append('text').text('').attr('x', numberBox.width + statusOffsetX + 10)
};

FlowControl.prototype.updateStatus = function(frameData, simulatedConfig, frameNumber){

  // people count
  let small_clusters= frameData[this.layerId]['small_clusters'];
  let currentClusterNumber = 0;
  small_clusters.forEach(function(cluster){
    if(cluster[6] && cluster[6].length > frameNumber){
      currentClusterNumber+= 1;
    }
  });


  let count = simulatedConfig['peopleCnt'];
  //cluster number
  let number = simulatedConfig['cNumber'];

  let time = simulatedConfig['estTime'];
  //estimate time
  this.count.text(count);
  this.number.text(currentClusterNumber);
  this.time.text(time);
};

FlowControl.prototype.updateGateStatus = function(frameData, simulatedConfig){
  this.initGateStatus(frameData, simulatedConfig);

  // this.gateBars
  //   .transition(1000)
  //
  //   .attr('width', (gateId)=>{
  //     let currentCount = this.sumClusterCount(simulatedConfig['gate2Clusters'][gateId]);
  //     let w = this.gateXScale(currentCount);
  //     return w
  //   }).duration();
};

FlowControl.prototype.sumClusterCount = function(index2Clusters){
  let singleGateCount = 0;
  for(let index in index2Clusters){
    let cluster = index2Clusters[index];
    singleGateCount += cluster[cluster.length - 1];
  }
  return singleGateCount;
};

FlowControl.prototype.initGateStatus = function(frameData, simulatedConfig){
  if(this.isGateStatusInited){
    return;
  }
  this.gateBarConfig = {};
  this.isGateStatusInited = true;
  let gateIds = simulatedConfig['gateIds'];
  let gate2Clusters = simulatedConfig['gate2Clusters'];
  let statusOffsetX = 15;
  let gap = 30;
  let statusOffsetY = 20;
  let offsetY = 30;
  let rowHeight = 45;

  let title = this.gateContainer.append('text').text('Gate Status:').attr('x', 5).attr('font-size', 20);
  title.attr('y', title.node().getBBox().height + 5);
  this.gateStatusContainers  = this.gateContainer.selectAll('.gateStatusContainer')
    .data(gateIds).enter().append('g').attr('class', 'gateStatusContainer')
    .attr('transform', function(d, i){
      return 'translate(' + statusOffsetX +',' + (statusOffsetY + rowHeight * i + gap) + ')'
    });
  let barOffsetX = 0;
  let barHeight = 0;
  this.gateStatusContainers.each(function(label){
    let _container = d3.select(this);
    let text = _container.append('text').text(label);
    let textBox = text.node().getBBox();
    barOffsetX = barOffsetX < (statusOffsetX + textBox.width)? (statusOffsetX + textBox.width): barOffsetX;
    barHeight = barHeight < textBox.height? textBox.height: barHeight;
    text.attr('y', textBox.height);
  });
  this.gateBarConfig.barOffsetX = barOffsetX;
  this.gateBars = this.gateStatusContainers.append('rect').attr('x', barOffsetX).attr('fill', '#3288bd').attr('height', barHeight + 5)
    .attr('width', 150);
  let largestGateCount = 0;
  for(let i = 0, ilen = gateIds.length; i < ilen; i++){
    let gateId = gateIds[i];
    let index2Clusters = gate2Clusters[gateId];
    let singleGateCount = this.sumClusterCount(index2Clusters);
    largestGateCount = largestGateCount < singleGateCount? singleGateCount: largestGateCount;
  }
  this.gateBarConfig.largestGateCount = largestGateCount;

  // this.gateXScale = d3.scaleLinear().domain([0, largestGateCount]).range([0, this.width / 2 - this.gateBarConfig.barOffsetX* 2]);
};
FlowControl.prototype.updatePath = function(frameData, simulatedConfig, frameNumber){
  if(this.fleePathInited == false) {
    this.initPath(frameData, simulatedConfig)
    return
  }
  this.fleePaths.each(function(cluster){
    let pathData = cluster[6];
    if(!pathData) return;
    let _path = d3.select(this).select('path');

    if(frameNumber == (cluster[6].length)){
      console.log('log', frameNumber, cluster[6].length);
      _path.transition(500).attr('stroke','orange').attr('opacity', 1).attr('stroke-width', 3).on('end', function(d){
        d3.select(this).transition(500).attr('stroke-width', 0).duration();
      })
      return
    }
  })
};
FlowControl.prototype.initPath = function(frameData, simulatedConfig){
  //Originanl name is updatePath
  let line = d3.line().x((d)=>{
    return this.xScale(d[0]);
  }).y((d)=>{
    return this.yScale(d[1]);
  })
  let small_clusters= frameData[this.layerId]['small_clusters'];
  this.mapComponent.selectAll('.pathContainer').remove();
  this.fleeContainer = this.mapComponent.append('g').attr('class', 'pathContainer').attr('transform', 'translate(' + this.offsetX + ',0)');
  this.fleePaths = this.fleeContainer.selectAll('.fleePath').data(small_clusters).enter().append('g')
  this.fleePaths.each(function(cluster){
    d3.select(this).selectAll('path').remove();
    let _container = d3.select(this);
    let pathData = cluster[6]
    // if(cluster[7]<=0) return
    if(!pathData)return

    _container.append('path')
      .datum(cluster[6]).attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.4)
      .attr("d", line);

  })
  this.fleePathInited = true;
};

FlowControl.prototype.updateClusterPosition = function(frameData, simulatedConfig, frameNumber){
  let _this = this;
  if (this.clusterGlyphInited == false){
    this.initClusterGlyph(frameData, frameNumber);
    this.clusterGlyphInited = true;
    return;
  }

  this.clusterStartPoints.each(function(d){
    if(!d[6]) return;


    let circle = d3.select(this);
    if(frameNumber == (d[6].length)){
      circle.transition(500).attr('r', 10).on('end', function(d){
        d3.select(this).transition(500).attr('r', 0).duration();
      })
      return
    }

    if(frameNumber >= d[6].length) {
      return
    }
    circle.transition(500)
      .attr('cx', d=>{
        let _x = _this.xScale(d[6][frameNumber][0]);
        return _x;
      })
      .attr('cy', d=>{
        let _y = _this.yScale(d[6][frameNumber][1]);
        return _y
      })


  })
};
FlowControl.prototype.initClusterGlyph = function(frameData, frameNumber){
  console.log('initCLusterGlyph')
  let small_clusters= frameData[this.layerId]['small_clusters'];
  let _this =this;
  this.clusterGlyphContainer = this.mapComponent.append('g').attr('class','clusterGlyphContainer').attr('transform', 'translate(' + this.offsetX + ',0)');

  this.clusterStartPoints = this.clusterGlyphContainer.selectAll('.startPoint').data(small_clusters).enter().append('circle').attr('class', 'startPoint');
  this.clusterStartPoints.each(function(d){
    if(!d[6] || d[6] == "None") {
      return;
    }
    if(d[7]<=0) {

      return;
    }
    console.log('initCLusterGlyph2')
    let circle = d3.select(this);
    circle.attr('r', 0).transition(500).attr('r', 5).duration()
    circle.attr('fill','orange').attr('fill-opacity', 0.3).attr('stroke','orange')
      .attr('cx', d=>{
        let _x = _this.xScale(d[6][frameNumber][0]);
        return _x;
      })
      .attr('cy', d=>{
        let _y = _this.yScale(d[6][frameNumber][1]);
        return _y
      });
  })
};
export default FlowControl
