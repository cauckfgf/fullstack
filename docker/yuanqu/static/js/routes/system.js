const system = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%; background: url('/static/image/bg.png') no-repeat center!important;background-size: 100% 100%!important;">
        <div class="head_top">
            <span> 智能能耗管理 </span>
        </div>
        
        <div class="demo-avatar" style="position:absolute;right:25px;top:45px;z-index:1">
            <Badge :count="1" style="margin-right:20px;margin-top:10px;">
                <a href="javascript:void(0)" >
                    <span><Icon size="26" type="ios-mail-outline" @click="showWarn" /></span>
                </a>
            </Badge>
             <Dropdown @on-click='userDrop'>
                <a href="javascript:void(0)" >
                    <Avatar style="background-color: #87d068" icon="ios-person" />
                    <span>{{userinfo.username}}</span>
                </a>
                <DropdownMenu slot="list" v-if="userinfo.islogin" >
                    <DropdownItem name="个人中心">个人中心</DropdownItem>
                    <DropdownItem name="系统配置" v-show="userinfo.is_staff">系统配置</DropdownItem>
                    <DropdownItem name="退出">退出</DropdownItem>
                </DropdownMenu>
                <DropdownMenu slot="list" v-else>
                    <DropdownItem name="登录">登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <Row style="padding-top:20px;width: 100%;  height: 100%;">
            <Col :xs="24" :sm="24" :md="6" :lg="6" style="height: 100%;">
                <Card class="zhandian_card" style="background: #fff0;border:none;height: 40%;">
                    <div class="visual_title" slot="title">
                        <span v-if="isgis">项目能耗</span>
                        <span v-else>站点系统</span>
                        <img src="/static/image/ksh33.png">
                    </div>

                    
                    <v-chart v-if="isgis" autoresize style="width: 100%;  height: 90%;padding:4px; border-radius: 1.5em;" :options="option4" theme="dark"/>
                    <Tree v-else='!isgis' :data="systemData" :load-data="loadData" @on-select-change='systemChange' style="margin-left:15px"></Tree>
                </Card>
                <Card class="zhandian_card visual_left" style="background: #fff0;border:none;height: 40%;">
                    <div class="visual_title" slot="title">
                        <span>可控设备</span>
                        <img src="/static/image/ksh33.png">
                    </div>

                    <div class="visual_chart sfzcll">
                        <div class="sfzcll_pos_box">
                            <div class="sfzcll_box">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <label>办公室1空调</label>
                                <div class="sfzcll_smallBk">
                                    <div class="ygl">
                                        <i-switch size="large">
                                            <span slot="open">运行</span>
                                            <span slot="close">关闭</span>
                                        </i-switch>
                                    </div>
                                </div>
                                <div class="sfzcll_smallBk">
                                    <div class="ygh">
                                        <span>3</span>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="sfzcll_box">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <label>办公室1打印机</label>
                                <div class="sfzcll_smallBk">
                                    <div class="ygl">
                                        <i-switch size="large">
                                            <span slot="open">运行</span>
                                            <span slot="close">关闭</span>
                                        </i-switch>
                                    </div>
                                </div>
                                <div class="sfzcll_smallBk">
                                    <div class="ygh" style="line-height: 54px;">
                                        <span>5</span>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="sfzcll_box">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <label>办公室1大屏</label>
                                <div class="sfzcll_smallBk">
                                    <div class="ygl">
                                        <i-switch size="large">
                                            <span slot="open">运行</span>
                                            <span slot="close">关闭</span>
                                        </i-switch>
                                    </div>
                                </div>
                                <div class="sfzcll_smallBk">
                                    <div class="ygh" style="line-height: 54px;">
                                        <span>2</span>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="sfzcll_box" style="line-height: 56px;">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <img class="sfzcll_bkJk" src="/static/image/ksh34.png">
                                <label>办公室1电脑</label>
                                <div class="sfzcll_smallBk">
                                    <div class="ygl" style="line-height: 54px;">
                                        <i-switch size="large">
                                            <span slot="open">运行</span>
                                            <span slot="close">关闭</span>
                                        </i-switch>
                                    </div>
                                </div>
                                <div class="sfzcll_smallBk">
                                    <div class="ygh" style="line-height: 54px;">
                                        <span>5</span>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>

                    </div>
                </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" style="height: 90%;margin-top:20px;">
                <img class="visual_conBot_l" src="/static/image/ksh42.png">
                <img class="visual_conBot_2" src="/static/image/ksh43.png">
                <img class="visual_conBot_3" src="/static/image/ksh44.png">
                <img class="visual_conBot_4" src="/static/image/ksh45.png">
                <img v-for="item in imageChangeObj" :src="item.gif" :style="item.style" v-show="gifshow&&!isgis"/>
                <div v-show="userinfo.islogin && !isgis" style="position: absolute;top:5px;right:5px;z-index: 1;">
                    <Icon v-if="editable" size="24" type="ios-cog-outline" @click="editable=!editable" style="color:white" />
                    <Icon v-else size="24" type="ios-cog-outline" @click="editable=!editable"/>
                </div>
                <v-chart v-show="!isgis" class="wangge" autoresize style="width: 100%;  height: 100%;" :options="option" @click="chartClick"  :style="styleObject" ref="chart" @rendered="finished" @datazoom="datazoom"/>
                <v-chart v-show="isgis" class="wangge" autoresize style="width: 100%;  height: 100%;" :options="gis" @click="chartClick_gis"   theme="light"/>
            </Col>
            <Col :xs="24" :sm="24" :md="6" :lg="6" style="height: 100%;">
                <Card class="zhandian_card" style="background: #fff0;border:none;height: 40%;">
                    <div class="visual_title" slot="title">
                        <span>监控画面</span>
                        <img src="/static/image/ksh33.png">
                    </div>
                    <video  style="width:100%;height:calc(100% - 35px);background:black" id="myPlayer"  controls playsInline webkit-playsinline autoplay>
                        <source src="http://hls01open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.hd.m3u8" type="" />
                    </video>
                </Card>
                <Card class="zhandian_card" style="background: #fff0;border:none;height: 40%;">
                    <div class="visual_title" slot="title">
                        <span>设备列表</span>
                        <img src="/static/image/ksh33.png">
                    </div>
                    <Table class="transparentTable" :height="table_height"   @on-selection-change="guanzhu_change" border ref="selection" :columns="device_list_head" :data="device_list"></Table>
                    <Button class="btn" :disabled="!userinfo.islogin" :loading="guanzhu_button_loading" style="margin:15px;" @click="guanzhu(true)">关注全部</Button>
                    <Button class="btn" :disabled="!userinfo.islogin" :loading="guanzhu_button_loading" style="margin:15px;" @click="guanzhu(false)">取消关注</Button>
                    <Page class='page' :page-size="20" size="small" style="float:right;margin:15px;" :total="device_count" @on-change="pageChange" show-elevator />
                </Card>
            </Col>
        </Row>
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
                    <Col span="24"  v-if="select_obj.type!='lines'">
                        <FormItem label="x坐标" label-position="top">
                            <InputNumber :max="200"  v-model="select_obj.value[0]"></InputNumber>
                        </FormItem>
                        <FormItem label="y坐标" label-position="top">
                            <InputNumber :max="200"  v-model="select_obj.value[1]"></InputNumber>
                        </FormItem>
                        <FormItem label="图片高" label-position="top">
                            <InputNumber :max="200"  v-model="select_obj.sizeXY.y"></InputNumber>
                        </FormItem>
                        <FormItem label="图片宽" label-position="top">
                            <InputNumber :max="200"  v-model="select_obj.sizeXY.x"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="24"  v-else>
                        <FormItem  label-position="top" v-for='(item,index) in select_obj.coords'  :key="index" :label="index|formatLable">
                            <InputNumber :max="200"  v-model="item[0]" ></InputNumber>
                            <InputNumber :max="200"  v-model="item[1]" ></InputNumber>

                            <ButtonGroup>
                                <Button type="dashed" v-if="index!=select_obj.coords.length-1" @click="addPoint(index)">+</Button>
                                <Button type="dashed" v-if="index!=select_obj.coords.length-1" icon="ios-disc-outline" @click="positionLine(index)"></Button>
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
                <Button style="margin-right: 8px" @click="cancel">取消</Button>
                <Button type="dashed"icon="ios-disc-outline" @click="positionDevice" v-show="select_obj.type!='lines'">定位</Button>
                <Button type="primary" @click="change_device">确定</Button>
            </div>
        </Drawer>
        <Drawer
            :title="title"
            v-model="gongdan_show"
            width="600"
            :mask-closable="false"
            :styles="styles"
            draggable
            :placement='placement'
            :mask='false'
            transfer
        >
            <Tabs value="状态">
                <TabPane label="状态" name="状态">
                    
                    <Row style="width: 100%;">
                        <Col xs="12" sm="12" md="12" lg="6" xl="4" v-for="item in yibiaos">
                            <v-chart  autoresize style="width: 100%; " :options="item"/>
                        </Col>
                    </Row>
                    
                </TabPane>
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

    </div>`,
    
    data(){
        return {
            isgis:true,
            history_option: {//能耗
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                toolbox: {
                    feature: {
                        myTool0: {
                            show: true,
                            title: '日',
                            text: '日',
                            icon: 'image://https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2541928986,283009610&fm=58',
                            onclick: ()=>{
                                this.timerage('日')
                            }
                        },
                        myTool1: {
                            show: true,
                            title: '周',
                            text: '周',
                            icon: 'image://https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2754478880,138256405&fm=58',
                            onclick: ()=>{
                                this.timerage('周')
                            }
                        },
                        myTool2: {
                            show: true,
                            title: '月',
                            text: '月',
                            icon: 'image://https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2605606428,551422860&fm=58',
                            onclick: ()=>{
                                this.timerage('月')
                            }
                        },
                        myTool3: {
                            show: true,
                            title: '年',
                            text: '年',
                            icon: 'image://https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2395718531,4285100317&fm=58',
                            onclick: ()=>{
                                this.timerage('年')
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#ccc',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            textStyle: {
                                color: '#222'
                            }
                        }
                    },
                    // formatter: function (params) {
                    //     return params[2].name + '<br />' + params[2].value;
                    // }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        formatter: function (value, idx) {
                            var date = new Date(value);
                            return idx === 0 ? value : date.format("MM-dd\r\nhh:mm");  
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: function (val) {
                            return val+'kW‧h';
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return params.data;
                            }
                        }
                    },
                    // splitNumber: 3,
                    splitLine: {
                        // show: false
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                    // {
                    //     type: 'slider',
                    //     yAxisIndex: 0,
                    //     filterMode: 'empty'
                    // },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                    // {
                    //     type: 'inside',
                    //     yAxisIndex: 0,
                    //     filterMode: 'empty'
                    // }
                ],
                series: [{
                    name: '',
                    type: 'line',
                    data: [],
                    // lineStyle: {
                    //     normal: {
                    //         opacity: 0
                    //     }
                    // },
                    step:'start',
                    stack: 'confidence-band',
                    symbol: 'none'
                }]
            },
            gis : {
                // backgroundColor: '#0a0022',
                // backgroundColor: 'rgba(0,0,0,0)',//canvas的背景颜色
                environment: '/static/image/bg.jpg',//背景星空图
                title: {
                    sublink: '/',
                    left: 'center',
                    textStyle: {
                        color: '#80d8ee',
                        fontSize: 24,
                        textBorderWidth : 2,
                        textBorderColor : 'blue',
                        textShadowColor  :'blue',
                        textShadowBlur :2,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(o) {
                        // debugger
                        // return o.name + ":" + o.value[2] + "起";
                        r = `<span style="text-shadow:0px 0px 2px  blue;font-weight: bolder;font-size:1.2rem">${o.name}站点</span>`
                        return r
                    }
                },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        },
                        normal: {
                            show: true,
                            position: 'bottom',
                            formatter: function(o) {
                                // return o.name + ":" + o.value[2] + "起";
                                // return o.data[0].name
                                return ''
                            },
                            textStyle: {
                                color: "#46daff"
                            } //省份标签字体颜色
                        },
                        emphasis: {
                            textStyle: {
                                color: "#46daff"
                            } //省份标签字体颜色
                        },
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor : 'rgb(5, 39, 175,0)',
                            borderColor : '#eee',
                            borderWidth : 0.5,
                            shadowColor : 'rgb(2, 89, 195)',
                            shadowBlur : 10
                        },
                        emphasis: {
                            areaColor: 'rgb(2, 89, 195)'
                        },

                    }
                },
                series : [

                    {
                        name: '',
                        type: 'effectScatter',
                        // type:'scatter3D',
                        coordinateSystem: 'geo',
                        data: [
                            // {
                            //     name: "东莞",
                            //     value: [113.75,23.04,10]
                            // },
                            // {
                            //     name: "北京",
                            //     value: [116.46,39.92,100]
                            // },
                            // {
                            //     name: "太原",
                            //     value: [112.53,37.87,0.1]
                            // },
                            // {
                            //     name: "成都",
                            //     value: [104.06,30.67],
                            // },
                            // {
                            //     name: "苏州",
                            //     value: [120.62,31.32]
                            // }
                        ],
                        encode: {
                            value: 2
                        },
                        symbolSize: function (val) {
                            return 20;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#f4e925',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1
                    }
                ]
            },
            // userinfo:{islogin:false,username:''},
            CancelToken:null,
            guanzhu_button_loading:false,
            placement:'left',//设备详情抽屉左边还是右边
            source:null,
            imageChangeObj:[],
            gifshow:true,
            t1:null,//定时更新数据定时器
            project:{name:''},
            sensors:[],//选中线的来源设备的传感器
            device_list_head:[],
            device_list:[],
            device_count:0,
            device_filter:{devicetype:null,page:1},
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
                sizeXY:[]
            },
            seriesIndex:0,
            planePath : 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
            split1:0.15,
            systemData:[
                // {
                //     title: '1#楼',
                //     expand: true,
                //     // disabled:true,
                //     children:[]
                // },
                // {
                //     title: '2#楼',
                //     expand: true,
                //     // disabled:true,
                //     children:[]
                // },
                // {
                //     title: '3#楼',
                //     expand: true,
                //     // disabled:true,
                //     children:[]
                // },
                // {
                //     title: '4#楼',
                //     expand: true,
                //     // disabled:true,
                //     children:[]
                // },
            ],
            option : {
                // backgroundColor: '#1b1b1b',
                title: {
                    text: '',
                    left: '5',
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
                        end: 10,
                        filterMode: 'filter'
                    },
                    {
                        type: 'inside',
                        show: true,
                        yAxisIndex: [0],
                        // left: '93%',
                        start: 0,
                        end: 10,
                        filterMode: 'filter'
                    },


                ],
                tooltip: {
                    trigger: 'item',
                    formatter: function(o) {
                        // debugger
                        // return o.name + "：" + o.value[2] + "起";
                        return o.name
                    }


                },
                xAxis: {gridIndex: 0, min: 0, max: 2000,show: false},

                yAxis: {gridIndex: 0, min: -20, max: 2000,show: false},

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
            imgStyle:{
                position:'absolute',
                left:'110px',
                top:'110px',
            },
            addindex:0,
            editable:false,
            system:4,
            title:'',//工单抽屉标题
            status:{
                title: {
                    // text: '设备运行数据'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['回风温度','送风温度','回水温度','送水温度']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'回风温度',
                        type:'line',
                        stack: '总量',
                        data:[30, 40, 32, 43, 23, 20, 40]
                    },
                    {
                        name:'送风温度',
                        type:'line',
                        stack: '总量',
                        data:[35, 45, 33, 25, 38, 29, 34]
                    },
                    {
                        name:'回水温度',
                        type:'line',
                        stack: '总量',
                        data:[25, 36, 21, 33, 22, 32, 37]
                    },
                    {
                        name:'送水温度',
                        type:'line',
                        stack: '总量',
                        data:[23, 33, 31, 23, 35, 31, 36]
                    },
                ]
            },
            yibiaos:[],
            option4 : {
                    title: {
                        // text: '设备报警',
                        // subtext: 'Source: https://worldcoffeeresearch.org/work/sensory-lexicon/',
                        left: 'center',
                        textStyle: {
                            // fontSize: 14,
                            align: 'center',
                            color: '#fff'
                        },
                        subtextStyle: {
                            align: 'center'
                        },
                        // sublink: 'https://worldcoffeeresearch.org/work/sensory-lexicon/'
                    },
                    backgroundColor: 'rgba(20,20,20,0)',//canvas的背景颜色
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    // legend: {
                    //     data: ['空调', '空压机','污水']
                    // },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '-5%',
                        containLabel: true
                    },
                    yAxis:  {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['北京','太原','苏州','东莞','成都']
                    },
                    series: [
                        {
                            name: '空调',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [320, 302, 301, 334, 390],
                            itemStyle: {
                                normal: {
                                    color: 'red',
                                    barBorderRadius: 5,
                                }
                            },
                        },
                        {
                            name: '空压机',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [120, 132, 101, 134, 90],
                            itemStyle: {
                                normal: {
                                    color: 'yellow',
                                    barBorderRadius: 5,
                                }
                            },
                        },
                        {
                            name: '污水',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [220, 182, 191, 234, 290],
                            itemStyle: {
                                normal: {
                                    color: 'green',
                                    barBorderRadius: 5,
                                }
                            },
                        },
                       
                    ]
                }
        }
    },
    filters: {
        formatLable: function(data) {
            return `点位${data}`
        }
    },
    methods:{
        getProject(){
            ajax.get(`/device/rest/project/`).then(res => {
                this.gis.series[0].data = res.data.results
                ajax.get(`/device/rest/project/${this.gis.series[0].data[1].id}/`).then(res => {
                    this.project = res.data
                    this.initSystem()
                })
            })
        },
        toConfig(){
            this.$router.push('/config/')
        },
        userDrop(name){
            if(name=="个人中心"){

            }else if(name=="系统配置"){
                this.$router.push('/config/')
            }else if(name=="退出"){
                ajax.get('/logout/').then(res=>{
                    // this.$root.getUserInfo()
                    location.reload()
                })
            }else if(name="登录"){
                _app.login_show=true
            }
        },
        showWarn(){
            debugger
        },
        // 能耗开始
        timerage(t){
            this.history(t)
        },
        getBeforeWeek(d){
            d = new Date(d);
            d = +d - 1000*60*60*24*6;
            d = new Date(d);
            var year = d.getFullYear();
            var mon = d.getMonth()+1;
            var day = d.getDate();
            s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
            return new Date(s);
        },
        //获取指定日期前一个月
        getBeforeMonth(date){  
            var daysInMonth = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);  
            var strYear = date.getFullYear();    
            var strDay = date.getDate();    
            var strMonth = date.getMonth()+1;  
            if(strYear%4 == 0 && strYear%100 != 0){  
                daysInMonth[2] = 29;  
            }  
            if(strMonth - 1 == 0)  
            {  
                strYear -= 1;  
                strMonth = 12;  
            }  
            else  
            {  
                strMonth -= 1;  
            }  
            strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];  
            if(strMonth<10)    
            {    
                strMonth="0"+strMonth;    
            }  
            if(strDay<10)    
            {    
                strDay="0"+strDay;    
            }  
            datastr = strYear+"-"+strMonth+"-"+strDay;  
            return new Date(datastr);  
         },

        //获取指定日期前一年
        getLastYearYestdy(date){  
            var strYear = date.getFullYear() - 1;    
            var strDay = date.getDate();    
            var strMonth = date.getMonth()+1;  
            if(strMonth<10)    
            {    
                strMonth="0"+strMonth;    
            }  
            if(strDay<10)    
            {    
                strDay="0"+strDay;    
            }  
            datastr = strYear+"-"+strMonth+"-"+strDay;  
            return new Date(datastr);
        }, 
        history(t='日'){
            var d = {id:109}
            var date = new Date()
            var ft =date.format("yyyy-MM-dd 00:00")
            if(t=='周'){
               ft = this.getBeforeWeek(date).format("yyyy-MM-dd hh:mm")
            }else if(t=='月'){
                ft = this.getBeforeMonth(date).format("yyyy-MM-dd hh:mm")
            }
            else if(t=='年'){
                ft = this.getLastYearYestdy(date).format("yyyy-MM-dd hh:mm")
            }

            ajax.get(`/device/rest/sensordata/?sensor__device__in=${d.id}&stime__gte=${ft}`).then(res => {
                var sensordatas  = res.data
                // this.history_option.title.text = 
                this.title = `能耗历史数据`
                this.history_option.xAxis.data = sensordatas.map(function (item) {
                    return item.stime;
                })
                this.history_option.series[0].data = sensordatas.map(function (item) {
                    return item.data;
                })
            })
            
        },
        // 能耗结束
        guanzhu_change(l){
            var devices = []
            var devices_all = []
            for(var i in l){
                devices.push(l[i].id)
            }
            for(var i in this.device_list){
                devices_all.push(this.device_list[i].id)
            }
            ajax({
                url:'/device/rest/device/shoucang/',
                transformRequest: [function (data) {
                    return Qs.stringify(data, {
                        encode: false,
                        arrayFormat: 'brackets'
                    });
                }],
                data:{
                    devices:devices,
                    devices_all:devices_all,
                },
                method: 'post'
            }).then(res=>{
                this.guanzhu_button_loading = false
            })
        },
        guanzhu(status){
            this.$refs.selection.selectAll(status);
            this.guanzhu_button_loading = true
            if(status){
                this.$Notice.success({
                    title:"关注后，您可以收到设备报警微信提示"
                })
            }else{
                this.$Notice.warning({
                    title:"取消关注后，收不到设备报警微信提示"
                })
            }
        },
        datazoom(event){
            this.gifshow=false
            if(event!=undefined && event.type=='datazoom'){
                this.option.dataZoom[0].start = event.batch[0].start
                this.option.dataZoom[0].end = event.batch[0].end
                if(event.batch.length==2){
                    this.option.dataZoom[1].start = event.batch[1].start
                    this.option.dataZoom[1].end = event.batch[1].end
                }else{
                    this.option.dataZoom[1].start = event.batch[0].start
                    this.option.dataZoom[1].end = event.batch[0].end
                }
    
            }
            this.imageChange()
        },
        // back(){
        //     this.$router.push('/')
        //     _app.show=true;
        // },
        loadData (item, callback) {
            // ajax.get(`/device/rest/device/?system=${item.sid}&devicetype!=4&Sensor__isnull=false&pagesize=200`).then(res=>{
            ajax.get(`/device/rest/device/?system=${item.sid}&devicetype!=4&pagesize=200`).then(res=>{
                var data = []
                for(var i in res.data.results){
                    data.push({
                        title: res.data.results[i].name,
                        did: res.data.results[i].id

                    })
                }
                callback(data);
            })

        },
        systemChange(point){
            // this.systemData[0].children[0].selected=false
            if(point.length==0){
                return
            }
            if(point[0].sid!=undefined){
                this.system = point[0].sid
                if(this.systemData[0].sid!=point[0].sid){
                    this.systemData[0].selected = false
                }
                // if(this.system==3){
                //     this.initDian(update=false)
                // }else{
                //     this.init(update=false)
                // }
                this.resetDeviceFilter()
                this.getDevice(this.system)
                this.init(update=false)

            }else if(point[0].did!=undefined){
                this.placement='right'
                this.treeDeviceClick(point[0])
            }
            
            // console.log(point)
        },
        resetDeviceFilter(){
            this.device_filter = {devicetype:null,page:1}
        },
        choosPoint(){
            if(this.choosing){
                this.chart.getZr().setCursorStyle('crosshair');
            }
            
        },
        addPoint(i){
            // this.choosing=true
            // this.change_show = false
            
            this.select_obj.coords.splice(i+1, 0, [190,190]);
            // this.addindex = i+1
            // this.chart.on('mousemove', this.choosPoint);
        },
        positionLine(i){
            this.choosing=true
            this.change_show = false
            
            // this.select_obj.coords.splice(i+1, 0, [190,190]);
            this.addindex = i
            // this.chart.on('mousemove', this.choosPoint);
            window.clearTimeout(this.t1); 
        },
        positionDevice(){
            this.choosing=true
            this.change_show = false
            
            // this.select_obj.coords.splice(i+1, 0, [190,190]);
            // this.chart.on('mousemove', this.choosPoint);
            window.clearTimeout(this.t1); 
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
        treeDeviceClick(device){
            ajax.get(`/device/rest/device/${device.did}/`).then(res=>{
                this.select_obj = res.data
                this.select_obj.value=[]
                this.yibiaoSet()
                this.gongdan_show = true
                this.title = this.select_obj.name + '详情'
                // this.getLineSensor()
            })
        },
        pageChange(p){
            this.device_filter.page=p
            this.getDevice(this.system)
        },
        getDevice(system){
            // 获取有传感器的设备
            var p1 = new Promise((resolve,reject)=>{
                ajax.get(`/device/rest/system/${system}/devicetype/`).then(res=>{
                    resolve(res)
                })
             })
            var p2 = new Promise((resolve,reject)=>{
                // url = `/device/rest/device/?system=${system}&devicetype!=4&Sensor__isnull=false&pagesize=20&page=${this.device_filter.page}`
                url = `/device/rest/device/?devicetype__in=24,33&pagesize=20&page=${this.device_filter.page}`
                if(this.device_filter.devicetype!=null){
                    url = url + `&devicetype__in=${this.device_filter.devicetype}`
                }
                ajax.get(url).then(res => {
                    resolve(res)
                })
            })
            Promise.all([p1, p2]).then((ress)=>{
                var filter_list =[]
                for(var i in ress[0].data.data){
                    filter_list.push({
                        label:ress[0].data.data[i].name,
                        value:ress[0].data.data[i].id,
                    })
                }
                this.device_list_head=[
                    {
                        type: 'selection',
                        // key: 'name',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        // width: 100,
                        // fixed: 'left'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        // width: 60,
                        render: (h, params) => {
                            var s = params.row.status==1?'运行':'停止'
                            return h('div', s);
                        }
                    },
                    {
                        title: '类型',
                        key: 'devicetype_name',
                        // width: 100,
                        filters: filter_list,
                        filterRemote:(value,row)=>{
                            this.device_filter.devicetype=value
                            this.device_filter.page=1
                            this.getDevice(system)
                        }
                    },
                    {
                        title: '数据',
                        key: 'sensors',
                        // width: 60,
                        render: (h, params) => {
                            var s =''
                            for(var i in params.row.sensors){
                                s += `${params.row.sensors[i].name}:${params.row.sensors[i].lastdata}${params.row.sensors[i].unit}   \r\n`
                            }
                            return h('div', s);
                        }
                    }
                ]
                this.device_list = ress[1].data.results

                this.device_count = ress[1].data.count
            })
        },
        chartClick_gis(event, instance, echarts){
            if(event.componentType=='series'){
                this.isgis = false
                ajax.get(`/device/rest/project/${event.data.id}/`).then(res => {
                    this.project = res.data
                    this.initSystem()
                })
            }
        },
        chartClick(event, instance, echarts){

            this.placement='left'
            this.select_obj = event.data
            this.yibiaoSet()
            this.select_obj.type = event.seriesType 
            if(this.editable){
                // 编辑抽屉
                this.change_show = true
            }else{
                // 工单抽屉
                this.gongdan_show = true
            }
            this.title = this.select_obj.name + '详情'
            this.seriesIndex = event.seriesIndex
            this.getLineSensor()

        },
        yibiaoSet(){
            var unitlist = ['℃','m³/h','rpm','MPa','A','V','毫米','立方米/秒','厘米']
            this.yibiaos = []
            for(var i in this.select_obj.sensors){
                if(unitlist.indexOf(this.select_obj.sensors[i].unit)!=-1){
                    // this.yibiao.series[0].data[0].name = this.select_obj.sensors[i].name
                    // this.yibiao.series[0].data[0].value = this.select_obj.sensors[i].lastdata
                    // this.yibiao.series[0].detail =  {formatter:'{value}'+this.select_obj.sensors[i].unit}
                    var j = Number(this.select_obj.sensors[i].lastdata)
                    var max = 0
                    if(j<10){
                        max = 10
                    }else if(j<100){
                        max = 100
                    }else if(j<500){
                        max = 500
                    }else if(j<1000){
                        max = 1000
                    }
                     
                    this.yibiaos.push({
                        tooltip : {
                            formatter: "{a} <br/>{b} : {c}"
                        },
                        toolbox: {
                            feature: {
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        series: [
                            {
                                name: '压力',
                                type: 'gauge',
                                max: max,
                                detail: {formatter:'{value}'+this.select_obj.sensors[i].unit},
                                data: [{value: this.select_obj.sensors[i].lastdata, name: this.select_obj.sensors[i].name}]
                            }
                        ]
                    })

                }
            }
            
        },
        chartClickNull(pa){
            if(this.choosing){
                this.choosing=false
                var r = this.chart.convertFromPixel({xAxisIndex: 0, yAxisIndex: 0}, [pa.offsetX, pa.offsetY]);
                if(this.select_obj.type!='lines'){
                    this.select_obj.value = r
                    this.option.series[this.seriesIndex].data[0].value = this.select_obj.value

                }
                else{
                    // 鼠标点击位置对应xy 坐标值
                    this.select_obj.coords[this.addindex] = r
                    this.option.series[this.seriesIndex].data[0].coords = this.select_obj.coords
                }
                this.change_show=true
            }
            
        },
        cancel(){
            this.change_show = false;
            this.init();
        },
        playVoice(){
            // 播放声音
            // this.$refs.voice.play()

        },
        change_device(){
            this.change_show=false
            if(this.select_obj.type!='lines'){
                ajax({
                    url:`/device/rest/device/${this.select_obj.deviceid}/`,
                    transformRequest: [function (data) {
                        return Qs.stringify(data, {
                            encode: false,
                            arrayFormat: 'brackets'
                        });
                    }],
                    data:{
                        position:`${this.select_obj.value[0]},${this.select_obj.value[1]}`,
                        size:`${this.select_obj.sizeXY.x},${this.select_obj.sizeXY.y}`,
                    },
                    method: 'PATCH'
                }).then(res=>{
                    this.init()
                })
            }else{
                var b=[]

                for(var i in this.select_obj.coords){
                    // if(i!=0 &&i !=this.select_obj.coords.length-1){
                        b.push(this.select_obj.coords[i])
                    // }
                }
                ajax({
                    url:`/device/rest/device2device/${this.option.series[this.seriesIndex].device2deviceid}/`,
                    data:{
                        mid:JSON.stringify(b),
                        // sensor:this.select_obj.sensor
                    },
                    method: 'PATCH'
                }).then(res=>{
                    
                    this.init()
                })
            }
            
    
        },
        finished(){
            // chart 渲染完成
            this.imageChange()
        },
        init(update=true){
            
            if(this.isgis){
                return
            }
            this.source&&this.source.cancel('取消上个请求')
            if(update){
                this.source = this.CancelToken.source()
            }
            if(this.t1){
                // window.clearInterval(this.t1); 
                window.clearTimeout(this.t1); 
            }

            var p1 = new Promise((resolve,reject)=>{
                if(update){
                    ajax.get(`/device/rest/device2device/?system=${this.system}`, {cancelToken: this.source.token}).then(res => {
                        resolve(res)
                    })
                }else{
                    ajax.get(`/device/rest/device2device/?system=${this.system}`).then(res => {
                        resolve(res)
                    })
                }
                    
            })
            var p2 = new Promise((resolve,reject)=>{
                if(update){
                    ajax.get(`/device/rest/device/?system=${this.system}`,{cancelToken: this.source.token}).then(res => {
                        resolve(res)
                    })
                }else{
                    ajax.get(`/device/rest/device/?system=${this.system}`).then(res => {
                        resolve(res)
                    })
                }
                    
            })
            Promise.all([p1, p2]).then((ress)=>{
                this.imageChangeObj = []
                if(this.chart && !update){
                    this.$refs.chart.clear()
                }
                this.option.series=[]
                var series = []
                var res = ress[0]
                for(var i in res.data){
                      var d = res.data[i]
                      coords = d.path_list
                      var zlevel = 1
                      if(!d.show_direction){
                        zlevel=2
                      }
                      series.push({
                            type: 'lines',
                            zlevel: zlevel,
                            device2deviceid:d.id,
                            sensor:d.sensor,//自定义字段
                            // fromDevice:d.device_from,
                            // effect: {
                            //     show: true,
                            //     period: 3,
                            //     trailLength: 0,
                            //     //symbol: 'image://',
                            //     symbol: this.planePath,
                            //     symbolSize: 15
                            // },
                            effect: {
                                period: 8,
                                // constantSpeed: 50,
                                show: d.show_direction,
                                // trailLength: 0.1,
                                // symbol: 'image:///static/image/up.svg',
                                symbolSize: 12,
                                // color: d.line.sensor_status,
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'bottom',
                                    formatter: function(o) {
                                        
                                        // return o.name + "：" + o.value[2] + "起";
                                        return o.data[0].name
                                    }
                                }
                            },
                            polyline:true,//是否为多线段
                            lineStyle: {
                                normal: {
                                    // color: '#a6c84c',
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'red' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: 'blue' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    width: 5,//线宽
                                    opacity: 0.4,
                                    curveness: 0.1,//曲线弯曲
                                    type:d.line_style_type//虚线
                                }
                            },

                            coordinateSystem:'cartesian2d',
                            data: [{
                                coords: coords,
                                lineStyle:{
                                    normal:{
                                       color: d.line.sensor_status,
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
                        this.imageChangeObj.push({
                            postion : d.position.split(','),
                            gif : d.gif,
                            sizeXY: d.sizeXY,
                            style:{
                                position: 'absolute',
                                // left:'0px',
                                // bottom:'0px',
                                display: 'none',
                                'z-index': 1,
                                'pointer-events':'none'
                            }
                        })
                    }
                    var name = d.showname
                    // if(d.devicetype==26){
                    //     name = '' 
                    //     for(var s in d.sensors){
                    //         var sensor = d.sensors[s]
                    //         name += `${sensor.name}${sensor.lastdata}${sensor.unit}\r\n`
                    //     }
                    // }
                    data.push({
                        name: name,
                        value: d.position.split(','),
                        symbol: `image://${d.icon[0]}`,
                        deviceid:d.id,
                        sensors:d.sensors,
                        sizeXY:d.sizeXY
                        // shortname: d.name
                                            // symbol: 'image:'+weixin
                    })
                    var type = 'scatter'
                    // var symbolSize = [200,100] 
                    // if(d.status==2){
                    //     type = 'effectScatter'
                    //     symbolSize = [150,75] 
                    // }

                    series.push({
                        type: type,
                        // type: 'scatter',
                        coordinateSystem: 'cartesian2d',
                        zlevel: 3,
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
                                // r = `<span style="text-shadow:0px 0px 2px  blue;font-weight: bolder;font-size:1.2rem">${o.name}</span>`
                                var r = ''
                                if(o.data.sensors.length>0){
                                    r += "<table  class='tooltipTable'>"
                                      + "<tr><th align='left'>名称</th><th align='left'>数值</th></tr>";
                                    for(var i in o.data.sensors){
                                        var s =  o.data.sensors[i]
                                        r += `<tr><td style="padding-right:10px">${s.name}</td><td>${s.lastdata}${s.unit}</td></tr>`
                                        // if(s.status!=1){
                                        //     r += `<br /><span style="text-shadow:0px 0px 2px  red;">${s.name}:${s.lastdata}${s.unit}</span>`
                                        // }else{
                                        //     r += `<br /><span style="text-shadow:0px 0px 2px  green;">${s.name}:${s.lastdata}${s.unit}</span>`
                                        // }
                                        
                                    }
                                    r += "</table>"
                                }
                                return r
                            }
                        },
                        animation:false,
                        symbol : 'image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562565407150&di=0eaa1f1dc340a7e3b3e477adf3485c19&imgtype=0&src=http%3A%2F%2Fdemo.lanrenzhijia.com%2Fdemo%2F49%2F4936%2F1.jpg',
                        label: {
                            normal: {
                                show: true,
                                position: d.label_position,
                                fontWeight :'bold',
                                fontSize: 15,
                                // borderWidth: 1.5,
                                // textBorderColor :'#2196f3',
                                // color :'#fff',
                                // textBorderWidth  :3,
                                formatter: function(o) {
                                    // debugger
                                    // return o.name + "：" + o.value[2] + "起";
                                    return o.data.name 
                                }
                            }
                        },

                        symbolSize:  (p1,p2)=>{
                            var x = (this.option.dataZoom[0].end - this.option.dataZoom[0].start)/10
                            if(p2.seriesType=='scatter'){
                                // console.log([200/x, 100/x])
                                return [p2.data.sizeXY.x/x, p2.data.sizeXY.y/x] 
                            }else if(p2.seriesType=='effectScatter'){
                                // console.log([150/x,75/x])
                                return [p2.data.sizeXY.x/(1.5*x),p2.data.sizeXY.y/(1.5*x)] 
                            }
                            
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(46, 195, 241)',
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

                // this.t1 = window.setInterval(this.initDian,5000)
                this.t1 = window.setTimeout(this.init,5000)
            })
        },


        initDian(update=true){
            this.source&&this.source.cancel('取消上个请求')
            if(update){
                this.source = this.CancelToken.source()
            }
            if(this.t1){
                // window.clearInterval(this.t1); 
                window.clearTimeout(this.t1); 
            }

            var p1 = new Promise((resolve,reject)=>{
                if(update){
                    ajax.get(`/device/rest/device2device/?system=${this.system}`, {cancelToken: this.source.token}).then(res => {
                        resolve(res)
                    })
                }else{
                    ajax.get(`/device/rest/device2device/?system=${this.system}`).then(res => {
                        resolve(res)
                    })
                }
                    
            })
            var p2 = new Promise((resolve,reject)=>{
                if(update){
                    ajax.get(`/device/rest/device/?system=${this.system}`,{cancelToken: this.source.token}).then(res => {
                        resolve(res)
                    })
                }else{
                    ajax.get(`/device/rest/device/?system=${this.system}`).then(res => {
                        resolve(res)
                    })
                }
                    
            })
            Promise.all([p1, p2]).then((ress)=>{
                this.imageChangeObj = []
                if(this.chart && !update){
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
                            // fromDevice:d.device_from,
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
                                show: false,
                                trailLength: 0.1,
                                symbolSize: 8,
                                color: d.line.sensor_status,
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'bottom',
                                    formatter: function(o) {
                                        
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
                                    opacity: 1,
                                    curveness: 0.1,//曲线弯曲
                                    // type:'dotted'//虚线
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
                        this.imageChangeObj.push({
                            postion : d.position.split(','),
                            gif : d.gif,
                            style:{
                                position: 'absolute',
                                // left:'0px',
                                // bottom:'0px',
                                display: 'none',
                                'z-index': 1,
                                'pointer-events':'none'
                            }
                        })
                    }
                    data.push({
                        name: d.name,
                        value: d.position.split(','),
                        symbol: `image://${d.icon[d.status-1]}`,
                        deviceid:d.id,
                        sensors:d.sensors
                        // shortname: d.name
                                            // symbol: 'image:'+weixin
                    })
                    var type = 'scatter'

                    // if(d.status==2){
                    //     type = 'effectScatter'
                    // }

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
                                position: ['-25%', '25%'],
                                // fontWeight :'bold',
                                // fontSize: 15,
                                // borderWidth: 1.5,
                                // textBorderColor :'#2196f3',
                                color :'auto',
                                // textBorderWidth  :3,
                                formatter: function(o) {
                                    // debugger
                                    // return o.name + "：" + o.value[2] + "起";
                                    return o.data.name 
                                }
                            }
                        },

                        symbolSize: [75,75],
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

                // this.t1 = window.setInterval(this.initDian,5000)
                this.t1 = window.setTimeout(this.initDian,5000)
                
            })
        },
        initSystem(){
            ajax.get(`/device/rest/system/?ordering=-order&project=${this.project.id}`).then(res => {
                this.systemData=[]
                for(var i in res.data.results){
                    this.systemData.push({
                            title: res.data.results[i].name,
                            // expand: true,
                            // disabled:true,
                            sid:res.data.results[i].id,
                            children:[],
                            loading: false,
                    })
                    // for(var j in this.systemData){
                    //     this.systemData[j].children.push({
                    //         title : res.data.results[i].name,
                    //         sid : res.data.results[i].id,
                    //         selected:false
                    //     })
                    // }

    
                }
                // this.systemData[0].selected=true
                if(this.systemData.length>0){
                    this.system = this.systemData[0].sid
                    this.getDevice(this.system)
                    this.init(update=false)
                }
                
                
            })
        },
        imageChange(){
            // 通过html 绝对定位来弄图片
            // this.imageChangeObj.push({
            //                 postion : d.postion,
            //                 gif : d.gif
            //                 style:{
            //                     postion: 'absolute',
            //                     left:'0px',
            //                     bottom:'0px',
            //                     display: 'none';
            //                 }
            //             })
            if(this.isgis){
                return
            }
            for(var i in this.imageChangeObj){
                var b = (this.option.dataZoom[0].end - this.option.dataZoom[0].start)/10
                var x = (this.imageChangeObj[i].sizeXY.x/b)
                var y = (this.imageChangeObj[i].sizeXY.y/b)
                var xy = this.chart.convertToPixel ({xAxisIndex: 0, yAxisIndex: 0}, [this.imageChangeObj[i].postion[0], this.imageChangeObj[i].postion[1]]);
                if(xy!=undefined){
                    this.imageChangeObj[i].style.left = (xy[0]-x/2)+'px'
                    this.imageChangeObj[i].style.top = (xy[1]-y/2)+'px'
                    this.imageChangeObj[i].style.display = 'block'
                    this.imageChangeObj[i].style.height = y + 'px'
                    this.imageChangeObj[i].style.width = x + 'px'
                    this.imageChangeObj[i].style.position ='absolute'
                }
                
            }
            this.gifshow=true
        },
        
    },
    computed:{
        table_height(){
            return store.state.clientHeight/3;
        },
    },
    mounted(){
        // this.project = this.$route.query.project
        
        this.chart = this.$refs.chart.chart
        var zr = this.chart.getZr()
        zr.on('click',this.chartClickNull)
        zr.on('mousemove',this.choosPoint)
        var player = new EZUIPlayer('myPlayer');
    },
    created(){
        this.CancelToken =axios.CancelToken;
        
        // this.$root.getUserInfo()
        this.history()
        this.getProject()
    },

}

