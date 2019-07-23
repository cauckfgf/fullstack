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
            <div style="width: 100%;  height: calc(100%);">
                <Row v-show='show' style="height:100%">
                    <Col span="6" style="height:100%">
                        <v-chart autoresize style="width: 100%;  height: 50%;padding:4px; border-radius: 1.5em;" :options="option1" theme="dark"/>
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
                    backgroundColor: 'rgba(20,20,20,0.5)',//canvas的背景颜色
                    title: {
                        text: '产能',
                        left: 'center'
                        // link: 'https://github.com/pissang/echarts-next/graphs/punch-card'
                    },
                    legend: {
                        data: ['Punch Card'],
                        left: 'right'
                    },
                    polar: {},
                    // tooltip: {
                    //     formatter: function (params) {
                    //         return params.value[2] + ' commits in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
                    //     }
                    // },
                    angleAxis: {
                        type: 'category',
                        data: ['12a', '1a', '2a', '3a', '4a', '5a', '6a','7a', '8a', '9a','10a','11a','12p', '1p', '2p', '3p', '4p', '5p','6p', '7p', '8p', '9p', '10p', '11p'],
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#999',
                                type: 'dashed'
                            }
                        },
                        axisLine: {
                            show: false
                        }
                    },
                    radiusAxis: {
                        type: 'category',
                        data: ['周一', '周二', '周三','周四', '周五', '周六', '周日'],
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            rotate: 45
                        }
                    },
                    series: [{
                        name: 'Punch Card',
                        type: 'scatter',
                        coordinateSystem: 'polar',
                        symbolSize: function (val) {
                            return val[2] * 2;
                        },
                        data: [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]],
                        animationDelay: function (idx) {
                            return idx * 5;
                        }
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


