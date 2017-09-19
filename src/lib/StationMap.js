/**
 * Created by Qiaomu on 2017/4/18.
 */
import * as d3 from "d3";
import h337 from "heatmap.js";

let StationMap = function(el, drawContainerClass, type){
  this.$el = el;
  this.drawContainerClass = drawContainerClass;
  this.type = type
  this.height = this.$el.clientHeight;
  this.width = this.$el.clientWidth;

  if(this.type == 'control') {
    this.isGateStatusInited = false;
    this.clusterGlyphInited = false;
    this.fleePathInited = false;
  }
};

StationMap.prototype.setMap = function(maps, mapId){
  let mapObj = maps[mapId];

  this.layerId = mapObj['floor'];
  this.stationId = mapObj['stationId'];
  this.map = mapObj['map'];
  this.maps = maps;
  this.transform = {k: 1, x: 0, y:0};

  this.initContainer();
  if(this.type === 'control') {
    this.initControlConfig();
  }
  this.renderMap();
  this.initHeatmapContainer();
};

StationMap.prototype.onEvent = function(event, func){
  if(event == 'flowControl'){
    this.flowControl = func;
  }
}

StationMap.prototype.getStationId = function(){
  return this.stationId;
};

// getScale for NavigationHeatmap
StationMap.prototype.getScale = function(){
  return {
    'xScale': this.xScale,
    'yScale': this.yScale,
    'offsetX': this.offsetX,
    'offsetY': this.offsetY
  }
}
StationMap.prototype.addControlButton = function(){
  let _this = this;
  let c_b_container = this.svg.append('g').attr('transform', 'translate(10,10)');
  let text = c_b_container.append('text')
    .attr('x', 10)
    .attr('y', 15)
    .attr('font-size', 10)
    .text('Evacuation Simulation');

  var bbox = text.node().getBBox();

  var rect = c_b_container.append("rect")
    .attr("x", bbox.x - 5).attr("y", bbox.y - 5)
    .attr("width", bbox.width + 10).attr("height", bbox.height + 10)
    .attr('rx',3).attr('rx',3)
    .style("fill", "#c4c4c4")
    .style("fill-opacity", ".1")
    .style("stroke", "#c4c4c4")
    .style("stroke-width", "1.5px");
  rect.on('mouseover', function(){
    d3.select(this).style('fill-opacity', 0.36);
  }).on('mouseout', function(){
    d3.select(this).style('fill-opacity', 0.1);
  })
  rect.on('click', function(d){
    _this.flowControl()
  })
};
StationMap.prototype.initContainer = function(){

  d3.select(this.$el).selectAll('.'+this.drawContainerClass).remove();

  this.divContainer = d3.select(this.$el)
    .append('div')
    .attr('class', this.drawContainerClass)
    .style('border-style', 'dashed')
    .style('border-color','#777')
    .style('border-width', '0.1px')
    .style('border-opacity', 0.3)
    .attr('height', this.height)
    .attr('width', this.width);

  // to make the svg and canvas have same height and width, we use this.height, and this.width.
  this.svg = this.divContainer
    .append('svg')
    .attr('class', 'navmapcontainer')
    .attr('height', (this.type == 'origin')?this.height:this.height+6)
    .attr('width', this.width)

  if(this.type == 'origin' && this.layerId == 0)
    this.addControlButton();

  this.rootContainer = this.svg.append('g').attr('class', 'rootContainer');
  if(this.type == 'control') {
    this.mapComponent = this.rootContainer
    this.mapWidth = this.width * 0.5;
    this.controlComponent = this.svg.append('g').attr('transform', 'translate(' + this.mapWidth + ',0)')
    this.controlWidth = this.width * 0.5;
  }

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

StationMap.prototype.renderMap = function(){
  let _this = this;
  this.widthPerSvg = this.width * (this.type == 'control'?0.5:1)
  this.heightPerSvg = this.height

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

  if (this.type == 'origin') {
    // Add interactions
    this.svg.call(d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", zoomed))

    function zoomed() {
      _this.clearHeatmapCanvas();
      _this.rootContainer.attr("transform", d3.event.transform);
      _this.transform = d3.event.transform;
      // console.log('d3.event.transform: ', d3.event.transform);
    }
  }

  let meshes = this.map;
  this.layerContainer.selectAll('.mapele').data(meshes).enter()
    .append('path').attr('class', 'mapele')
    .attr('d', elePath)
    .attr('fill', 'steelblue')
    .attr('fill-opacity', (this.type == 'origin')?0.2:0.1)
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

StationMap.prototype.setLegend = function(legendConfig){
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
StationMap.prototype.initHeatmapContainer = function(){
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


StationMap.prototype.updateHeatmapCanvas = function(frameData) {
  let record = frameData[this.layerId];
  let points = [];

  // let max = 0
  for (let pointIdx in record['small_clusters']) {
    let temp = {
      x: Math.round((this.xScale(record['small_clusters'][pointIdx][0])+this.offsetX)*this.transform.k+this.transform.x),
      y: Math.round(this.yScale(record['small_clusters'][pointIdx][1])*this.transform.k+this.transform.y),
      value: record['small_clusters'][pointIdx][7],
      radius: 15*this.transform.k
    };
    points.push(temp)
  }

  // heatmap data format
  let data = {
    max: 6,
    blur: 1,
    maxOpacity: 0.5,
    data: points
  };
  // if you have a set of data points always use setData instead of addData
  // for data initialization
  this.heatmapInstance.setData(data)
};

StationMap.prototype.clearHeatmapCanvas = function() {
  this.heatmapInstance.setData({ max: 0, data: [] })
};

// bubblemap Part
StationMap.prototype.updateBubblemap = function(frameData){
  let _this = this;
  // need to parser renderData
  let bubblesData = frameData[_this.layerId]['big_clusters'];
  let bubbles = _this.bubbleContainer.selectAll('circle').data(bubblesData, function(d) {return d[0]+'_'+d[1];})

  bubbles
    .transition()
    .attr('r', function(d){
      return d[4]*30<10 ? 10: d[4]*30})
    .text(function(d) {
      return 'density: '+d[4];
    })
    .attr('opacity', 0.3)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .attr('fill', function(d) {
      return 'blue';
    })

  bubbles
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('cx', function(d) {
      return _this.xScale(d[0]);
    })
    .attr('cy', function(d) {
      return _this.yScale(d[1]);
    })
    .attr('r', function(d) {
      return d[4]*30<10 ? 10: d[4]*30;})
    .attr('fill', function(d) {
      return 'blue';
    })
    .attr('opacity', 0.3)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .append('title')
    .attr('class', 'circleTitle')
    .text(function(d) {
      return 'density: '+d[4];
    })

  bubbles
    .exit()
    .transition()
    .attr('fill', 'blue')
    .attr('r', 0)
    .remove();
};

StationMap.prototype.updateArrowmap = function(frameData){
  let _this = this;
  let arrowData = frameData[_this.layerId]['small_clusters'];
  // console.log('bubblesData: ', bubblesData);
  _this.arrowContainer.selectAll('*').remove();
  let arrows = _this.arrowContainer
    .selectAll('.arrows')
    .data(arrowData)
    .enter()
    .append('g')
    .attr('class', 'arrows')
    .each(function(d) {
      // let size = d[4]*10 > 5 ? d[4]*10:5
      let size = 7;
      let opacity = d[4]<0.1? 0.1: d[4]
      let tmpG = d3.select(this).attr('transform', 'translate(' + (_this.xScale(d[0])-size/2) + ', ' + (_this.yScale(d[1])-size/2)+ ')');
      let arrow = appendArrow(tmpG, size, d[3]/Math.PI*180)
      arrow.attr('fill', 'red').attr('stroke-width', 0).attr('opacity', opacity)
    })

  function drawPolyline(g, points){
    let line =d3.line()
      .x(d=>d[0])
      .y(d=>d[1])
    return g.append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'grey')
      .attr('stroke-width', 2)
  }

  function appendArrow(g, size, angle){
    let r = size / 2;
    let pointAngle = 15;
    let centralAngle = 180 - pointAngle * 2;

    let x0 = r + r * Math.cos(centralAngle * Math.PI / 180);
    let y0 = r - r * Math.sin(centralAngle * Math.PI / 180);

    let x1 = r * 2;
    let y1 = r;

    let x2 = x0;
    let y2 = r + r * Math.sin(centralAngle * Math.PI / 180);

    let x3 = (x0 + r) / 2;
    let y3 = r;

    g = g.append('g');
    g.attr('transform', 'rotate(' + (360 - angle) + ' ' + size / 2 + ' ' + size / 2 + ')')

    return drawPolyline(g, [[x0, y0],[x1, y1],[x2, y2],[x3, y3], [x0, y0]]);
  }
};


////////////////////////////////////////////////////////
//////////////  below are all for control
////////////////////////////////////////////////////////
StationMap.prototype.updateMap = function(frameData, simulatedConfig, frameNumber){
  this.updateHeatmapCanvas(frameData);
  this.updatePath(frameData, simulatedConfig, frameNumber);
  this.updateClusterPosition(frameData, simulatedConfig, frameNumber);

};

StationMap.prototype.updateControl = function(frameData, simulatedConfig, frameNumber){
  this.updateStatus(frameData, simulatedConfig, frameNumber);
  this.updateGateStatus(frameData,simulatedConfig);
};

StationMap.prototype.initControlConfig = function(){
  this.statusContainer = this.controlComponent.append('g').attr('class', 'all_status').attr('transform', 'translate(0,'+ ( 2) + ')');
  let stautsHeight = this.height * 0.2;
  this.statusContainer.append('rect').attr('width', this.controlWidth).attr('height', stautsHeight)
    .attr('fill', 'red').attr('fill-opacity', 0.0)
    .attr('stroke-dasharray', '5,2');
  this.initStatus();
  this.statusOffsetY;
  this.gateContainer = this.controlComponent.append('g').attr('class','gate_status').attr('transform', 'translate(0,'+ (this.statusOffsetY + 20) + ')');
  let gateStatusHeight = this.height - this.statusOffsetY;
};

StationMap.prototype.initStatus = function(){
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
  this.time = timeContainer.append('text').text('').attr('x', numberBox.width + statusOffsetX + 10);
  this.statusOffsetY = statusOffsetY;
};

StationMap.prototype.updateStatus = function(frameData, simulatedConfig, frameNumber){

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

StationMap.prototype.updateGateStatus = function(frameData, simulatedConfig){
  this.initGateStatus(frameData, simulatedConfig);

  this.gateBarsForExisted
    .transition(1000)

    .attr('width', (gateId)=>{
      let currentCount = simulatedConfig['gate2Status'][gateId]['currentCount'];
      let w = this.gateXScale(currentCount);
      return w
    }).duration();
};


StationMap.prototype.initGateStatus = function(frameData, simulatedConfig){
  if(this.isGateStatusInited){
    return;
  }
  this.gateBarConfig = {};
  this.isGateStatusInited = true;
  let gateIds = simulatedConfig['gateIds'];
  let gate2Clusters = simulatedConfig['gate2Clusters'];
  let gateStatus = simulatedConfig['gate2Status'];
  let statusOffsetX = 15;
  let gap = 30;
  let statusOffsetY = 20;
  let offsetY = 30;
  let rowHeight = 45;


  let title = this.gateContainer.append('text').text('Gate Status:').attr('x', 5).attr('font-size', 22)
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
    let _label = label.replace('_', ' ');
    _label = _label.charAt(0).toUpperCase() + _label.slice(1)
    let text = _container.append('text').text(_label);
    let textBox = text.node().getBBox();
    barOffsetX = barOffsetX < (statusOffsetX + textBox.width)? (statusOffsetX + textBox.width): barOffsetX;
    barHeight = barHeight < textBox.height? textBox.height: barHeight;
    text.attr('y', textBox.height);
  });
  this.gateBarConfig.barOffsetX = barOffsetX;


  let largestGateCount = 0;
  for(let i = 0, ilen = gateIds.length; i < ilen; i++){
    let gateId = gateIds[i];
    let singleGateCount = gateStatus[gateId]['currentCount'];

    largestGateCount = largestGateCount < singleGateCount? singleGateCount: largestGateCount;
  }
  this.gateBarConfig.largestGateCount = largestGateCount;

  this.gateXScale = d3.scaleLinear().domain([0, largestGateCount]).range([0, this.width / 2 - this.gateBarConfig.barOffsetX* 2]);
  this.gateBarsForAll = this.gateStatusContainers.append('rect').attr('x', barOffsetX)
    .attr('fill','#B0E0E6')
    .attr('stroke', '#4790de').attr('stroke-width', 2)
    .attr('height', barHeight + 5)
    .attr('width', (gateId)=> {
      let allCount = simulatedConfig['gate2Status'][gateId]['allCount'];
      let w = this.gateXScale(allCount);
      return w;
    })
  this.gateBarsForExisted = this.gateStatusContainers.append('rect').attr('x', barOffsetX).attr('fill', '#f4979c').attr('height', barHeight + 5)
    .attr('stroke-width',2).attr('stroke-opacity',0.0)
};
StationMap.prototype.updatePath = function(frameData, simulatedConfig, frameNumber){
  if(this.fleePathInited == false) {
    this.initPath(frameData, simulatedConfig)
    return
  }
  this.fleePaths.each(function(cluster){
    let pathData = cluster[6];
    if(!pathData) return;
    let _path = d3.select(this).select('path');

    if(frameNumber == (cluster[6].length)){
      _path.transition(500).attr('stroke','orange').attr('opacity', 1).attr('stroke-width', 3).on('end', function(d){
        d3.select(this).transition(500).attr('stroke-width', 0).duration();
      })

      return
    }
  })
};
StationMap.prototype.initPath = function(frameData, simulatedConfig){
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
      .attr("stroke", "#15bd5c")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.4)
      .attr("d", line);

  })
  this.fleePathInited = true;
};

StationMap.prototype.updateClusterPosition = function(frameData, simulatedConfig, frameNumber){
  let _this = this;
  if (this.clusterGlyphInited == false){
    this.initClusterGlyph(frameData, frameNumber);
    this.clusterGlyphInited = true;
    return;
  }

  this.clusterStartPoints.each(function(d, index){
    if(!d[6]) return;


    let circle = d3.select(this);
    if(frameNumber == (d[6].length)){
      circle.transition(1000).attr('r', 10).on('end', function(d){
        d3.select(this).transition(500).attr('r', 0).duration();

      })
      let evacuation_text  = _this.svg.append('text')
      let gate = d[5];
      gate.replace('_', ' ');
      gate = gate.charAt(0).toUpperCase() + gate.slice(1)
      evacuation_text.text("Cluster " +  index + "  evacuated from " + gate).attr('x', ()=>{
        let _x = _this.xScale(d[6][d[6].length - 1][0]);
        return _x;
      })
        .attr('y', ()=>{
          let _y = _this.yScale(d[6][d[6].length - 1][1]);
          return _y
        })
        .attr('fill', '#f03b20')

      evacuation_text.transition(3000)
        .attr('x', ()=>{
          let _x = _this.xScale(d[6][d[6].length - 1][0]);
          return _x + 0;
        })
        .attr('y', ()=>{
          let _y = _this.yScale(d[6][d[6].length - 1][1]);
          return _y - 20;
        })
        .attr('fill', 'orange')
        .style('opacity', 0)
        .duration()
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
StationMap.prototype.initClusterGlyph = function(frameData, frameNumber){
  // console.log('initCLusterGlyph')
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
    // console.log('initCLusterGlyph2')
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




export default StationMap
