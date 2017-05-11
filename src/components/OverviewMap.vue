<template>
    <div class="overview-map-container">
        <div >This is a {{title}}</div>
            <div class="component-container">
                <div class="map-container">
                        <img src="http://itf170b.cse.ust.hk/images/map.png" style="width:100%; height: auto"> </img>
                        <station id="TUM" style="left: 9%; top: 21%; width: 13px; height: 9px; z-index: 106;"></station>
                        <station id="SIH" style="left: 9%; top: 13.3%; width: 13px; height: 9px; z-index: 107;"></station>
                        <station id="TIS" style="left: 9.9%; top: 4.6%; width: 13px; height: 9px; z-index: 108;"></station>
                        <station id="LOP" style="left: 12.5%; top: 7.6%; width: 9px; height: 9px; z-index: 109;"></station>
                        <station id="YUL" style="left: 12%; top: 12.3%; width: 13px; height: 9px; z-index: 110;"></station>
                        <station id="KSR" style="left: 12.5%; top: 17%; width: 9px; height: 9px; z-index: 111;"></station>
                        <station id="TWW" style="left: 13.8%; top: 23.6%; width: 9px; height: 9px; z-index: 112;"></station>
                        <station id="TSW" style="left: 13.8%; top: 28.3%; width: 9px; height: 9px; z-index: 113;"></station>
                        <station id="AWE" style="left: 15.1%; top: 40.6%; width: 9px; height: 9px; z-index: 114;"></station>
                        <station id="AIR" style="left: 13%; top: 44.8%; width: 9px; height: 9px; z-index: 115;"></station>
                        <station id="TUC" style="left: 15.3%; top: 49%; width: 9px; height: 9px; z-index: 172;"></station>
                        <station id="TWH" style="left: 19.3%; top: 28.4%; width: 9px; height: 9px; z-index: 117;"></station>
                        <station id="KWH" style="left: 23.6%; top: 28.4%; width: 9px; height: 9px; z-index: 118;"></station>
                        <station id="SUN" style="left: 21.3%; top: 41.5%; width: 12px; height: 12px; z-index: 119;"></station>
                        <station id="DIS" style="left: 24.2%; top: 48.2%; width: 9px; height: 9px; z-index: 120;"></station>
                        <station id="KET" style="left: 20.9%; top: 59.4%; width: 9px; height: 9px; z-index: 121;"></station>
                        <station id="KWF" style="left: 28%; top: 28.4%; width: 9px; height: 9px; z-index: 122;"></station>
                        <station id="TSY" style="left: 26.4%; top: 33.4%; width: 12px; height: 12px; z-index: 123;"></station>
                        <station id="HKU" style="left: 28.6%; top: 59.3%; width: 9px; height: 9px; z-index: 124;"></station>
                        <station id="LAK" style="left: 31.9%; top: 28.4%; width: 9px; height: 13px; z-index: 125;"></station>
                        <station id="KOW" style="left: 34.8%; top: 48.9%; width: 12px; height: 9px; z-index: 126;"></station>
                        <station id="SYP" style="left: 33.4%; top: 59.4%; width: 9px; height: 9px; z-index: 127;"></station>
                        <station id="OLY" style="left: 35.3%; top: 43%; width: 9px; height: 9px; z-index: 128;"></station>
                        <station id="NAC" style="left: 35.3%; top: 35.1%; width: 12px; height: 9px; z-index: 129;"></station>
                        <station id="MEF" style="left: 35.7%; top: 28.5%; width: 9px; height: 12px; z-index: 130;"></station>
                        <station id="LCK" style="left: 39.7%; top: 28.4%; width: 9px; height: 9px; z-index: 131;"></station>
                        <station id="AUS" style="left: 40.8%; top: 49.1%; width: 9px; height: 9px; z-index: 132;"></station>
                        <station id="HOK" style="left: 43.1%; top: 57.1%; width: 9px; height: 12px; z-index: 133;"></station>
                        <station id="SHW" style="left: 38.4%; top: 59.5%; width: 9px; height: 9px; z-index: 134;"></station>
                        <station id="CEN" style="left: 43.1%; top: 59.5%; width: 9px; height: 12px; z-index: 135;"></station>
                        <station id="CSW" style="left: 43.1%; top: 28.4%; width: 9px; height: 9px; z-index: 136;"></station>
                        <station id="SSP" style="left: 48.6%; top: 28.4%; width: 9px; height: 9px; z-index: 137;"></station>
                        <station id="PRE" style="left: 50.3%; top: 32.4%; width: 12px; height: 9px; z-index: 138;"></station>
                        <station id="MOK" style="left: 50.3%; top: 36.9%; width: 12px; height: 9px; z-index: 139;"></station>
                        <station id="YMT" style="left: 50.3%; top: 41.4%; width: 12px; height: 9px; z-index: 2;"></station>
                        <station id="JOR" style="left: 50.3%; top: 46%; width: 9px; height: 9px; z-index: 141;"></station>
                        <station id="TST" style="left: 50.3%; top: 50.1%; width: 9px; height: 9px; z-index: 142;"></station>
                        <station id="ADM" style="left: 47.6%; top: 59%; width: 9px; height: 14px; z-index: 143;"></station>
                        <station id="ETS" style="left: 51.6%; top: 51.8%; width: 9px; height: 9px; z-index: 144;"></station>
                        <station id="WAC" style="left: 53.6%; top: 59.5%; width: 9px; height: 9px; z-index: 145;"></station>
                        <station id="OCP" style="left: 50.3%; top: 66.9%; width: 9px; height: 9px; z-index: 146;"></station>
                        <station id="WCH" style="left: 45.9%; top: 69%; width: 9px; height: 9px; z-index: 147;"></station>
                        <station id="CAB" style="left: 58.1%; top: 59.5%; width: 9px; height: 9px; z-index: 148;"></station>
                        <station id="HUH" style="left: 57.5%; top: 50.9%; width: 12px; height: 9px; z-index: 149;"></station>
                        <station id="WHA" style="left: 63.6%; top: 50.2%; width: 9px; height: 9px; z-index: 150;"></station>
                        <station id="HOM" style="left: 60.9%; top: 46.7%; width: 9px; height: 9px; z-index: 151;"></station>
                        <station id="MKK" style="left: 57.8%; top: 37.6%; width: 9px; height: 9px; z-index: 152;"></station>
                        <station id="TIH" style="left: 62.8%; top: 59.5%; width: 9px; height: 9px; z-index: 153;"></station>
                        <station id="SKM" style="left: 54.2%; top: 28.4%; width: 9px; height: 9px; z-index: 154;"></station>
                        <station id="KOT" style="left: 57.7%; top: 28.4%; width: 9px; height: 12px; z-index: 155;"></station>
                        <station id="TAW" style="left: 57.7%; top: 22.5%; width: 13px; height: 9px; z-index: 156;"></station>
                        <station id="SHT" style="left: 57.7%; top: 17.7%; width: 9px; height: 9px; z-index: 157;"></station>
                        <station id="FOT" style="left: 57.7%; top: 12.3%; width: 9px; height: 9px; z-index: 158;"></station>
                        <station id="RAC" style="left: 59.2%; top: 12.3%; width: 9px; height: 9px; z-index: 159;"></station>
                        <station id="LOF" style="left: 61.1%; top: 28.4%; width: 9px; height: 9px; z-index: 160;"></station>
                        <station id="FOH" style="left: 67.4%; top: 59.5%; width: 9px; height: 9px; z-index: 161;"></station>
                        <station id="WTS" style="left: 66%; top: 28.4%; width: 9px; height: 9px; z-index: 162;"></station>
                        <station id="CKT" style="left: 64.5%; top: 17.5%; width: 9px; height: 9px; z-index: 163;"></station>
                        <station id="STW" style="left: 64.5%; top: 12.3%; width: 9px; height: 9px; z-index: 164;"></station>
                        <station id="CIO" style="left: 67.6%; top: 5.1%; width: 9px; height: 9px; z-index: 165;"></station>
                        <station id="SHM" style="left: 72.1%; top: 5.1%; width: 9px; height: 9px; z-index: 166;"></station>
                        <station id="TSH" style="left: 76.9%; top: 5.1%; width: 9px; height: 9px; z-index: 167;"></station>
                        <station id="HEO" style="left: 81.5%; top: 5.1%; width: 9px; height: 9px; z-index: 168;"></station>
                        <station id="MOS" style="left: 86.4%; top: 5.1%; width: 9px; height: 9px; z-index: 169;"></station>
                        <station id="DIH" style="left: 70.9%; top: 28.4%; width: 9px; height: 9px; z-index: 170;"></station>
                        <station id="CHH" style="left: 75.7%; top: 28.4%; width: 9px; height: 9px; z-index: 171;"></station>
                        <station id="KOB" style="left: 79%; top: 29.7%; width: 9px; height: 9px; z-index: 172;"></station>
                        <station id="NTK" style="left: 79.4%; top: 33.3%; width: 9px; height: 9px; z-index: 173;"></station>
                        <station id="KWT" style="left: 79.4%; top: 38%; width: 9px; height: 9px; z-index: 174;"></station>
                        <station id="LAT" style="left: 79.4%; top: 42.4%; width: 9px; height: 9px; z-index: 175;"></station>
                        <station id="YAT" style="left: 81.9%; top: 45.2%; width: 9px; height: 12px; z-index: 176;"></station>
                        <station id="QUB" style="left: 77.5%; top: 59%; width: 9px; height: 12px; z-index: 177;"></station>
                        <station id="NOP" style="left: 72.5%; top: 59%; width: 9px; height: 12px; z-index: 178;"></station>
                        <station id="TAK" style="left: 82.2%; top: 59.5%; width: 9px; height: 9px; z-index: 179;"></station>
                        <station id="TIK" style="left: 86%; top: 45.2%; width: 9px; height: 12px; z-index: 180;"></station>
                        <station id="WKS" style="left: 92.5%; top: 5.1%; width: 9px; height: 9px; z-index: 181;"></station>
                        <station id="SWH" style="left: 86.6%; top: 59.5%; width: 9px; height: 9px; z-index: 182;"></station>
                        <station id="POA" style="left: 92.5%; top: 33.8%; width: 9px; height: 9px; z-index: 183;"></station>
                        <station id="HAH" style="left: 92.5%; top: 38.7%; width: 9px; height: 9px; z-index: 184;"></station>
                        <station id="TKO" style="left: 90.1%; top: 45.7%; width: 9px; height: 12px; z-index: 185;"></station>
                        <station id="LHP" style="left: 92.5%; top: 51.8%; width: 9px; height: 9px; z-index: 186;"></station>
                        <station id="SKW" style="left: 91.3%; top: 64.0%; width: 9px; height: 9px; z-index: 187;"></station>
                        <station id="HFC" style="left: 92.5%; top: 69.5%; width: 9px; height: 9px; z-index: 188;"></station>
                        <station id="CHW" style="left: 92.5%; top: 74.6%; width: 9px; height: 9px; z-index: 189;"></station>
                        <station id="SOH" style="left: 30.8%; top: 72.2%; width: 9px; height: 9px; z-index: 190;"></station>
                        <station id="LET" style="left: 37.5%; top: 72.2%; width: 9px; height: 9px; z-index: 191;"></station>
                        <station id="LMC" style="left: 31.3%; top: 7.4%; width: 9px; height: 9px; z-index: 192;"></station>
                        <station id="LOW" style="left: 34.2%; top: 5.1%; width: 9px; height: 9px; z-index: 193;"></station>
                        <station id="SHS" style="left: 38.6%; top: 5.1%; width: 9px; height: 12px; z-index: 194;"></station>
                        <station id="FAN" style="left: 41.9%; top: 5.1%; width: 9px; height: 9px; z-index: 195;"></station>
                        <station id="TWO" style="left: 46%; top: 5.1%; width: 9px; height: 9px; z-index: 196;"></station>
                        <station id="TAP" style="left: 50.2%; top: 5.1%; width: 9px; height: 9px; z-index: 197;"></station>
                        <station id="UNI" style="left: 54.9%; top: 5.1%; width: 9px; height: 9px; z-index: 198;"></station>
                    </div>
                </div>
                <div class="col-md-4">
                    <label>Please select a date and a timestamp that you would like to review:</label>
                    <datetimepicker></datetimepicker>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import station from './StationsPoints.vue';
    import datetimepicker from './DatetimePicker.vue';
    export default {
        name: 'OverviewMap',
        components: {
            station,
            "datetimepicker": datetimepicker
        },
        data(){
            return {
                title: 'OverviewMap',
            }
        }
    }
</script>

<style>
    .overview-map-container{
        background-color: #4fb699;
        /*height: 100%*/
    }

    .map-container{
        position: relative;
        width: 80%;
        margin:0 auto
    }

    .components-container{
        line-height: 300%;
    }

    .col-md-4{
        line-height: 250%;
        margin-left: 9%;
    }

</style>
