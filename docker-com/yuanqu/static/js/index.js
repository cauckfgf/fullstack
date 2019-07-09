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
            <div style="width: 100%;  height: 100%;">
                <v-chart autoresize style="width: 100%;  height: 100%;" :options="option" @click="chartClick" v-show='show'   ref="chart" />
                <Layout v-show='!show' style='height:100%'>
                    <Content :style="{margin: '20px', background: '#fff', height:'100%'}">

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
                    backgroundColor: '#404a59',
                    title: {
                        text: '立讯精密院区分布',
                        subtext: '数据统计',
                        sublink: '数据统计',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function(o) {
                            // debugger
                            // return o.name + "：" + o.value[2] + "起";
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
                                    debugger
                                    // return o.name + "：" + o.value[2] + "起";
                                    return o.data[0].name
                                }
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series : [

                        {
                            name: '',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: [
                                {
                                    name: "东莞",
                                    value: [113.75,23.04]
                                },
                                {
                                    name: "北京",
                                    value: [116.46,39.92]
                                },
                                {
                                    name: "太原",
                                    value: [112.53,37.87]
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

                // // 带查询参数，变成 /register?plan=private
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

                // // 带查询参数，变成 /register?plan=private
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


