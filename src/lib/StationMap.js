/**
 * Created by Qiaomu on 2017/4/18.
 */


import * as d3 from 'd3'
import h337 from 'heatmap.js'

let StationMap = function(el, maps){
  this.$el = el;

  // this.height = el.clientHeight;
  // this.width = el.clientWidth;

  // add a div 'layer-station-map' for embedding heatmap canvas
  this.height = d3.select('.layer-station-map').node().getBoundingClientRect().height;
  this.width = d3.select('.layer-station-map').node().getBoundingClientRect().width;
  
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


};

StationMap.prototype.setMap = function(mapObj){
  this.layerId = mapObj['floor'];
  this.stationId = mapObj['stationId'];
  this.map = mapObj['map'];
  this.initContainer();
  this.renderMap();
  this.initHeatmapContainer();
}
StationMap.prototype.getStationId = function(){
  return this.stationId;
}

// getScale for NavigationHeatmap
StationMap.prototype.getScale = function(){
  return {
    'xScale': this.xScale,
    'yScale': this.yScale,
    'offsetX': this.offsetX
  }
}

StationMap.prototype.initContainer = function(){
  
  d3.select(this.$el).selectAll('.layer-station-map').remove();
  this.divContainer = d3.select(this.$el)
    .append('div')
    .attr('class', 'layer-station-map')
    .style('border-style', 'dashed')
    .style('border-color','#777')
    .style('border-width', '0.1px')
    .style('border-opacity', 0.3)

  console.log('this.$el: ', this.$el);
  console.log('this.divContainer : ', this.divContainer.node());


  // to make the svg and canvas have same height and width, we use this.height, and this.width.
  this.svg = this.divContainer
    .append('svg')
    .attr('class', 'navmapcontainer')
    .attr('height', this.height)
    .attr('width', this.width)
    // .style('margin-top', this.margin['top'])
    // .style('border-style', 'dashed')
    // .style('border-color','#777')
    // .style('border-width', 0.1)
    // .style('border-opacity', 0.3)

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
};

StationMap.prototype.renderMap = function(){
  let _this = this;

  console.log('this.mapAttr', this.mapAttr);

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

  this.layerContainer = this.svg.append('g').attr('class','mapcontainer').attr('transform', 'translate(' + this.offsetX + ',0)');
  let meshes = this.map;
  this.layerContainer.selectAll('.mapele').data(meshes).enter()
    .append('path').attr('class', 'mapele')
    .attr('d', elePath)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 0.3)
    .attr('stroke-opacity', 0.4)

  // this.layerContainer.call(brush);
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

  console.log('in stationmap, lengendConfig: ', legendConfig);

  let _this = this;
  this.legendConfig = legendConfig;


  let legendContainer = this.svg.append('g').attr('class', 'legendContainer').attr('transform', 'translate(' + this.offsetX + ',0)');
  legendContainer.on('mousemove', function(d){

  })
  let legendArray = legendConfig[this.layerId];

  if(legendArray == undefined) return
  let lcs = legendContainer.selectAll('.legend').data(legendArray).enter().append('g')
    .attr('transform', function(d, i){
      let x = _this.xScale(d['pos'][0]);
      let y = _this.yScale(d['pos'][1]);
      return 'translate(' + x + ',' + y + ')'
    });
  lcs.append('svg:image')
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
};


// Canvas Heatmap Part
StationMap.prototype.initHeatmapContainer = function(){
  if (this.canvasHeatmap != null) {
      this.canvasHeatmap.remove();
  }
  let config = {
      // container: document.getElementById('#' + this.heatmapId),
      container: this.divContainer.node(), // document.querySelector('#' + this.heatmapId),
      radius: 10,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75
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
            x: Math.round(this.xScale(record['small_clusters'][pointIdx][0])+this.offsetX),
            y: Math.round(this.yScale(record['small_clusters'][pointIdx][1])),
            value: record['small_clusters'][pointIdx][4]
        }
        // if (temp.x < this.margin.left || temp.x > this.width + this.margin.left) continue
        // if (temp.y < this.margin.top || temp.y > this.height + this.margin.top) continue
        points.push(temp)
    }
    // heatmap data format
    let data = {
        max: 1,
        data: points
    }
    // if you have a set of data points always use setData instead of addData
    // for data initialization
    this.heatmapInstance.setData(data)
};

StationMap.prototype.clearHeatmapCanvas = function() {
    this.heatmapInstance.setData({ max: 0, data: [] })
};

export default StationMap
