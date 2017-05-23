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
  this.groups = {
    current: {
      index: 0,
      value: 0,
      color: 'orange',
      data: d3.range(this.limit).map(function(){
        return 0;
      })
    },
    target: {
      index: 1,
      value: 0,
      color: 'green',
      data: d3.range(this.limit).map(function(){
        return 0;
      })
    },
    output: {
      index: 2,
      value: 0,
      color: 'grey',
      data: d3.range(this.limit).map(function(){
        return 0;
      })
    },
  };
};

StationTrend.prototype.initContainer = function(){
  let _this = this;
  this.margin = {top: 20, left: 30, right:20 ,bottom: 20};
  this.width = this.$el.clientWidth - this.margin.left - this.margin.right;
  this.height = this.$el.clientHeight - this.margin.top - this.margin.bottom;

  this.widthPerSvg = this.$el.clientWidth;
  this.heightPerSvg = this.$el.clientHeight;

  this.floorHeight = (this.heightPerSvg - this.margin.bottom) / 3;

  this.xScale = d3.scaleTime()
    .domain([this.now - (this.limit-1)*this.duration, this.now])
    .range([0, this.width]);

  this.yScale = d3.scaleLinear()
    .domain([0, 4])
    .range([this.floorHeight - 35, 0]);

  this.line = d3.line()
    .x(function(d, i) {
      return _this.xScale(_this.now - (_this.limit - 1 - i) * _this.duration)
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

  this.gTop = this.svg.append('g')
    .attr('class', 'top')
    .attr('transform', 'translate(' + (this.margin.left)+','+((this.floorHeight*0)+15) + ')')

  this.gMiddle = this.svg.append('g')
    .attr('class', 'middle')
    .attr('transform', 'translate(' + (this.margin.left)+','+((this.floorHeight*1)+15) + ')')

  this.gBottom = this.svg.append('g')
    .attr('class', 'bottom')
    .attr('transform', 'translate(' + (this.margin.left)+','+((this.floorHeight*2)+15) + ')')

  this.xTop = this.gTop.append('g')
    .attr('class', 'x axis top')
    .attr('transform', 'translate(0,' + (this.floorHeight-35) + ')')
    .call(d3.axisBottom(this.xScale))

  this.xMiddle = this.gMiddle.append('g')
    .attr('class', 'x axis middle')
    .attr('transform', 'translate(0,' + (this.floorHeight-35) + ')')
    .call(d3.axisBottom(this.xScale))

  this.xBottom = this.gBottom.append('g')
    .attr('class', 'x axis bottom')
    .attr('transform', 'translate(0,' + (this.floorHeight-35) + ')')
    .call(d3.axisBottom(this.xScale))

  this.yTop = this.gTop.append('g')
    .attr('class', 'y axis top')
    .attr('transform', 'translate(0,' + 0 + ')')
    .call(d3.axisLeft(this.yScale))

  this.yMiddle = this.gMiddle.append('g')
    .attr('class', 'y axis middle')
    .attr('transform', 'translate(0,' + 0 + ')')
    .call(d3.axisLeft(this.yScale))

  this.yBottom = this.gBottom.append('g')
    .attr('class', 'y axis bottom')
    .attr('transform', 'translate(0,' + 0 + ')')
    .call(d3.axisLeft(this.yScale))

  this.barTop = this.gTop.append("line")
    .attr("x1", this.width)  //<<== change your code here
    .attr("y1", 20)
    .attr("x2", this.width)  //<<== and here
    .attr("y2", this.floorHeight-35)
    .style("stroke-width", 1)
    .style("stroke", "red")
    .style("fill", "none");

  this.barMiddle = this.gMiddle.append("line")
    .attr("x1", this.width)  //<<== change your code here
    .attr("y1", 20)
    .attr("x2", this.width)  //<<== and here
    .attr("y2", this.floorHeight-35)
    .style("stroke-width", 1)
    .style("stroke", "red")
    .style("fill", "none");

  this.barBottom = this.gBottom.append("line")
    .attr("x1", this.width)  //<<== change your code here
    .attr("y1", 20)
    .attr("x2", this.width)  //<<== and here
    .attr("y2", this.floorHeight-35)
    .style("stroke-width", 1)
    .style("stroke", "red")
    .style("fill", "none");

  this.paths = [this.gTop.append('g'), this.gMiddle.append('g'), this.gBottom.append('g')];

  for (var name in this.groups) {
    var group = this.groups[name]
    group.path = this.paths[group.index].append('path')
      .data([group.data])
      .attr('class', name + ' group')
      .attr('fill', 'none')
      .style('stroke', group.color)
  }
};


StationTrend.prototype.updateData = function(frameData){
  this.now = new Date();
  let idx = 0;
  // Remove oldest data point from each group
  for (var name in this.groups) {
    var group = this.groups[name];
    group.data.shift()
  }

    // Add new values
  for (var name in this.groups) {
    var group = this.groups[name]

    // need to change to corresponding floor id, currently hard code.

    let floor = frameData['records'][idx];
    if(!floor) continue
    let smallCluster = floor['small_clusters'];
    let desity = smallCluster == -1? 0: d3.max(smallCluster.map(function(record){ return record[4]}));
    //group.data.push(group.value) // Real values arrive at irregular intervals
    group.data.push(desity==undefined?0:desity);
    ++idx;
  }

}


StationTrend.prototype.updateLinechart = function (frameData){
  this.now = new Date();
  let idx = 0;
  // Remove oldest data point from each group
  for (var name in this.groups) {
    var group = this.groups[name];
    group.data.shift()
  }

  // Add new values
  for (var name in this.groups) {
    var group = this.groups[name]

    // need to change to corresponding floor id, currently hard code.

    let floor = frameData['records'][idx];
    if(!floor) continue
    let smallCluster = floor['small_clusters'];
    let desity = smallCluster == -1? 0: d3.max(smallCluster.map(function(record){ return record[4]}));
    //group.data.push(group.value) // Real values arrive at irregular intervals
    group.data.push(desity==undefined?0:desity);
    group.path.attr('d', this.line)
    ++idx;
  }

  // Shift domain
  this.xScale.domain([this.now - (this.limit-1) * this.duration, this.now]);

  // Slide x-axis left
  this.xTop.transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .call(d3.axisBottom(this.xScale));

  this.xMiddle.transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .call(d3.axisBottom(this.xScale));

  this.xBottom.transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .call(d3.axisBottom(this.xScale));


  // Slide paths left
  this.paths[0].attr('transform', null)
    .transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .attr('transform', 'translate(' + (this.xScale(this.now-this.duration)-this.xScale(this.now)) + ')')

  this.paths[1].attr('transform', null)
    .transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .attr('transform', 'translate(' + (this.xScale(this.now-this.duration)-this.xScale(this.now)) + ')')

  this.paths[2].attr('transform', null)
    .transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .attr('transform', 'translate(' + (this.xScale(this.now-this.duration)-this.xScale(this.now)) + ')')
}


export default StationTrend
