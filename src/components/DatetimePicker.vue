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
        v-on:change="updateStyles">
    </el-date-picker>
</div>
</template>

<script>
    import pipeService from '../service/pipeService';
    import dataService from '../service/dataService';

    export default {
        data() {
            let _this = this
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
                value2: '',
                stationCounts: 'aaa'
            };
        },
        methods: {
            updateStyles: function(){
                var dt = this.value2;
                var hour = dt.getHours();
                var minu = dt.getMinutes();
                var day = dt.getDay();
                var time = (hour - 8) * 12 + Math.floor(minu / 5);
                this.stationCounts = dataService.readPeopleCount(day, time);
                pipeService.emitDatetimeSelected(this.stationCounts);
            }
        }
    };
</script>

<style scope>

</style>
