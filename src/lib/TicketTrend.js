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
  this.barMargin = 60;
  this.barMarginLeft = 90;
  this.barMarginRight = 20;
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
      type: id[0]=='I'? 'I':'O',
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
  this.legendContainerConfig = {
    'height': 0.05 * this.height,
    'width': this.width,
    'marginTop': 30,
    'marginBottom': 30,
    'marginLeft': 15,
    'marginRight' :15
  };

  let svg = d3.select(this.el).append('svg')
    .attr('width', this.width)
    .attr('height', this.height);
  _this.svg = svg;
  this.initShadow();

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

  this.legendDate = this.legendContainer.append('text').attr('x', this.secContainerConfig.width * 2 / 3)
    .attr('y', this.legendContainerConfig.height / 2)

  let Throughput  =(this.allIO[0]['v'] + this.allIO[1]['v'])
  this.legendDate.text("Throughput:  " + Throughput).style('font-family', 'Helvetica Neue').style('font-size', '12px');;

  let container = svg.append('g').attr('transform', function(){
    return 'translate(0,' + _this.legendContainerConfig['height']+')';
  });

  this.secContainer = container.append('g').attr('class', 'second_container')
    .attr('transform', 'translate(0, 0)');
  // Dynamic update the domain

  this.dailyContainer = container.append('g').attr('class', 'daily_container')
    .attr('transform', 'translate(0, '+ (_this.secContainerConfig.height)+')');
  this.ioContainer = container.append('g').attr('class', 'io_container')
    .attr('transform', 'translate(0, '+ (_this.secContainerConfig.height +
      _this.dailyContainerConfig.height)+')');

  this.secContainer.append('rect').attr('x', this.secContainerConfig['marginLeft'])
    .attr('y',this.secContainerConfig['marginTop'] / 2)
    .attr('width',this.secContainerConfig['renderWidth'])
    .attr('height', this.secContainerConfig['height']
      - this.secContainerConfig.marginBottom
      + this.secContainerConfig['marginTop'] / 2)
    .attr('opacity', 0.5)
    .attr('fill', '#f0f0f0')
    .style("filter", "url(#drop-shadow)")

  this.dailyContainer.append('rect').attr('x', this.dailyContainerConfig['marginLeft'])
    .attr('y',this.dailyContainerConfig['marginTop'] / 2)
    .attr('width',this.dailyContainerConfig['renderWidth'])
    .attr('height', this.dailyContainerConfig['height']
      - this.dailyContainerConfig['marginBottom']
      + this.dailyContainerConfig['marginTop'] / 2)
    .attr('opacity', 0.5)
    .attr('fill', '#f0f0f0')
    .style("filter", "url(#drop-shadow)")

  this.ioContainer.append('rect').attr('x', this.ioContainerConfig['marginLeft'])
    .attr('y',this.ioContainerConfig['marginTop'] / 2)
    .attr('width',this.ioContainerConfig['renderWidth'])
    .attr('height', this.ioContainerConfig['height']
      - this.ioContainerConfig['marginBottom']
      + this.ioContainerConfig['marginTop'] / 2)
    .attr('opacity', 0.5)
    .attr('fill', '#f0f0f0')
    .style("filter", "url(#drop-shadow)");

  this.inited = true;
  this.iniScale();
  this.initSecondView();
};
TicketTrend.prototype.initShadow = function(){

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
TicketTrend.prototype.iniScale = function(){
  let _this = this;
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
  this.ticketXScale = d3.scaleLinear().range([_this.barMarginLeft, this.secContainerConfig['renderWidth'] - _this.barMarginRight]).domain([0, this.maxRealtimeRecord]);
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
  // console.log('dd', lens);
  this.updateView();
};
TicketTrend.prototype.updateView = function(records){
  if(!this.inited) return;
  this.svg.selectAll('text').style('font-family', 'Helvetica Neue').style('font-size', '12px');
  this.updateIOView();
  this.updateDailyView();
  this.updateSecondView();
  this.svg.selectAll('text').style('font-family', 'Helvetica Neue').style('font-size', '12px');
  let now = new Date();
  let time  = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  this.legendDate.text("Throughput:  " + (this.allIO[0]['v'] + this.allIO[1]['v']));
};

TicketTrend.prototype.updateIOView = function(){
  let _this =  this;
  let largestV = 0;
  this.allIO.forEach(function(io){
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
      let v = _this.ioXscale(d['v'], largestV) + _this.ioContainerConfig.marginLeft + _this.barMarginLeft;
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

  barContainer.append('rect')
    .attr('x', _this.barMarginLeft)
    .attr('width', 0)
    .attr('height', barHeight)
    .attr('fill', function(d, i){
      return _this.colorStyle[d['id']]
    })
    .attr('opacity', 0.3);

/////////////
//   let textContainer = barContainer.append('g').attr('class','textContaienr').attr('transform',function(d, i){
//     return 'translate(0,' + barHeight / 2+ ')';
//   });
//   textContainer.append('text').text(function(d){
//     return d['id'] == 'I'? 'Enter': "Leave";
//   });
//   textContainer.append('text').attr('class', 'number').text(function(d){
//     return ''
//   });
//////
  let textContainer = barContainer.append('g');
  let texts = textContainer.append('text').text(function(d){
    return d['id'] == "I"? "Total Entry ": "Total Exit ";
  });
  textContainer.append('text').attr('class','number');

  let node = texts.node();
  if(!node) return;
  let bound = node.getBBox();
  texts.attr('x', _this.barMarginLeft - bound.width - 5)

  textContainer.attr('transform',function(d, i){
    return 'translate(0,' + (barHeight / 2 + bound.height / 2 - 3) + ')';
  });
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
      let v = _this.gateXScale(d['v'], largestV) + _this.dailyContainerConfig.marginLeft + _this.barMarginLeft;
      return v + 10
    })
  });

  let barContainer = gateBars.enter().append('g').attr('class', 'dailyBars')
    .attr('transform', function(d, i){
      let height = i * barHeight + (i+1) * gap + _this.dailyContainerConfig['marginTop'];
      return 'translate(' + _this.dailyContainerConfig.marginLeft+ ','+ height + ')';
    });

  barContainer.append('rect')
    .attr('x', _this.barMarginLeft)
    .attr('width', 0)
    .attr('height', barHeight)
    .attr('fill', function(d, i){
      return _this.colorStyle[d['type']]
    })
    .attr('opacity', 0.3);


  let textContainer = barContainer.append('g');
  let texts = textContainer.append('text').text(function(d){
    return d['id'][0] == "I"? "Entry "+d['id'][1]: "Exit " + d['id'][1];
  });
  textContainer.append('text').attr('class','number');

  let node = texts.node();
  if(!node) return;
  let bound = node.getBBox();
  texts.attr('x', _this.barMarginLeft - bound.width - 5)

  textContainer.attr('transform',function(d, i){
    return 'translate(0,' + (barHeight / 2 + bound.height / 2 - 3) + ')';
  });
};
TicketTrend.prototype.initSecondView = function(){
  let _this = this;

  let duration = 750;
  this.now = new Date(Date.now() - duration);
  this.limit = 60*1;
  this.duration = 1000;
  this.xsecScale = d3.scaleTime()
    .domain([this.now - (this.limit-1)*this.duration, this.now])
    .range([_this.barMarginLeft, this.secContainerConfig.renderWidth - _this.barMarginRight]);

  this.secBottom = this.secContainer.append('g')
    .attr('class', 'x axis bottom')
    .attr('transform', 'translate(' +  _this.secContainerConfig.marginLeft + ',' +
      (_this.secContainerConfig.height - _this.secContainerConfig.marginBottom+ 2) + ')')
    .call(d3.axisBottom(this.xsecScale))
};

TicketTrend.prototype.updateSecondView = function(){
  this.now = new Date();
  let _this = this;
  let singleHeight = this.secContainerConfig.renderHeight / 10;
  let singleWidth = _this.secContainerConfig.renderWidth / _this.maxRealtimeRecord;
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
    }).attr('height', singleHeight)
      .attr('width', singleWidth)
      .attr('fill', function(d, i){
        return color;
      })
      .attr('opacity', function(d){

        return d == 0? 0: 0.5
      })
      .attr('stroke', 'white')
      .attr('stroke-width',2)
  })

  let textContainer = gateRecords.append('g')
  let texts = textContainer.append('text').text(function(d){
    return d['id'][0] == "I"? "Entry "+d['id'][1]: "Exit " + d['id'][1]
  });

  let bound = texts.node().getBBox();
  texts.attr('x', _this.barMarginLeft - bound.width - 5)

  texts.attr('transform',function(d, i){
    return 'translate(0,' + (singleHeight / 2 + bound.height / 2) + ')';
  });

};
function setRenderRegion(config){
  config.renderWidth = config.width - config.marginLeft - config.marginRight;
  config.renderHeight = config.height- config.marginTop- config.marginBottom
}
export default TicketTrend
