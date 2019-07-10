ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});

const system = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">
        <Split v-model="split1">
            
            <div slot="left" class="demo-split-pane">
                <Card>
                    <p slot="title">
                        <a @click="back" title="切换院区"><Icon type="ios-home" />
                        {{yuanqu}}院区</a>
                    </p>
                    <div slot="extra">
                        <span style="margin-left:20px">编辑模式</span>
                        <i-switch v-model="editable">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </div>
                    <Tree :data="systemData" @on-select-change='systemChange' style="margin-left:15px"></Tree>
                </Card>
            </div>
            <div slot="right" style="width: 100%;  height: 100%;">

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
                                    <InputNumber :max="400"  v-model="select_obj.value[0]"></InputNumber>
                                </FormItem>
                                <FormItem label="y坐标" label-position="top">
                                    <InputNumber :max="400"  v-model="select_obj.value[1]"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col span="12"  v-else>
                                <FormItem  label-position="top" v-for='(item,index) in select_obj.coords'  :key="index" :label="index|formatLable">
                                    <InputNumber :max="400"  v-model="item[0]" :disabled="index==0||index==select_obj.coords.length-1"></InputNumber>
                                    <InputNumber :max="400"  v-model="item[1]" :disabled="index==0||index==select_obj.coords.length-1"></InputNumber>

                                    <ButtonGroup>
                                        <Button type="dashed" v-if="index!=select_obj.coords.length-1" @click="addPoint(index)">+</Button>
                                        <Button type="dashed" v-if="index!=0 && index!=select_obj.coords.length-1" @click="delPoint(index)">-</Button>
                                    </ButtonGroup>
                                </FormItem>
                                <FormItem  label-position="top" label="监测点位">
                                    <Select v-model="select_obj.sensor" style="width:200px">
                                        <Option v-for="item in sensors" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>

                        </Row>
                    </Form>
                    <div class="demo-drawer-footer">
                        <Button style="margin-right: 8px" @click="change_show = false">取消</Button>
                        <Button type="primary" @click="change_device">确定</Button>
                    </div>
                </Drawer>
                <Drawer
                    :title="title"
                    v-model="gongdan_show"
                    width="720"
                    :mask-closable="false"
                    :styles="styles"
                    draggable
                    placement='left'
                >
                    <Tabs value="维修">
                        <TabPane label="维修" name="维修">
                            <Table height="500" :columns="columns_weixiu" :data="data_weixiu"></Table>
                        </TabPane>
                        <TabPane label="维保" name="维保">
                            <Table height="500" :columns="columns_weixiu" :data="data_weixiu"></Table>
                        </TabPane>
                        <TabPane label="报警" name="报警">
                            <Table height="500" :columns="columns_weixiu" :data="data_weixiu"></Table>
                        </TabPane>
                    </Tabs>
                </Drawer>
            </div>
        </Split>
    </div>`,

    data(){
        return {
            CancelToken:null,
            source:null,
            t1:null,//定时更新数据定时器
            count:0,//update 更新次数计数器
            yuanqu:'',
            sensors:[],//选中线的来源设备的传感器
            columns_weixiu:[
                {
                    title: '工单',
                    key: 'describe'
                },
                {
                    title: '截止日期',
                    key: 'date',
                    width:150
                },
                {
                    title: '负责人',
                    key: 'people',
                    width:150
                },
                {
                    title: '状态',
                    key: 'status',
                    width:150
                }
            ],//维修工单
            data_weixiu:[
                {
                    describe: '1#空压机入水口异常',
                    people: '张三',
                    date: '2016-10-03',
                    status: '维修中'
                },
                {
                    describe: '4#水塔水位过高报警',
                    people: '李四',
                    date: '2016-10-03',
                    status: '已关闭'
                },
            ],
            change_show:false,//抽屉1
            gongdan_show:false,//抽屉2
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
            split1:0.15,
            systemData:[
                {
                    title: '1#楼',
                    expand: true,
                    // disabled:true,
                    children:[
                        {
                            title: '空调系统',
                            sid : 1,
                            selected:true
                        },
                        {
                            title: '空压机系统',
                            sid : 2,
                        },
                    ]
                },
                {
                    title: '2#楼',
                    expand: true,
                    // disabled:true,
                    children:[
                        {
                            title: '空调系统',
                            sid : 1,
                        },
                        {
                            title: '空压机系统',
                            sid : 2,
                        },
                    ]
                },
                {
                    title: '3#楼',
                    expand: true,
                    // disabled:true,
                    children:[
                        {
                            title: '空调系统',
                            sid : 1,
                        },
                        {
                            title: '空压机系统',
                            sid : 2,
                        },
                    ]
                },
                {
                    title: '4#楼',
                    expand: true,
                    // disabled:true,
                    children:[
                        {
                            title: '空调系统',
                            sid : 1,
                        },
                        {
                            title: '空压机系统',
                            sid : 2,
                        },
                    ]
                },
            ],
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

                yAxis: {gridIndex: 0, min: -20, max: 400,show: false},

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
            system:1,
            title:''//工单抽屉标题

        }
    },
    filters: {
        formatLable: function(data) {
            return `点位${data}`
        }
    },
    methods:{
        back(){
            this.$router.push('/')
            _app.show=true;
        },
        systemChange(point){

            this.system = point[0].sid
            if(this.system!=undefined){
                this.init()
            }
            
            // console.log(point)
        },
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
        getLineSensor(){
            
            if(this.select_obj.type=='lines'){
                this.select_obj.sensor = this.option.series[this.seriesIndex].sensor
                var deviceid = this.option.series[this.seriesIndex].fromDevice
                for(var i in this.option.series){
                    var s = this.option.series[i]
                    if(s.type!='lines'){
                        for(var j in s.data){
                            console.log(s.data[j].deviceid)
                            if(s.data[j].deviceid==deviceid){
                                this.sensors = s.data[j].sensors
                                return 
                            }
                        }

                    }

                }
            }
            
        },
        chartClick(event, instance, echarts){
            this.select_obj = event.data
            
            this.select_obj.type = event.seriesType 
            if(this.editable){
                // 编辑抽屉
                this.change_show = true
            }else{
                // 工单抽屉
                this.gongdan_show = true
            }
            this.title = this.select_obj.name + '工单'
            this.seriesIndex = event.seriesIndex
            this.getLineSensor()
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
                        system:this.system,
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
                        mid:JSON.stringify(b),
                        sensor:this.select_obj.sensor
                    },
                    method: 'PATCH'
                }).then(res=>{
                    
                    this.init()
                })
            }
            
    
        },
        init(){
            
            // if(system.system=='1#楼' || system.system=='2#楼'){
            //     this.system=1
            // }else{
            //     this.system=2
            // }
            this.source&&this.source.cancel('取消上个请求')

            this.count=0
            if(this.t1){
                window.clearInterval(this.t1); 
            }
            if (this.chart) {
                // this.chart.showLoading({
                //     text: '加载中',
                //     color: '#eeeeeeee',
                //     textColor: '#111111',
                //     maskColor: 'rgba(0, 0, 0, 0.9)',
                // })
                // this.$refs.chart.clear()
            }
            var p1 = new Promise((resolve,reject)=>{
                ajax({
                    url:`/device/rest/device2device/?system=${this.system}`,
                    method: 'get'
                }).then(res => {
                    resolve(res)
                })
            })
            var p2 = new Promise((resolve,reject)=>{
                ajax({
                    url:`/device/rest/device/?system=${this.system}`,
                    method: 'get'
                }).then(res => {
                    resolve(res)
                })
            })
            Promise.all([p1, p2]).then((ress)=>{
                if(this.chart){
                    this.$refs.chart.clear()
                }
                this.option.series=[]
                var series = []
                var res = ress[0]
                for(var i in res.data){
                      var d = res.data[i]
                      coords = d.path_list
                      series.push({
                            type: 'lines',
                            zlevel: 1,
                            device2deviceid:d.id,
                            sensor:d.sensor,//自定义字段
                            fromDevice:d.device_from,
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
                            label: {
                                normal: {
                                    show: true,
                                    position: 'bottom',
                                    formatter: function(o) {
                                        debugger
                                        // return o.name + "：" + o.value[2] + "起";
                                        return o.data[0].name
                                    }
                                }
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
                        symbol: `image://${d.icon[0]}`,
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
                    series.push({
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
                                    if(s.status!=1){
                                        r += `<br /><span style="text-shadow:0px 0px 2px  red;">${s.name}:${s.lastdata}${s.unit}</span>`
                                    }else{
                                        r += `<br /><span style="text-shadow:0px 0px 2px  green;">${s.name}:${s.lastdata}${s.unit}</span>`
                                    }
                                    
                                }
                                return r
                            }
                        },
                        animation:false,
                        symbol : 'image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562565407150&di=0eaa1f1dc340a7e3b3e477adf3485c19&imgtype=0&src=http%3A%2F%2Fdemo.lanrenzhijia.com%2Fdemo%2F49%2F4936%2F1.jpg',
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                fontWeight :'bold',
                                fontSize: 15,
                                // borderWidth: 1.5,
                                textBorderColor :'#2196f3',
                                color :'#fff',
                                textBorderWidth  :3,
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
                this.option.series = series
                if (this.chart) {
                    // this.chart.hideLoading ()
                }
                this.t1 = window.setInterval(this.update,3000)
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
        },
        update(){
            this.source&&this.source.cancel('取消上个请求')
            this.source = this.CancelToken.source()
            var p1 = new Promise((resolve,reject)=>{
                ajax.get(`/device/rest/device2device/?system=${this.system}`, {cancelToken: this.source.token}).then(res => {
                    resolve(res)
                })
            })
            var p2 = new Promise((resolve,reject)=>{
                ajax.get(`/device/rest/device/?system=${this.system}`,{cancelToken: this.source.token}).then(res => {
                    resolve(res)
                })
            })
            Promise.all([p1, p2]).then((ress)=>{
                this.option.series=[]
                var series = []
                var res = ress[0]
                for(var i in res.data){
                      var d = res.data[i]
                      coords = d.path_list
                      series.push({
                            type: 'lines',
                            zlevel: 1,
                            device2deviceid:d.id,
                            sensor:d.sensor,//自定义字段
                            fromDevice:d.device_from,
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
                            label: {
                                normal: {
                                    show: true,
                                    position: 'bottom',
                                    formatter: function(o) {
                                        debugger
                                        // return o.name + "：" + o.value[2] + "起";
                                        return o.data[0].name
                                    }
                                }
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
                    if(d.isrun){
                        data.push({
                            name: d.name,
                            value: d.postion,
                            symbol: `image://${d.icon[this.count%d.icon.length]}`,
                            deviceid:d.id,
                            sensors:d.sensors
                            // shortname: d.name
                                                // symbol: 'image:'+weixin
                        })
                    }else{
                        data.push({
                            name: d.name,
                            value: d.postion,
                            symbol: `image://${d.icon[0]}`,
                            deviceid:d.id,
                            sensors:d.sensors
                            // shortname: d.name
                                                // symbol: 'image:'+weixin
                        })
                    }
                        
                    var type = 'scatter'
                    var symbolSize = [200,100] 
                    if(d.status==2){
                        type = 'effectScatter'
                        symbolSize = [150,75] 
                    }
                    series.push({
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
                                    if(s.status!=1){
                                        r += `<br /><span style="text-shadow:0px 0px 2px  red;">${s.name}:${s.lastdata}${s.unit}</span>`
                                    }else{
                                        r += `<br /><span style="text-shadow:0px 0px 2px  green;">${s.name}:${s.lastdata}${s.unit}</span>`
                                    }
                                    
                                }
                                return r
                            }
                        },
                        animation:false,
                        symbol : 'image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562565407150&di=0eaa1f1dc340a7e3b3e477adf3485c19&imgtype=0&src=http%3A%2F%2Fdemo.lanrenzhijia.com%2Fdemo%2F49%2F4936%2F1.jpg',
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                fontWeight :'bold',
                                fontSize: 15,
                                // borderWidth: 1.5,
                                textBorderColor :'#2196f3',
                                color :'#fff',
                                textBorderWidth  :3,
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
                this.option.series = series
            })
            this.count+=1
        }
    },
    computed: {
    },
    mounted(){
        this.yuanqu = this.$route.query.yuanqu
        
        this.chart = this.$refs.chart.chart
        var zr = this.chart.getZr()
        zr.on('click',this.chartClickNull)
        zr.on('mousemove',this.choosPoint)
    },
    created(){
        this.CancelToken =axios.CancelToken;
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
