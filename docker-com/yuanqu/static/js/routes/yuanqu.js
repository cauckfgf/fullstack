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
    template:`<div style="width: 100%;  height: 80vh;">
        <v-chart style="width: 100%;  height: 100%;" :options="option" @click="chartClick"/>
        <Drawer
            title="修改"
            v-model="change_show"
            width="720"
            :mask-closable="false"
            :styles="styles"
        >
            <Form :model="selectDevice">
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="x坐标" label-position="top">
                            <InputNumber :max="200" :min="1" v-model="selectDevice.value[0]"></InputNumber>
                        </FormItem>
                        <FormItem label="y坐标" label-position="top">
                            <InputNumber :max="200" :min="1" v-model="selectDevice.value[1]"></InputNumber>
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
            selectDevice: {
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
                tooltip: {
                    trigger: 'item',
                    formatter: function(o) {
                        // debugger
                        // return o.name + "：" + o.value[2] + "起";
                        return o.name
                    }


                },
                xAxis: {gridIndex: 0, min: 0, max: 200,show: false},

                yAxis: {gridIndex: 0, min: 0, max: 200,show: false},

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
            }
        }
    },
    methods:{
       chartClick(event, instance, echarts){
            this.selectDevice = event.data
            this.change_show = true
            this.seriesIndex = event.seriesIndex
       },
       change_device(){
            this.change_show=false
            ajax({
                url:'/device/rest/device2device/setdevicepostion/',
                transformRequest: [function (data) {
                    return Qs.stringify(data, {
                        encode: false,
                        arrayFormat: 'brackets'
                    });
                }],
                data:{
                    x:this.selectDevice.value[0],
                    y:this.selectDevice.value[1],
                    system:1,
                    device:this.selectDevice.deviceid
                },
                method: 'post'
            }).then(res=>{
                this.init()
            })
    
       },
       init(){
            this.option.series=[]
            ajax({
                url:`/device/rest/device2device/`,
                method: 'get'
            }).then(res => {
                // this.zuijia_res[index].fkey={jin1:'',m:'',s:'',h:'',t:''}
                for(var i in res.data){
                      var d = res.data[i]
                      coords = [d.position_from.split(','),d.position_to.split(',')]
                      this.option.series.push({
                            type: 'lines',
                            zlevel: 1,
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
                                color: d.connection,
                            },
                            lineStyle: {
                                normal: {
                                    // color: '#a6c84c',
                                    width: 1,
                                    opacity: 0.4,
                                    curveness: 0.1
                                }
                            },

                            coordinateSystem:'cartesian2d',
                            data: [{
                                coords: coords,
                                lineStyle:{
                                    normal:{
                                       color: d.connection,
                                    }
                                },
                                name:d.line_lable,

                            }]
                    })
                }
            })
            ajax({
                url:`/device/rest/device/?system=1`,
                method: 'get'
            }).then(res => {
                
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
                    type = 'scatter'
                    if(d.status==2){
                        type = 'effectScatter'
                    }
                    this.option.series.push({
                        type: type,
                        // type: 'scatter',
                        coordinateSystem: 'cartesian2d',
                        zlevel: 1,
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

                        symbolSize: ['200','100'],
                        itemStyle: {
                            normal: {
                                color: '#0D6695',
                            }
                        },
                        data: data
                    })
                }
                
            })
       }
    },
    computed: {
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

