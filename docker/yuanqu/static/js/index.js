"use static";

!function () {

    initVue();
    
}();
// <figure id="multiSlide" class="multiSlide">
//                         <div v-for="item in this.registeredBoxes" class="box" :style="item.style" :data-pos="item.datapos">
//                             <img :src="item.img"></img>
//                         </div>
//                         <div>
//                             <Button size="large" type="primary" @click="move('top')" shape="circle" icon="arrow-up-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('bottom')" shape="circle" icon="arrow-down-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('right')" shape="circle" icon="arrow-right-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('left')" shape="circle" icon="arrow-left-a" style="margin:5px"></Button>
//                         </div>
//                     </figure>
ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
echarts.registerTheme('shine')
function initVue() {
    const routes = [
      { path: '/yuanqu', component: yuanqu },
      { path: '/louyu', component: louyu },
      { path: '/system', component: system },
      { path: '/nenghao', component: nenghao },
    ]
    const router = new VueRouter({
        routes // （缩写）相当于 routes: routes
    })
    _app = new Vue({
        el:"#app",
        router,
        components:{
            // vueimage: vueImages.default
            'v-chart':VueECharts
        },
        template:`
            <div style="width: 100%;  height: calc(100%);background: url('/static/image/bg.jpg') no-repeat center!important;background-size: 100% 100%!important;">
                <Row v-show='show' style="height:100%">
                    <Col span="6" style="height:100%">
                        <v-chart autoresize style="width: 100%;  height: 50%;padding:4px; border-radius: 1.5em;" @click="nenghaoClick" :options="option1" theme="dark"/>
                        <v-chart autoresize style="width: 100%;  height: 50%;padding:4px; border-radius: 1.5em;" :options="option2" theme="dark"/>
                    </Col>
                    <Col span="12" style="height:100%">
                        <v-chart autoresize style="width: 100%;  height: 100%;" :options="option" @click="chartClick"  ref="chart" theme="light"/>
                    </Col>
                    <Col span="6" style="height:100%">
                        <v-chart autoresize style="width: 100%;  height: 50%;padding:4px; border-radius: 1.5em;" :options="option3" theme="dark"/>
                        <v-chart autoresize style="width: 100%;  height: 50%;padding:4px; border-radius: 1.5em;" :options="option4" theme="dark"/>
                    </Col>
                </Row>
                
                <Layout v-show='!show' style='height:100%'>
                    <Content :style="{background: '#fff', height:'100%'}">

                        <router-view></router-view>
                    </Content>
                </Layout>
            </div>`,
        created(){
            var self=this;
        },
        data(){
            return {
                show : true,
                isCollapsed: false,
                option : {
                    // backgroundColor: '#0a0022',
                    // backgroundColor: 'rgba(0,0,0,0)',//canvas的背景颜色
                    environment: '/static/image/bg.jpg',//背景星空图
                    title: {
                        text: '立讯精密智慧园区',
                        subtext: '院区分布',
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
                            r = `<span style="text-shadow:0px 0px 2px  blue;font-weight: bolder;font-size:1.2rem">${o.name}院区</span>`
                            return r
                        }
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     y: 'bottom',
                    //     x:'right',
                    //     data:['新园区'],
                    //     textStyle: {
                    //         color: '#fff'
                    //     }
                    // },
                    // geo3D:{
                    //     map: 'china',
                    //     shading: 'realistic', //光照带来的明暗
                    //     light: { // 光照相关的设置。在 shading 为 'color' 的时候无效。
                    //         main: { //场景主光源的设置
                    //             intensity: 5,//主光源的强度
                    //             shadow: true,//主光源是否投射阴影
                    //             shadowQuality: 'high',//阴影的质量
                    //             alpha: 30, //主光源绕 x 轴偏离的角度
                    //             beta:190 //主光源绕 y 轴偏离的角度
                    //         },
                    //         ambient: { //全局的环境光设置。
                    //             intensity: 15//环境光的强度
                    //         }
                    //     },
                    //     viewControl: {//用于鼠标的旋转，缩放等视角控制
                    //         distance: 100,//默认视角距离主体的距离
                    //         panMouseButton: 'left',//平移操作使用的鼠标按键
                    //         rotateMouseButton: 'right',//旋转操作使用的鼠标按键
                    //         alpha:50 // 让canvas在x轴有一定的倾斜角度
                    //     },
                    //     postEffect: {//为画面添加高光，景深，环境光遮蔽（SSAO），调色等效果
                    //         enable: true, //是否开启
                    //         SSAO: {//环境光遮蔽
                    //             radius: 1,//环境光遮蔽的采样半径。半径越大效果越自然
                    //             intensity: 1,//环境光遮蔽的强度
                    //             enable: true
                    //         }
                    //     },
                    //     temporalSuperSampling: {//分帧超采样。在开启 postEffect 后，WebGL 默认的 MSAA 会无法使用,分帧超采样用来解决锯齿的问题
                    //         enable: true
                    //     },
                    //     itemStyle: {//三维图形的视觉属性
                    //         color:'#2355ac',
                    //         borderWidth:1,
                    //         borderColor:'#000'
                    //     },
                    //     regionHeight: 2,//区域的高度
                    //     groundPlane: {
                    //         show: false
                    //     },

                    // },
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
                                    color: "#aaaaaa"
                                } //省份标签字体颜色
                            },
                            emphasis: {
                                textStyle: {
                                    color: "#9DDCEB"
                                } //省份标签字体颜色
                            },
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor : 'rgb(5, 39, 175,0.5)',
                                borderColor : '#eee',
                                borderWidth : 0.5,
                                shadowColor : '#aaaaaa',
                                shadowBlur : 10
                            },
                            emphasis: {
                                areaColor: '#2a333d'
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
                                {
                                    name: "东莞",
                                    value: [113.75,23.04,10]
                                },
                                {
                                    name: "北京",
                                    value: [116.46,39.92,100]
                                },
                                {
                                    name: "太原",
                                    value: [112.53,37.87,0.1]
                                },
                                {
                                    name: "成都",
                                    value: [104.06,30.67],
                                },
                                {
                                    name: "苏州",
                                    value: [120.62,31.32]
                                }
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
                option1 : {
                    color:['rgb(5, 39, 175,0.5)','#f5b03188','#fad79788','#59ccf788','#c3b4df88'],
                    title: {
                        text: '能耗统计',
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
                    backgroundColor: 'rgba(20,20,20,0.5)',//canvas的背景颜色
                    series: {
                        type: 'sunburst',
                        highlightPolicy: 'ancestor',
                        data: [
                            {
                                name:"东莞",
                                children:[
                                    {
                                        name: '空调',
                                        children:[
                                             {
                                                name: '空调风',
                                                value: 3,
                                            },
                                            {
                                                name: '空调水',
                                                value: 2,
                                            }
                                        ]
                                    },
                                    {
                                        name: '空压机',
                                        value: 1
                                    },
                                    {
                                        name: '生产设备',
                                        children:[
                                             {
                                                name: '厂房1',
                                                value: 1,
                                            },
                                            {
                                                name: '厂房2',
                                                value: 2,
                                            }
                                        ]
                                    },
                                ]
                            },
                            {
                                name:"北京",
                                children:[
                                    {
                                        name: '空调',
                                        children:[
                                             {
                                                name: '空调风',
                                                value: 3,
                                            },
                                            {
                                                name: '空调水',
                                                value: 2,
                                            }
                                        ]
                                    },
                                    {
                                        name: '空压机',
                                        value: 1
                                    },
                                    {
                                        name: '污水',
                                        value: 2,
                                    },
                                ]
                            },{
                                name:"太原",
                                children:[
                                    {
                                        name: '空调',
                                        children:[
                                             {
                                                name: '空调风',
                                                value: 3,
                                            },
                                            {
                                                name: '空调水',
                                                value: 2,
                                            }
                                        ]
                                    },
                                    {
                                        name: '空压机',
                                        value: 1
                                    },
                                    {
                                        name: '生产设备',
                                        children:[
                                             {
                                                name: '厂房1',
                                                value: 1,
                                            },
                                            {
                                                name: '厂房2',
                                                value: 2,
                                            }
                                        ]
                                    },
                                ]
                            },{
                                name:"苏州",
                                children:[
                                    {
                                        name: '空调',
                                        children:[
                                             {
                                                name: '空调风',
                                                value: 3,
                                            },
                                            {
                                                name: '空调水',
                                                value: 2,
                                            }
                                        ]
                                    },
                                    {
                                        name: '空压机',
                                        value: 1
                                    },
                                    {
                                        name: '生产设备',
                                        children:[
                                             {
                                                name: '厂房1',
                                                value: 1,
                                            },
                                            {
                                                name: '厂房2',
                                                value: 2,
                                            }
                                        ]
                                    },
                                ]
                            },{
                                name:"成都",
                                children:[
                                    {
                                        name: '空调',
                                        children:[
                                             {
                                                name: '空调风',
                                                value: 3,
                                            },
                                            {
                                                name: '空调水',
                                                value: 2,
                                            }
                                        ]
                                    },
                                    {
                                        name: '空压机',
                                        value: 1
                                    },
                                    {
                                        name: '生产设备',
                                        children:[
                                             {
                                                name: '厂房1',
                                                value: 1,
                                            },
                                            {
                                                name: '厂房2',
                                                value: 2,
                                            }
                                        ]
                                    },
                                ]
                            }

                        ],
                        radius: [0, '95%'],
                        sort: null,
                        levels: [{}, {
                            r0: '15%',
                            r: '35%',
                            // itemStyle: {
                            //     borderWidth: 2
                            // },
                            label: {
                                rotate: 'tangential'
                            }
                        }, {
                            r0: '35%',
                            r: '70%',
                            label: {
                                align: 'right'
                            }
                        }, {
                            r0: '70%',
                            r: '72%',
                            label: {
                                position: 'outside',
                                textShadowBlur: 0,
                                textShadowColor: '#fff',
                                color : '#fff',
                            },
                            // itemStyle: {
                            //     borderWidth: 3
                            // }
                        }]
                    }
                },
                option2 : {
                    color:['rgb(5, 39, 175,0.5)','#f5b03188','#fad79788','#59ccf788','#c3b4df88'],
                    title: {
                        text: '工单数量',
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
                    backgroundColor: 'rgba(20,20,20,0.5)',//canvas的背景颜色
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
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['北京','太原','苏州','东莞','成都']
                    },
                    series: [
                        {
                            name: '空调',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [320, 302, 301, 334, 390]
                        },
                        {
                            name: '空压机',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [120, 132, 101, 134, 90]
                        },
                        {
                            name: '污水',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [220, 182, 191, 234, 290]
                        },
                       
                    ]
                },
                option3 : {
                    title: {
                        text: '产能',
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
                    backgroundColor: 'rgba(20,20,20,0.5)',
                    tooltip: {},
                    xAxis: {
                        data: ["企业", "农专", "个体"],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            textStyle: {
                                color: '#e54035'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        }
                    },
                    series: [{
                        name: '年报上报率3',
                        type: 'pictorialBar',
                        symbolSize: [100, 45],
                        symbolOffset: [0, -20],
                        z: 12,
                        itemStyle: {
                            normal: {
                                color: '#14b1eb'
                            }
                        },
                        data: [{
                            value: 100,
                            symbolPosition: 'end'
                        }, {
                            value: 50,
                            symbolPosition: 'end'
                        }, {
                            value: 20,
                            symbolPosition: 'end'
                        }]
                    }, {
                        name: '年报上报率2',
                        type: 'pictorialBar',
                        symbolSize: [100, 45],
                        symbolOffset: [0, 20],
                        z: 12,
                        itemStyle: {
                            normal: {
                                color: '#14b1eb'
                            }
                        },
                        data: [100, 50, 20]
                    }, {
                        name: '年报上报率1',
                        type: 'pictorialBar',
                        symbolSize: [150, 75],
                        symbolOffset: [0, 37],
                        z: 11,
                        itemStyle: {
                            normal: {
                                color: 'transparent',
                                borderColor: '#14b1eb',
                                borderWidth: 5
                            }
                        },
                        data: [100, 50, 20]
                    }, {
                        name: '年报上报率',
                        type: 'pictorialBar',
                        symbolSize: [200,100],
                        symbolOffset: [0, 50],
                        z: 10,
                        itemStyle: {
                            normal: {
                                color: 'transparent',
                                borderColor: '#14b1eb',
                                borderType: 'dashed',
                                borderWidth: 5
                            }
                        },
                        data: [100, 50, 20]
                    }, {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#14b1eb',
                                opacity: .7
                            }
                        },
                        silent: true,
                        barWidth: 100,
                        barGap: '-100%', // Make series be overlap
                        data: [100, 50, 20]
                    }]
                },
                option4 : {
                    title: {
                        text: '设备报警',
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
                    backgroundColor: 'rgba(20,20,20,0.5)',//canvas的背景颜色
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
                            data: [320, 302, 301, 334, 390]
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
                            data: [120, 132, 101, 134, 90]
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
                            data: [220, 182, 191, 234, 290]
                        },
                       
                    ]
                }

            }
        },
        methods:{
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            menuclick(name){
                router.push({ path: name })
                // // 字符串
                // router.push('home')

                // // 对象
                // router.push({ path: 'home' })

                // // 命名的路由
                // router.push({ name: 'user', params: { userId: 123 }})

                // // 带查询参数,变成 /register?plan=private
                // router.push({ path: 'register', query: { plan: 'private' }})
            },
            nenghaoClick(event){
                this.show = false
                router.push({ path: '/nenghao', query: {nenghao: event.name}})
            },
            chartClick(event){
                
                if(event.componentType=='series'){
                    this.show = false
                    router.push({ path: '/system', query: {yuanqu: event.name}})
                }
                
                // // 字符串
                // router.push('home')

                // // 对象
                // router.push({ path: 'home' })

                // // 命名的路由
                // router.push({ name: 'user', params: { userId: 123 }})

                // // 带查询参数,变成 /register?plan=private
                // router.push({ path: 'register', query: { plan: 'private' }})
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        mounted(){
            if(this.$route.path!='/'){
                this.show = false
                router.push({ path: this.$route.path, query: this.$route.query })
            }
            
            // Vue.nextTick(()=>{
            //     for(var i in $(".ttips")){
            //         AddMarkerPingMian('red',$(".ttips")[i])
            //     }
            // })
            
        }
    });
    
}


