<!-- 
Created by Qing Du (q.du@ust.hk) with reference to Yazilim Mekani's blog at 
http://www.onbirkod.com/2017/02/10/using-bootstrap-datetimepicker-eonasdan-with-vue-js-2/ 
-->

<template>
    <div class='input-group date'>
        <input type='text' class="form-control" name="datetime" />
        <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
        </span>
    </div>
</template>
 
<script>
    var $ = window.jQuery = require('jquery')
    import moment from 'moment'
    import eonosdandatetimepicker from 'eonasdan-bootstrap-datetimepicker'
    import pipeService from '../service/pipeService';
    import dataService from '../service/dataService';
    export default {
        name: 'datetimepicker',
        data () {
            return {
                value: ''
            }
        },
        watch: {
            options: function (options) {
                $(this.$el).datetimepicker({ data: options })
            }
        },
        mounted: function () {
            var vm = this
            var mycomp = $(this.$el).datetimepicker({})
            mycomp.on('dp.change', function (e) {
                vm.value = e.date
                
                vm.$emit('change', vm.value);
                pipeService.emitDateSelected(vm.value);

            })
        },
        destroyed: function () {
            $(this.$el).off().datetimepicker('destroy')
        }
    }
</script>
 
<style>

</style>
