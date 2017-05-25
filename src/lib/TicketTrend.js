/**
 * Created by qshen on 24/5/2017.
 */
import * as d3 from "d3";

let TicketTrend = function(el){
  this.el = el;
  this.maxRealtimeRecord = 60;
  this.allIO = [{id:'I',v: 0},{id:"O", v:0}]
  this.init();
  this.inited = false;
  this.colorStyle = {
    'I': '#f46d43',
    'O': '#3288bd'
  }
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
    let recent = [];
    for(var i = 0; i< _this.maxRealtimeRecord; i++){
      recent.push(0);
    }
    _this.allGate.push({
      id:id,
      type: id[0]=='O'? 'I':'O',
      v: 0,
      recent:recent
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
  if(this.inited) return
  let _this = this;
  this.width = this.el.clientWidth;
  this.height = this.el.clientHeight - 40;
  let legendContainerConfig = {
    'height': 0.1 * this.height,
    'width': this.width,
    'marginTop': 30,
    'marginBottom': 30,
    'marginLeft': 15,
    'marginRight' :15
  };

  let svg = d3.select(this.el).append('svg')
    .attr('width', this.width)
    .attr('height', this.height);


  this.secContainerConfig = {
    'height': 0.35 * this.height,
    'width': this.width,
    'marginTop': 30,
    'marginBottom': 30,
    'marginLeft': 15,
    'marginRight' :15
  };
  setRenderRegion(this.secContainerConfig);
  this.dailyContainerConfig = {
    'height': 0.35 * this.height,
    'width': this.width,
    'marginTop': 30,
    'marginBottom': 30,
    'marginLeft': 15,
    'marginRight': 15
  };
  setRenderRegion(this.dailyContainerConfig);
  this.ioContainerConfig = {
    'height': 0.2 * this.height,
    'width': this.width,
    'marginTop': 30,
    'marginBottom': 30,
    'marginLeft': 15,
    'marginRight': 15
  };
  setRenderRegion(this.ioContainerConfig);

  this.legendContainer = svg.append('g');

  let container = svg.append('g').attr('transform', function(){
    return 'translate(0,' + legendContainerConfig['height']+')';
  })

  this.secContainer = container.append('g').attr('class', 'second_container')
    .attr('transform', 'translate(0, 0)');
  // Dynamic update the domain

  this.dailyContainer = container.append('g').attr('class', 'daily_container')
    .attr('transform', 'translate(0, '+ (_this.secContainerConfig.height)+')');
  this.ioContainer = container.append('g').attr('class', 'io_container')
    .attr('transform', 'translate(0, '+ (_this.secContainerConfig.height +
      _this.dailyContainerConfig.height)+')');

  this.secContainer.append('rect').attr('x', this.secContainerConfig['marginLeft'])
    .attr('y',this.secContainerConfig['marginTop'])
    .attr('width',this.secContainerConfig['renderWidth'])
    .attr('height', this.secContainerConfig['renderHeight'])
    .attr('stroke', 'red')
    .attr('stroke-width', 1)
    .attr('fill', 'none')

  this.dailyContainer.append('rect').attr('x', this.dailyContainerConfig['marginLeft'])
    .attr('y',this.dailyContainerConfig['marginTop'])
    .attr('width',this.dailyContainerConfig['renderWidth'])
    .attr('height', this.dailyContainerConfig['renderHeight'])
    .attr('fill', 'blue')
    .attr('opacity', 0.1)

  this.ioContainer.append('rect').attr('x', this.dailyContainerConfig['marginLeft'])
    .attr('y',this.ioContainerConfig['marginTop'])
    .attr('width',this.ioContainerConfig['renderWidth'])
    .attr('height', this.ioContainerConfig['renderHeight'])
    .attr('fill', 'green')
    .attr('opacity', 0.1)
  this.inited = true;
  this.iniScale();
  this.initSecondView();
};

TicketTrend.prototype.iniScale = function(){

  this.ioXscale = function(value, largest){
    let xScale = d3.scaleLinear().range([0, 0.6 * this.ioContainerConfig['renderWidth']]).domain([0, largest]);
    if((value * 5) < this.ioContainerConfig['renderWidth'] * 0.6){
      return value * 5;
    }else{
      return xScale(value)
    }
  }
  this.gateXScale = function(value, largest){
    let ratio = 0.5;
    let xScale = d3.scaleLinear().range([0, ratio * this.ioContainerConfig['renderWidth']]).domain([0, largest]);
    if((value * 10) < this.dailyContainerConfig['renderWidth'] * ratio){
      return value * 5;
    }else{
      return xScale(value)
    }
  }
  console.log('attr', this.secContainerConfig['renderWidth'], this.maxRealtimeRecord - 1)
  this.ticketXScale = d3.scaleLinear().range([60, this.secContainerConfig['renderWidth']]).domain([0, this.maxRealtimeRecord]);
};

TicketTrend.prototype.addData = function(records){
  let _this = this;
  // For test
  // _this.allGate.forEach(function(d){
  //   let id = d['id'];
  //   let type = d['type'];
  //   let inNum = parseInt(Math.random() * 3)
  //   d['recent'].push(inNum);
  //   d['v'] += inNum;
  //   _this.IOMap[type]['v'] += inNum;
  // });
  // For test end

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
      d['v'] += ticketObj[id];
    }
    if(d['recent'].length>_this.maxRealtimeRecord){
      d['recent'].shift()
    }
  });
  let lens = [];
  _this.allGate.forEach(function(gate){
    let n = 0;
    gate['recent'].forEach(function(d){
      n+= d;
    });
    lens.push(gate['v']);
  });
  console.log('dd', lens);
  this.updateView()
};
TicketTrend.prototype.updateView = function(records){
  if(!this.inited) return;
  this.updateIOView();
  this.updateDailyView();
  this.updateSecondView();
};

TicketTrend.prototype.updateIOView = function(){
  let _this =  this;
  let largestV = 0;
  this.allIO.forEach(function(io){
    // io['v'] += parseInt(Math.random() * 10);
    if(largestV < io['v']){
      largestV = io['v'];
    }
  });

  let barHeight = this.ioContainerConfig.renderHeight * 0.8 / 2;
  let gap = (this.ioContainerConfig.renderHeight - barHeight * 2) / 3;
  let ioBars = this.ioContainer.selectAll('.ioBars').data(this.allIO, function(d){return d['id']});


  ioBars.each(function(d){
    d3.select(this).selectAll('rect').transition(1000).attr('width',function(){
      let v = _this.ioXscale(d['v'], largestV)
      return v;
    })
    d3.select(this).selectAll('.number').transition(1000).text(function(){
      if(d['v'] == 0)return ""
      return d['v'];
    }).attr('x',function(){
      let v = _this.ioXscale(d['v'], largestV) + _this.ioContainerConfig.marginLeft + 60;
      return v + 10
    })
  });

  ioBars.exit()
    .attr("class", "exit")
    .transition(1000)
    .attr("y", 60)
    .style("fill-opacity", 1e-6)
    .remove();

  let barContainer = ioBars.enter().append('g').attr('class', 'ioBars')
    .attr('transform', function(d, i){
      let height = i * barHeight + (i+1) * gap + _this.ioContainerConfig['marginTop']
      return 'translate(' + _this.ioContainerConfig.marginLeft+ ','+ height + ')';
    });

  let textContainer = barContainer.append('g').attr('class','textContaienr').attr('transform',function(d, i){
    return 'translate(0,' + barHeight / 2+ ')';
  });
  textContainer.append('text').text(function(d){
    return d['id'] == 'I'? 'Enter': "Leave";
  });
  textContainer.append('text').attr('class', 'number').text(function(d){
    return ''
  });

  barContainer.append('rect')
    .attr('x', 60)
    .attr('width', 0)
    .attr('height', barHeight)
    .attr('fill', function(d, i){
      return _this.colorStyle[d['id']]
    })
    .attr('opacity', 0.3);
};

TicketTrend.prototype.updateDailyView = function(){
  let _this =  this;
  let largestV = 0;
  this.allGate.forEach(function(gate){
    if(largestV < gate['v']){
      largestV = gate['v'];
    }
  });
  // Hard code
  let barHeight = this.dailyContainerConfig.renderHeight * 0.8 / 10;
  let gap = (this.dailyContainerConfig.renderHeight - barHeight * 10) / 11;
  let gateBars = this.dailyContainer.selectAll('.dailyBars').data(this.allGate, function(d){return d['id']});

  gateBars.each(function(d){
    d3.select(this).selectAll('rect').transition(1000).attr('width',function(){
      let v = _this.gateXScale(d['v'], largestV)
      return v;
    })
    d3.select(this).selectAll('.number').transition(1000).text(function(){
      if(d['v'] == 0)return ""
      return d['v'];
    }).attr('x',function(){
      let v = _this.gateXScale(d['v'], largestV) + _this.dailyContainerConfig.marginLeft + 60;
      return v + 10
    })
  });

  let barContainer = gateBars.enter().append('g').attr('class', 'dailyBars')
    .attr('transform', function(d, i){
      let height = i * barHeight + (i+1) * gap + _this.dailyContainerConfig['marginTop'];
      return 'translate(' + _this.dailyContainerConfig.marginLeft+ ','+ height + ')';
    });

  barContainer.append('rect')
    .attr('x', 60)
    .attr('width', 0)
    .attr('height', barHeight)
    .attr('fill', function(d, i){
      return _this.colorStyle[d['type']]
    })
    .attr('opacity', 0.3);
  let textContainer = barContainer.append('g').attr('class','textContaienr').attr('transform',function(d, i){
    return 'translate(0,' + barHeight / 2+ ')';
  });
  textContainer.append('text').text(function(d){
    return d['id'];
  });
  textContainer.append('text').attr('class', 'number').text(function(d){
    return ''
  });
};
TicketTrend.prototype.initSecondView = function(){
  let _this = this;
  var limit = 60 * 1,
    duration = 750;
  this.now = new Date(Date.now() - duration);
  this.limit = 60*1;
  this.duration = 1000;
  this.xsecScale = d3.scaleTime()
    .domain([this.now - (this.limit-1)*this.duration, this.now])
    .range([0, this.secContainerConfig.renderWidth]);

  this.secBottom = this.secContainer.append('g')
    .attr('class', 'x axis bottom')
    .attr('transform', 'translate(' +  _this.secContainerConfig.marginLeft + ',' +
      (_this.secContainerConfig.height - _this.secContainerConfig.marginBottom) + ')')
    .call(d3.axisBottom(this.xsecScale))
};

TicketTrend.prototype.updateSecondView = function(){
  this.now = new Date();
  let _this = this;
  let singleHeight = this.secContainerConfig.renderHeight / 10;
  this.xsecScale.domain([this.now - (this.limit-1) * this.duration, this.now]);
  this.secBottom.transition()
    .duration(this.duration)
    .ease(d3.easeLinear)
    .call(d3.axisBottom(this.xsecScale));

  this.secContainer.selectAll('.gateContainer').remove();
  let gateRecords = this.secContainer.selectAll('.gateContainer').append('g')
    .data(this.allGate, function(d){return d['id']})
    .enter()
    .append('g').attr('class', 'gateContainer')
    .attr('transform', function(d, i){
      return 'translate(' + _this.secContainerConfig.marginLeft + ','
        +(_this.secContainerConfig.marginTop + singleHeight * i)  + ')';
    });
  gateRecords.each(function(d){
    let color = _this.colorStyle[d['type']];
    let ticketContainer = d3.select(this).append('g');
    let tickets = ticketContainer.selectAll('.ticket').data(d['recent']).enter().append('rect')
      .attr('class', 'ticket');
    tickets.attr('x', function(v, i){
      let x =_this.ticketXScale(i)
      return x ;
    }).attr('height', _this.secContainerConfig.renderHeight / 10)
      .attr('width', _this.secContainerConfig.renderWidth / _this.maxRealtimeRecord)
      .attr('fill', function(d, i){
        return color;
      })
      .attr('opacity', function(d){

        return d == 0? 0: 0.5
      })
      .attr('stroke', 'black')
      .attr('stroke-width',1)
  })
};
function setRenderRegion(config){
  config.renderWidth = config.width - config.marginLeft - config.marginRight;
  config.renderHeight = config.height- config.marginTop- config.marginBottom
}
export default TicketTrend
