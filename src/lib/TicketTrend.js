/**
 * Created by qshen on 24/5/2017.
 */

import * as d3 from 'd3'

let TicketTrend = function(el){
  this.el = el;
  this.maxRealtimeRecord = 60;
  this.allIO = [{id:'I',v: 0},{id:"O", v:0}]
  this.init();

};

TicketTrend.prototype.init = function(){
  let _this = this;
  this.gateId = [];
  for(let i = 0; i<5; i++){
    this.gateId.push('I'+i);
  }
  for(let i = 0; i<5; i++){
    this.gateId.push('O'+i);
  }
  this.allGate = [];
  this.gateId.forEach(function(id){
    _this.allGate.push({
      id:id,
      type: id[0]=='O'? 'I':'O',
      v: 0,
      recent:[]
    })
  });

  _this.gateIdMap = {};
  this.allGate.forEach(function(gateObj){
    _this.gateIdMap[gateObj['id']] = gateObj;
  });
  _this.IOMap = {};
  this.allIO.forEach(function(ioObj){
    _this.IOMap[ioObj['id']] = ioObj;
  })
};

TicketTrend.prototype.initContainer = function(){
  let _this = this;
  this.width = this.el.clientWidth;
  this.height = this.el.clientHeight - 40;

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
    .attr('fill', 'green')
};

TicketTrend.prototype.addData = function(records){
  let _this = this;
  let ticketObj = {};
  records.forEach(function(record){
    let type = record['io']? 'I' : 'O';
    _this.IOMap[type]['v'] += 1;
    let gateId = type + record['gate'];
    if(ticketObj[gateId] == undefined){
      ticketObj[gateId] = 0;
    }
    ticketObj[gateId] += 1;
  });
  _this.allGate.forEach(function(d){
    let id = d['id'];
    if(ticketObj[id] == undefined){
      d['recent'].push(0)
    }else{
      d['recent'].push(ticketObj[id])
    }
    if(d['recent'].length>10){
      d['recent'].shift()
    }
  });
  console.log('ssr', records, _this.allGate);
}
function setRenderRegion(config){
  config.renderWidth = config.width - config.marginLeft - config.marginRight;
  config.renderHeight = config.height- config.marginTop- config.marginBottom
}
export default TicketTrend
