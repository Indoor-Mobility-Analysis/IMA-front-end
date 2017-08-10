/**
 * Created by haipeng on 2017/5/11.
 */

import * as d3 from 'd3'
let StationTrend = function(el){
  let _this = this;
  this.$el = el;
  this.limit = 60*1;
  this.duration = 1000;
  this.now = new Date(Date.now() - this.duration);

  // need to adjust later, perhaps based on data
  this.groups = [
    {
      'floor': 0,
      'color':'orange', 
      'data': d3.range(this.limit).map(function(){return 0;})
    },
    {
      'floor': -1,
      'color':'green', 
      'data': d3.range(this.limit).map(function(){return 0;})
    },
    {
      'floor': -2,
      'color':'grey', 
      'data': d3.range(this.limit).map(function(){return 0;})
    }
  ]
}

StationTrend.prototype.initContainer = function(){
  let _this = this;
  this.margin = {top: 30, left: 40, right:30 ,bottom: 30};
  this.width = this.$el.clientWidth - this.margin.left - this.margin.right;
  this.height = this.$el.clientHeight - this.margin.top - this.margin.bottom;

  this.widthPerSvg = this.$el.clientWidth;
  this.heightPerSvg = this.$el.clientHeight;

  this.floorHeight = (this.heightPerSvg - this.margin.bottom) / 3;

  let floorTopMargin = 30;
  let floorBottomMargin = 30;

  this.xScale = d3.scaleTime()
    .domain([this.now - (this.limit-1)*this.duration, this.now])
    .range([0, this.width]);

  this.yScale = d3.scaleLinear()
    .domain([0, 200])
    .range([this.floorHeight - floorTopMargin - floorBottomMargin, 0]);

  this.line = d3.line()
    .x(function(d, i) {
      return _this.xScale(_this.now - (_this.limit - 2 - i) * _this.duration)
    })
    .y(function(d) {
      return _this.yScale(d)
    })
    .curve(d3.curveLinear);



  d3.select(this.$el).selectAll('svg').remove();
  this.svg = d3.select(this.$el).append('svg')
    .attr('class', 'chart')
    .attr('width', this.widthPerSvg)
    .attr('height', this.heightPerSvg)

  this.initShadow();
  
  this.gList = [];
  this.xList = [];
  this.yList = [];
  this.barList = [];
  this.pathList = [];
  for(let idx=0; idx<this.groups.length; idx++){

    let rectTmp = this.svg.append('g')
      .append('rect').attr('x', 0)
      .attr('y',0)
      .attr('width',this.widthPerSvg)
      .attr('height', this.floorHeight-floorTopMargin/2)
      .attr('opacity', 0.5)
      .attr('fill', '#f0f0f0')
      .style("filter", "url(#drop-shadow)")
      .attr('transform', 'translate(' +0+','+((this.floorHeight*idx)+floorTopMargin/4) + ')');

    let gTmp = this.svg.append('g')
      .attr('class', 'g idx_'+idx)
      .attr('transform', 'translate(' + (this.margin.left)+','+((this.floorHeight*idx)+floorTopMargin) + ')');

    let xTmp = gTmp.append('g')
      .attr('class', 'x axis idx_'+idx)
      .attr('transform', 'translate(0,' + (this.floorHeight-floorTopMargin-floorBottomMargin) + ')')
      .call(d3.axisBottom(this.xScale));

    let yTmp = gTmp.append('g')
      .attr('class', 'y axis idx_'+idx)
      .attr('transform', 'translate(0,' + 0 + ')')
      .call(d3.axisLeft(this.yScale));

    let barTmp = gTmp.append("line")
      .attr("x1", this.width)  //<<== change your code here
      .attr("y1", 0)
      .attr("x2", this.width)  //<<== and here
      .attr("y2", this.floorHeight-floorTopMargin-floorBottomMargin)
      .style("stroke-width", 1)
      .style("stroke", "red")
      .style("fill", "none");
    
    var group = this.groups[idx];
    group.path = gTmp.append('g').append('path')
      .data([group.data])
      .attr('class', group.floor)
      .attr('fill', 'none')
      .style('stroke', group.color)
    
    this.gList.push(gTmp);
    this.xList.push(xTmp);
    this.yList.push(yTmp);
    this.barList.push(barTmp);
    this.pathList.push(group.path);
  }
};


StationTrend.prototype.updateData = function(frameData){
  this.now = new Date();
  // Remove oldest data point from each group
  for(let idx=0; idx<this.groups.length; idx++){
    var group = this.groups[idx];
    group.data.shift()
    let floor = frameData['records'][idx];
    if(!floor) continue
    let ppl_cnt = floor['ppl_cnt'];
    group.data.push(ppl_cnt);
  }
}


StationTrend.prototype.updateLinechart = function (frameData){
  // console.log('frameData: ', frameData);
  let _this = this;
  this.now = new Date();
  let yMax = 0;
  // Remove oldest data point from each group
  for(let idx=0; idx<this.groups.length; idx++){
    var group = this.groups[idx];
    group.data.shift()

    let floor = frameData['records'][idx];
    if(!floor) continue
    let ppl_cnt = floor['ppl_cnt'];
    group.data.push(ppl_cnt);
    yMax = d3.max(group.data) > yMax ? d3.max(group.data):yMax;
  }

  this.xScale.domain([this.now - (this.limit-1) * this.duration, this.now]);
  this.yScale.domain([0, yMax+30]);

  for(let idx=0; idx<this.groups.length; idx++){
    var group = this.groups[idx]
    // Shift domain
    this.xList[idx].transition()
      .duration(this.duration)
      .ease(d3.easeLinear)
      .call(d3.axisBottom(this.xScale));
    
    
    this.yList[idx].transition()
      .call(d3.axisLeft(this.yScale));

    this.line.y(function(d) {
      return _this.yScale(d)
    });
    group.path.attr('d', this.line);

    this.pathList[idx].transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .attr('transform', 'translate(' + (this.xScale(this.now-this.duration)-this.xScale(this.now)) + ')')
  }
}

StationTrend.prototype.initShadow = function(){

  var defs = this.svg.append("defs");

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
  var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
  filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
  filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 5)
    .attr("dy", 5)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");
}

export default StationTrend
