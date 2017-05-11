/**
 * Created by Qiaomu on 2017/4/16.
 */


import Vue from 'vue'

var pipeService = new Vue({
  data:{
    STATIONSELECTED: 'station_selected',
    MAPREADT: 'map_ready',
    LEGENDCONFIGREADY: 'legend_config_ready',
    RECORDREADY: 'record_ready',
    REGIONBRUSHED: 'region_brushed',
    NAVIGATIONBRUSHSTART:' navigation_brush_start',
    RENDERFRAME: 'render_frame',
    DATETIMESELECTED: 'datetime_selected'
  },

  methods:{
    //Once a station is selected
    emitStationSelected: function(msg){
      this.$emit(this.STATIONSELECTED, msg);
    },
    onStationSelected: function(callback){
      this.$on(this.STATIONSELECTED,function(msg){
        callback(msg);
      })
    },

    //Distribute map data
    emitMapReady: function(msg){
      this.$emit(this.MAPREADT, msg);
    },
    onMapReady: function(callback){
      this.$on(this.MAPREADT,function(msg){
        callback(msg);
      })
    },

    //Distribute legend config
    emitLegendConfigReady: function(msg){
      this.$emit(this.LEGENDCONFIGREADY, msg);
    },
    onLegendConfigReady: function(callback){
      this.$on(this.LEGENDCONFIGREADY,function(msg){
        callback(msg);
      })
    },

    //Distribute update record
    emitRecordReady: function(msg){
      this.$emit(this.RECORDREADY, msg);
    },
    onRecordReady: function(callback){
      this.$on(this.RECORDREADY,function(msg){
        callback(msg);
      })
    },


    // Clear other brushes
    emitSelectionBrushStart: function(msg){
      this.$emit(this.NAVIGATIONBRUSHSTART, msg);
    },
    onSelectionBrushStart: function(callback){
      this.$on(this.NAVIGATIONBRUSHSTART,function(msg){
        callback(msg);
      })
    },


    // Link Navigation view to detail view
    emitSelectionBrushend: function(msg){
      this.$emit(this.REGIONBRUSHED, msg);
    },
    onSelectionBrushend: function(callback){
      this.$on(this.REGIONBRUSHED,function(msg){
        callback(msg);
      })
    },


    // Render on frame/ per seconds
    emitRenderOneFrame: function(msg){
      this.$emit(this.RENDERFRAME, msg);
    },
    onRenderOneFrame: function(callback){
      this.$on(this.RENDERFRAME,function(msg){
        callback(msg);
      })
    },


    // Once a datatime is selected (Added by Qing Du (q.du@ust.hk))
    emitDatetimeSelected: function(msg){
      this.$emit(this.DATETIMESELECTED, msg);
    },
    onDatetimeSelected: function(callback){
      this.$on(this.DATETIMESELECTED, function(msg){
        callback(msg)
      })
    },
  }
});

export default pipeService
