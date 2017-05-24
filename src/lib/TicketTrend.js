/**
 * Created by qshen on 24/5/2017.
 */

import * as d3 from 'd3'

let TicketTrend = function(el){
  this.el = el;
  console.log('Create Ticket Trend');

};

TicketTrend.prototype.init = function(){

};

TicketTrend.prototype.initContainer = function(){
  let _this = this;
  console.log('el2', this.el.clientHeight);
  this.width = this.el.clientWidth;
  this.height = this.el.clientHeight;

  let container = d3.select(this.el).append('svg')
    .attr('width', this.width)
    .attr('height', this.height);

  this.secContainerConfig = {
    'height': 0.5 * this.height,
    'width': this.width,
    'marginTop': 10,
    'marginBottom': 10,
    'marginLeft': 15,
    'marginRight' :15
  };
  setRenderRegion(this.secContainerConfig);
  this.dailyContainerConfig = {
    'height': 0.3 * this.height,
    'width': this.width,
    'marginTop': 10,
    'marginBottom': 10,
    'marginLeft': 15,
    'marginRight': 15
  };
  setRenderRegion(this.dailyContainerConfig);
  this.ioContainerConfig = {
    'height': 0.2 * this.height,
    'width': this.width,
    'marginTop': 10,
    'marginBottom': 10,
    'marginLeft': 15,
    'marginRight': 15
  };
  setRenderRegion(this.ioContainerConfig);

  this.secContainer = container.append('g').attr('class', 'second_container')
    .attr('transform', 'translate(0, 0)');
  this.dailyContainer = container.append('g').attr('class', 'second_container')
    .attr('transform', 'translate(0, '+ (_this.secContainerConfig.height)+')');
  this.ioContainer = container.append('g').attr('class', 'second_container')
    .attr('transform', 'translate(0, '+ (_this.secContainerConfig.height +
      _this.dailyContainerConfig.height)+')');

  this.secContainer.append('rect').attr('x', this.secContainerConfig['marginLeft'])
    .attr('y',this.secContainerConfig['marginTop'])
    .attr('width',this.secContainerConfig['renderWidth'])
    .attr('height', this.secContainerConfig['renderHeight'])
    .attr('fill', 'red');
  this.dailyContainer.append('rect').attr('x', this.dailyContainerConfig['marginLeft'])
    .attr('y',this.dailyContainerConfig['marginTop'])
    .attr('width',this.dailyContainerConfig['renderWidth'])
    .attr('height', this.dailyContainerConfig['renderHeight'])
    .attr('fill', 'blue');

  this.ioContainer.append('rect').attr('x', this.ioContainerConfig['marginLeft'])
    .attr('y',this.ioContainerConfig['marginTop'])
    .attr('width',this.ioContainerConfig['renderWidth'])
    .attr('height', this.ioContainerConfig['renderHeight'])
    .attr('fill', 'red')
};
function setRenderRegion(config){
  config.renderWidth = config.width - config.marginLeft - config.marginRight;
  config.renderHeight = config.height- config.marginTop- config.marginBottom
}
export default TicketTrend
