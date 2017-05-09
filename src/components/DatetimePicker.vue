<!-- 
Created by Qing Du (q.du@ust.hk) with reference to Element 1.3.1 Beryllium at 
http://element.eleme.io/#/en-US/component/datetime-picker
-->

<template>
    <div class="block">
        <el-date-picker
        v-model="value2"
        type="datetime"
        placeholder="Select date and time"
        :picker-options="pickerOptions1"
        v-on:input="updatePicked($event.value)">
    </el-date-picker>
</div>
</template>

<script>
    // var $ = window.jQuery = require('jquery')
    // import moment from 'moment'
    // import eonosdandatetimepicker from 'eonasdan-bootstrap-datetimepicker'
    import pipeService from '../service/pipeService';
    import dataService from '../service/dataService';
    // export default {
    //     name: 'datetimepicker',
    //     data () {
    //         return {
    //             value: ''
    //         }
    //     },
    //     watch: {
    //         options: function (options) {
    //             $(this.$el).datetimepicker({ data: options })
    //         }
    //     },
    //     mounted: function () {
    //         var vm = this
    //         var mycomp = $(this.$el).datetimepicker({})
    //         mycomp.on('dp.change', function (e) {
    //             vm.value = e.date

    //             vm.$emit('change', vm.value);
    //             pipeService.emitDateSelected(vm.value);

    //         })
    //     },
    //     destroyed: function () {
    //         $(this.$el).off().datetimepicker('destroy')
    //     }
    // }

    export default {
        data() {
            return {
                pickerOptions1: {
                    shortcuts: [{
                        text: 'Today',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: 'Yesterday',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: 'A week ago',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                value1: '',
                value2: ''
            };
        },
        methods: {
            updatePicked: function(value){
                console.log(typeof value);
                pipeService.emitDatetimeSelected(value)
            }
        }
    };
</script>

<style>

</style>
