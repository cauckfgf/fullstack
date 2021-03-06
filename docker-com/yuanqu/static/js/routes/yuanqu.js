ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
const yuanqu = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">
        编辑模式
        <i-switch v-model="editable">
            <span slot="open">开</span>
            <span slot="close">关</span>
        </i-switch>
        <v-chart autoresize style="width: 100%;  height: 100%;" :options="option" @click="chartClick"   ref="chart" :style="styleObject"/>
        <Drawer
            title="修改"
            v-model="change_show"
            width="720"
            :mask-closable="false"
            :styles="styles"
            draggable
            placement='left'
        >
            <Form :model="select_obj">
                <Row :gutter="32">
                    <Col span="12"  v-if="select_obj.type!='lines'">
                        <FormItem label="x坐标" label-position="top">
                            <InputNumber :max="200" :min="1" v-model="select_obj.value[0]"></InputNumber>
                        </FormItem>
                        <FormItem label="y坐标" label-position="top">
                            <InputNumber :max="200" :min="1" v-model="select_obj.value[1]"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="12"  v-else>
                        <FormItem  label-position="top" v-for='(item,index) in select_obj.coords'  :key="index" :label="index|formatLable">
                            <InputNumber :max="400" :min="1" v-model="item[0]" :disabled="index==0||index==select_obj.coords.length-1"></InputNumber>
                            <InputNumber :max="400" :min="1" v-model="item[1]" :disabled="index==0||index==select_obj.coords.length-1"></InputNumber>

                            <ButtonGroup>
                                <Button type="dashed" v-if="index!=select_obj.coords.length-1" @click="addPoint(index)">+</Button>
                                <Button type="dashed" v-if="index!=0 && index!=select_obj.coords.length-1" @click="delPoint(index)">-</Button>
                            </ButtonGroup>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="change_show = false">取消</Button>
                <Button type="primary" @click="change_device">确定</Button>
            </div>
        </Drawer>
    </div>`,

    data(){
        return {
            change_show:false,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            select_obj: {
                value: [],
            },
            seriesIndex:0,
            planePath : 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',

            option : {
                // backgroundColor: '#1b1b1b',
                title: {
                    text: '空调系统',
                    left: '-5',
                    top: '10px',
                    textStyle: {
                        color: '#ffffff',
                        fontFamily: '微软雅黑',
                        fontWeight: 'lighter',
                        fontSize: 18
                    }
                },
                dataZoom: [
                    {
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 50
                    },
                    {
                        type: 'inside',
                        show: true,
                        yAxisIndex: [0],
                        // left: '93%',
                        start: 0,
                        end: 50
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 0,
                        end: 50
                    },
                    {
                        type: 'inside',
                        yAxisIndex: [0],
                        start: 0,
                        end: 50
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    formatter: function(o) {
                        // debugger
                        // return o.name + "：" + o.value[2] + "起";
                        return o.name
                    }


                },
                xAxis: {gridIndex: 0, min: 0, max: 400,show: false},

                yAxis: {gridIndex: 0, min: 0, max: 400,show: false},

                // geo: {
                //     map: 'wuhan',
                //     label: {
                //         emphasis: {
                //             show: false
                //         }
                //     },
                //     roam: true,
                //     itemStyle: {
                //         normal: {
                //           color:'rgba(22,22,2,0)',
                //           areaColor:'rgba(22,22,2,0)',
                //                 borderColor:'rgba(22,22,2,0)'
                          
                //         },
                //         emphasis: {
                          
                //             color:'rgba(22,22,2,0)',
                //           areaColor:'rgba(22,22,2,0)',
                //                 borderColor:'rgba(22,22,2,0)'
                //         }
                //     }
                // },
                series: []
            },
            chart:null,
            choosing:false,
            styleObject:{
                cursor:'default'
            },
            addindex:0,
            editable:false,

        }
    },
    filters: {
        formatLable: function(data) {
            return `点位${data}`
        }
    },
    methods:{
        choosPoint(){
            if(this.choosing){
                this.chart.getZr().setCursorStyle('crosshair');
            }
            
        },
        addPoint(i){
            this.choosing=true
            this.change_show = false
            
            this.select_obj.coords.splice(i+1, 0, [190,190]);
            this.addindex = i+1
            // this.chart.on('mousemove', this.choosPoint);
        },
        delPoint(i){
            this.select_obj.coords.splice(i, 1);
            this.option.series[this.seriesIndex].data[0].coords = this.select_obj.coords
        },
        chartClick(event, instance, echarts){
            this.select_obj = event.data
            this.select_obj.type = event.seriesType 
            if(this.editable){
                this.change_show = true
            }
            
            this.seriesIndex = event.seriesIndex
        },
        chartClickNull(pa){
            if(this.choosing){
                this.choosing=false
                var r = this.chart.convertFromPixel({xAxisIndex: 0, yAxisIndex: 0}, [pa.offsetX, pa.offsetY]);
                // 鼠标点击位置对应xy 坐标值
                
                this.select_obj.coords[this.addindex] = r
                this.option.series[this.seriesIndex].data[0].coords = this.select_obj.coords
                this.change_show=true
            }
            
        },
        change_device(){
            this.change_show=false
            if(this.select_obj.type!='lines'){
                ajax({
                    url:'/device/rest/device2device/setdevicepostion/',
                    transformRequest: [function (data) {
                        return Qs.stringify(data, {
                            encode: false,
                            arrayFormat: 'brackets'
                        });
                    }],
                    data:{
                        x:this.select_obj.value[0],
                        y:this.select_obj.value[1],
                        system:1,
                        device:this.select_obj.deviceid
                    },
                    method: 'post'
                }).then(res=>{
                    this.init()
                })
            }else{
                var b=[]

                for(var i in this.select_obj.coords){
                    if(i!=0 &&i !=this.select_obj.coords.length-1){
                        b.push(this.select_obj.coords[i])
                    }
                }
                ajax({
                    url:`/device/rest/device2device/${this.option.series[this.seriesIndex].device2deviceid}/`,
                    data:{
                        mid:JSON.stringify(b)
                    },
                    method: 'PATCH'
                }).then(res=>{
                    
                    this.init()
                })
            }
            
    
        },
        init(){
            if (this.chart) {
                this.chart.showLoading({
                    text: '加载中',
                    color: '#eeeeeeee',
                    textColor: '#111111',
                    maskColor: 'rgba(0, 0, 0, 0.9)',
                })
            }
            var p1 = new Promise((resolve,reject)=>{
                ajax({
                    url:`/device/rest/device2device/`,
                    method: 'get'
                }).then(res => {
                    resolve(res)
                })
            })
            var p2 = new Promise((resolve,reject)=>{
                ajax({
                    url:`/device/rest/device/?system=1`,
                    method: 'get'
                }).then(res => {
                    resolve(res)
                })
            })
            Promise.all([p1, p2]).then((ress)=>{
                this.option.series=[]
                var res = ress[0]
                for(var i in res.data){
                      var d = res.data[i]
                      coords = d.path_list
                      this.option.series.push({
                            type: 'lines',
                            zlevel: 1,
                            device2deviceid:d.id,
                            // effect: {
                            //     show: true,
                            //     period: 3,
                            //     trailLength: 0,
                            //     //symbol: 'image://',
                            //     symbol: this.planePath,
                            //     symbolSize: 15
                            // },
                            effect: {
                                period: 3,
                                // constantSpeed: 50,
                                show: true,
                                trailLength: 0.1,
                                symbolSize: 8,
                                color: d.line.sensor_status,
                            },
                            polyline:true,//是否为多线段
                            lineStyle: {
                                normal: {
                                    // color: '#a6c84c',
                                    width: 1,
                                    opacity: 0.4,
                                    curveness: 0.1//曲线弯曲
                                }
                            },

                            coordinateSystem:'cartesian2d',
                            data: [{
                                coords: coords,
                                lineStyle:{
                                    normal:{
                                       color: d.line.sensor_status
                                    }
                                },
                                name:d.line.label,

                            }]
                    })
                }
                res = ress[1]
                for(var i in res.data.results){
                    var d = res.data.results[i]
                    var data = []
                    data.push({
                        name: d.name,
                        value: d.postion,
                        symbol: `image://${d.icon}`,
                        deviceid:d.id,
                        sensors:d.sensors
                        // shortname: d.name
                                            // symbol: 'image:'+weixin
                    })
                    var type = 'scatter'
                    var symbolSize = [200,100] 
                    if(d.status==2){
                        type = 'effectScatter'
                        symbolSize = [150,75] 
                    }
                    this.option.series.push({
                        type: type,
                        // type: 'scatter',
                        coordinateSystem: 'cartesian2d',
                        zlevel: 2,
                        rippleEffect: {
                            period: 4,
                            scale: 2.5,
                            brushType: 'stroke'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function(o) {
                                // debugger
                                // return o.name + "：" + o.value[2] + "起";
                                r = `<span style="text-shadow:0px 0px 2px  blue;font-weight: bolder;font-size:1.2rem">${o.name}</span>`
                                for(var i in o.data.sensors){
                                    var s =  o.data.sensors[i]
                                    if(s.status==0){
                                        r += `<br /><span style="text-shadow:0px 0px 2px  red;">${s.name}:${s.lastdata}${s.unit}</span>`
                                    }else{
                                        r += `<br /><span style="text-shadow:0px 0px 2px  green;">${s.name}:${s.lastdata}${s.unit}</span>`
                                    }
                                    
                                }
                                return r
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                formatter: function(o) {
                                    // debugger
                                    // return o.name + "：" + o.value[2] + "起";
                                    return o.data.name
                                }
                            }
                        },

                        symbolSize: symbolSize,
                        itemStyle: {
                            normal: {
                                color: '#0D6695',
                                opacity:1//透明度
                            }
                        },
                        data: data
                    })
                }
                if (this.chart) {
                    this.chart.hideLoading ()
                }
            })
            // var aj1 = ajax({
            //     url:`/device/rest/device2device/`,
            //     method: 'get'
            // }).then(res => {
            //     // this.zuijia_res[index].fkey={jin1:'',m:'',s:'',h:'',t:''}
            //     for(var i in res.data){
            //           var d = res.data[i]
            //           coords = d.path_list
            //           this.option.series.push({
            //                 type: 'lines',
            //                 zlevel: 1,
            //                 device2deviceid:d.id,
            //                 // effect: {
            //                 //     show: true,
            //                 //     period: 3,
            //                 //     trailLength: 0,
            //                 //     //symbol: 'image://',
            //                 //     symbol: this.planePath,
            //                 //     symbolSize: 15
            //                 // },
            //                 effect: {
            //                     period: 3,
            //                     // constantSpeed: 50,
            //                     show: true,
            //                     trailLength: 0.1,
            //                     symbolSize: 8,
            //                     color: d.line.sensor_status,
            //                 },
            //                 polyline:true,//是否为多线段
            //                 lineStyle: {
            //                     normal: {
            //                         // color: '#a6c84c',
            //                         width: 1,
            //                         opacity: 0.4,
            //                         curveness: 0.1//曲线弯曲
            //                     }
            //                 },

            //                 coordinateSystem:'cartesian2d',
            //                 data: [{
            //                     coords: coords,
            //                     lineStyle:{
            //                         normal:{
            //                            color: d.line.sensor_status
            //                         }
            //                     },
            //                     name:d.line.label,

            //                 }]
            //         })
            //     }
            // })
            // var aj1 = ajax({
            //     url:`/device/rest/device/?system=1`,
            //     method: 'get'
            // }).then(res => {
                
            //     for(var i in res.data.results){
            //         var d = res.data.results[i]
            //         var data = []
            //         data.push({
            //             name: d.name,
            //             value: d.postion,
            //             symbol: `image://${d.icon}`,
            //             deviceid:d.id,
            //             sensors:d.sensors
            //             // shortname: d.name
            //                                 // symbol: 'image:'+weixin
            //         })
            //         type = 'scatter'
            //         if(d.status==2){
            //             type = 'effectScatter'
            //         }
            //         this.option.series.push({
            //             type: type,
            //             // type: 'scatter',
            //             coordinateSystem: 'cartesian2d',
            //             zlevel: 2,
            //             rippleEffect: {
            //                 period: 4,
            //                 scale: 2.5,
            //                 brushType: 'stroke'
            //             },
            //             tooltip: {
            //                 trigger: 'item',
            //                 formatter: function(o) {
            //                     // debugger
            //                     // return o.name + "：" + o.value[2] + "起";
            //                     r = `<span style="text-shadow:0px 0px 2px  blue;font-weight: bolder;font-size:1.2rem">${o.name}</span>`
            //                     for(var i in o.data.sensors){
            //                         var s =  o.data.sensors[i]
            //                         if(s.status==0){
            //                             r += `<br /><span style="text-shadow:0px 0px 2px  red;">${s.name}:${s.lastdata}${s.unit}</span>`
            //                         }else{
            //                             r += `<br /><span style="text-shadow:0px 0px 2px  green;">${s.name}:${s.lastdata}${s.unit}</span>`
            //                         }
                                    
            //                     }
            //                     return r
            //                 }
            //             },
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'bottom',
            //                     formatter: function(o) {
            //                         // debugger
            //                         // return o.name + "：" + o.value[2] + "起";
            //                         return o.data.name
            //                     }
            //                 }
            //             },

            //             symbolSize: ['200','100'],
            //             itemStyle: {
            //                 normal: {
            //                     color: '#0D6695',
            //                     opacity:1//透明度
            //                 }
            //             },
            //             data: data
            //         })
            //     }
                
            // })


        }
    },
    computed: {
    },
    mounted(){
        this.chart = this.$refs.chart.chart
        var zr = this.chart.getZr()
        zr.on('click',this.chartClickNull)
        zr.on('mousemove',this.choosPoint)
    },
    created(){
        this.init()

        // // 动态线
        // this.option.series.push({
        //     type: 'lines',
        //     zlevel: 1,
        //     effect: {
        //         show: true,
        //         period: 3,
        //         trailLength: 0.1,
        //         color: '#A6C84C',
        //         symbolSize: 8
        //     },
        //     lineStyle: {
        //         normal: {
        //             color: 'red',
        //             width: 0,
        //             curveness: 0.2
        //         }
        //     },
        //     coordinateSystem:'cartesian2d',
        //     data: [
        //         {
        //             coords: [this.geoCoordMap['二次循环泵'], this.geoCoordMap['监控中心']],
        //         }, {

        //             coords: [this.geoCoordMap['分水器'], this.geoCoordMap['监控中心']]
        //         }, {

        //             coords: [this.geoCoordMap['集水器'], this.geoCoordMap['监控中心']]
        //         }, {

        //             coords: [this.geoCoordMap['空压机'], this.geoCoordMap['监控中心']]
        //         }
        //     ]
        // })
        // 静态线
        // this.option.series.push({
        //     type: 'lines',
        //     zlevel: 2,
        //     // effect: {
        //     //     show: true,
        //     //     period: 3,
        //     //     trailLength: 0,
        //     //     //symbol: 'image://',
        //     //     symbol: this.planePath,
        //     //     symbolSize: 15
        //     // },
        //     effect: {
        //         period: 3,
        //         // constantSpeed: 50,
        //         show: true,
        //         trailLength: 0.1,
        //         symbolSize: 8,
        //         color: '#a6c84c',
        //     },
        //     lineStyle: {
        //         normal: {
        //             // color: '#a6c84c',
        //             width: 1,
        //             opacity: 0.4,
        //             curveness: 0.1
        //         }
        //     },
        //     coordinateSystem:'cartesian2d',
        //     data: [{
        //         coords: [this.geoCoordMap['二次循环泵'], this.geoCoordMap['监控中心']],
        //         lineStyle:{
        //             normal:{
        //                color: '#0D6695', 
        //             }
        //         }
        //     }, {

        //         coords: [this.geoCoordMap['分水器'], this.geoCoordMap['监控中心']],
        //         lineStyle:{
        //             normal:{
        //                color: 'red', 
        //             }
        //         }
        //     },{

        //         coords: [this.geoCoordMap['监控中心'], this.geoCoordMap['分水器']],
        //         lineStyle:{
        //             normal:{
        //                color: '#0D6695', 
        //             }
        //         }
        //     }, {

        //         coords: [this.geoCoordMap['集水器'], this.geoCoordMap['监控中心']],
        //         lineStyle:{
        //             normal:{
        //                color: 'red', 
        //             }
        //         }
        //     }, {

        //         coords: [this.geoCoordMap['空压机'], this.geoCoordMap['集水器']],
        //         lineStyle:{
        //             normal:{
        //                color: 'red', 
        //             }
        //         }
        //     }]
        // })
        
        // this.option.series.push({
        //     // type: 'effectScatter',
        //     type: 'scatter',
        //     coordinateSystem: 'cartesian2d',
        //     zlevel: 2,
        //     rippleEffect: {
        //         period: 4,
        //         scale: 2.5,
        //         brushType: 'stroke'
        //     },
        //     label: {
        //         normal: {
        //             show: true,
        //             position: 'bottom',
        //             formatter: '{b}'
        //         }
        //     },

        //     symbolSize: '100',
        //     itemStyle: {
        //         normal: {
        //             color: '#0D6695',
        //         }
        //     },
        //     data: [{
        //         name: '二次循环泵',
        //         value: this.geoCoordMap['二次循环泵'].concat(this.data.二次循环泵),
        //         symbol: 'image:///static/image/二次循环泵.jpg'
        //                             // symbol: 'image:'+weixin
        //     }, {
        //         name: '分水器',
        //         value: this.geoCoordMap['分水器'].concat(this.data.分水器),
        //         symbol: 'image:///static/image/分水器.jpg'
        //     }, {
        //         name: '集水器',
        //         value: this.geoCoordMap['集水器'].concat(this.data.集水器),
        //         symbol: 'image:///static/image/集水器.jpg'
        //     }, {
        //         name: '空压机',
        //         value: this.geoCoordMap['空压机'].concat(this.data.空压机),
        //         symbol: 'image:///static/image/空压机.jpg'
        //     }, {
        //         name: '监控中心',
        //         value: this.geoCoordMap['监控中心'].concat(100),
        //         // itemStyle: {
        //         //     normal: {
        //         //         color: '#ffffff',
        //         //         borderColor: '#000'
        //         //     }
        //         // },
        //        symbol: 'image:///static/image/二次循环泵.jpg'
        //     }]
        // })
    },

}

