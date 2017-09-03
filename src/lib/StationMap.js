/**
 * Created by Qiaomu on 2017/4/18.
 */
import * as d3 from "d3";
import h337 from "heatmap.js";

let StationMap = function(el, maps){
  this.$el = el;

  // this.height = el.clientHeight;
  // this.width = el.clientWidth;

  // add a div 'layer-station-map' for embedding heatmap canvas
  this.height = d3.select('.layer-station-map').node().getBoundingClientRect().height - 30;
  this.width = d3.select('.layer-station-map').node().getBoundingClientRect().width ;

  this.margin = {top: 5, left: 5, right:5 ,bottom: 5};

  this.maps = maps;
  this.widthPerSvg = (this.width - this.margin.left - this.margin.right)
  this.heightPerSvg = this.height - this.margin.top - this.margin.bottom;

  this.mapAttr = {};
  this.xScale = undefined;
  this.yScale = undefined;
  this.reXScale = undefined;
  this.reYScale = undefined;

  this.offsetX = undefined;
  this.offsetY = 0;
};

StationMap.prototype.setMap = function(mapObj){
  console.log('layer_id', mapObj['floor']);
  this.layerId = mapObj['floor'];
  this.stationId = mapObj['stationId'];
  this.map = mapObj['map'];
  this.transform = {k: 1, x: 0, y:0};
  this.initContainer();
  this.renderMap();
  this.initHeatmapContainer();
};
StationMap.prototype.onEvent = function(event, func){
  if(event == 'flowcontrol'){
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
    .text('Flow Control');

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

  d3.select(this.$el).selectAll('.layer-station-map').remove();
  this.divContainer = d3.select(this.$el)
    .append('div')
    .attr('class', 'layer-station-map')
    .style('border-style', 'dashed')
    .style('border-color','#777')
    .style('border-width', '0.1px')
    .style('border-opacity', 0.3)

  // console.log('this.$el: ', this.$el);
  // console.log('this.divContainer : ', this.divContainer.node());


  // to make the svg and canvas have same height and width, we use this.height, and this.width.
  this.svg = this.divContainer
    .append('svg')
    .attr('class', 'navmapcontainer')
    .attr('height', this.height)
    .attr('width', this.width)

  if(this.layerId == 0)
    this.addControlButton();

  this.rootContainer = this.svg.append('g').attr('class', 'rootContainer');

  var largestX = 0;
  var largestY = 0;

  var smallestX = 10000;
  var smallestY = 10000;

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
  console.log('test', this.mapAttr);
};

StationMap.prototype.renderMap = function(){
  let _this = this;

  // console.log('this.mapAttr', this.mapAttr);

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


  // let brushended = function(){
  //   let layer = _this.layerId;
  //   var s = d3.event.selection;
  //   if(!s) return;

  //   let xRange = [_this.xScale.invert(s[0][0]), _this.xScale.invert(s[1][0])];
  //   let yRange = [_this.yScale.invert(s[0][1]), _this.yScale.invert(s[1][1])];
  //   let selectionWidth = Math.abs(s[1][0] - s[0][0]);
  //   let selectionHeight = Math.abs(s[0][1] - s[1][1]);

  //   if(_this.brushEndCallback){
  //     // _this.brushEndCallback(xRange, yRange, selectionWidth, selectionHeight, layerObj, map, _this.legendConfig['legendConfig'][layer]);
  //     _this.brushEndCallback(xRange, yRange, selectionWidth, selectionHeight,_this.map, _this.layerId,_this.legendConfig[_this.layerId]);
  //   }

  // }
  // let brush = d3.brush()
  //   .extent([[0,0], [_tempWidth, _tempHeight]])
  //   .on('start', function(){
  //     if(_this.brushStartCallBack){
  //       _this.brushStartCallBack(_this.layerId);
  //     }
  //   })
  //   .on("end", brushended);

  // this.brush = brush;

  this.layerContainer = this.rootContainer.append('g').attr('class','mapContainer').attr('transform', 'translate(' + this.offsetX + ',0)');

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

  // var drag = d3.behavior.drag()
  //   .origin(function(d) { return d; })
  //   .on("dragstart", dragstarted)
  //   .on("drag", dragged)
  //   .on("dragend", dragended);


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

// StationMap.prototype.on = function(event, callback){
//   if(event == 'brushend'){
//     this.brushEndCallback = callback;
//   }else if(event == 'brushstart'){
//     this.brushStartCallBack = callback;
//   }
// };
// StationMap.prototype.clearBrush = function(){
//   this.layerContainer.call(this.brush.move, null);
// }

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
      value: record['small_clusters'][pointIdx][4],
      radius: 15*this.transform.k
    }
    // if (temp.x < this.margin.left || temp.x > this.width + this.margin.left) continue
    // if (temp.y < this.margin.top || temp.y > this.height + this.margin.top) continue
    points.push(temp)
  }

  // let nuConfig = {
  //   radius: 30*this.transform.k,
  //   maxOpacity: 0.5,
  //   minOpacity: 0,
  //   blur: 0.75
  // };

  // this.heatmapInstance.configure(nuConfig)

  // heatmap data format
  let data = {
    max: 1.5,
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
  // console.log('layerId: ', _this.layerId);
  // console.log('updateBubblemap: ', frameData);
  let bubblesData = frameData[_this.layerId]['big_clusters'];
  // console.log('bubblesData: ', bubblesData);
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
      let size = 7
      let opacity = d[4]<0.1? 0.1: d[4]
      let tmpG = d3.select(this).attr('transform', 'translate(' + (_this.xScale(d[0])-size/2) + ', ' + (_this.yScale(d[1])-size/2)+ ')');
      let arrow = appendArrow(tmpG, size, d[3]/Math.PI*180)
      arrow.attr('fill', 'red').attr('stroke-width', 0).attr('opacity', opacity)
    })

  // let arrows = _this.arrowContainer.selectAll('.arrow').data(arrowData, function(d) {return d[0]+'_'+d[1];})
  // arrows
  //   .transition()

  // arrows
  //   .enter()
  //   .append('g')
  //   .attr()
  //   .attr('class', 'arrow')
  //   .each(function(d) {
  //     console.log('arrows: ', d)
  //   })


  // arrows
  //   .exit()
  //   .transition()
  //   .attr('fill', 'blue')
  //   .attr('r', 0)
  //   .remove();

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

    return drawPolyline(g, [[x0, y0],[x1, y1],[x2, y2],[x3, y3], [x0, y0]])
  }
};




export default StationMap
