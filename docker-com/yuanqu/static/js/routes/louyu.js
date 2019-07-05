ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
const louyu = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">

        <v-chart autoresize style="width: 100%;  height: 100%;" :options="option" @click="chartClick"   ref="chart" />
        
    </div>`,

    data(){
        return {

            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },

            option :  {
                title: {
                    text: '选择楼宇'
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series : [
                    {
                        type: 'graph',
                        layout: 'none',
                        symbolSize: [250,150],
                        roam: true,
                        label: {
                            normal: {
                                show: true
                            }
                        },

                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [4, 10],
                        edgeLabel: {
                            normal: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        data: [{
                            name: '1#楼',
                            x: 300,
                            y: 300,
                            symbol: `image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562243215521&di=a9f128c3a5b14945af42e87060a7e57c&imgtype=0&src=http%3A%2F%2Fgc.zbj.com%2Fupimg%2F6%2F2015%2F0926%2F20150926204901_26151.jpg`,
                        }, {
                            name: '2#楼',
                            x: 800,
                            y: 300,
                            symbol: `image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562243235114&di=409640d09c6bd02b1b7cde0f5d017712&imgtype=0&src=http%3A%2F%2Fimg.zx123.cn%2FResources%2Fzx123cn%2Fuploadfile%2F2015%2F0611%2F40eb35ad612959026bc80935f1d467b3.jpg`,
                        }, {
                            name: '3#楼',
                            x: 550,
                            y: 100,
                            symbol: `image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562243284456&di=1af8a8730eca4894589aa07755c88ad5&imgtype=0&src=http%3A%2F%2Fcbgccdn.thecover.cn%2F%40%2Fimages%2F20190329%2F1553872810003050766.jpg-cgwapimg`,
                        }, {
                            name: '4#楼',
                            x: 550,
                            y: 500,
                            symbol: `image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562243300420&di=41e60e6713ef199053a0440df6e1b4cc&imgtype=0&src=http%3A%2F%2Fres.co188.com%2Fdata%2Fdrawing%2Fimg640%2F6320304077195.jpg`,
                        }],
                        // links: [],
                        // links: [
                        //     {
                        //         source: 0,
                        //         target: 1,
                        //         symbolSize: [5, 20],
                        //         label: {
                        //             normal: {
                        //                 show: true
                        //             }
                        //         },
                        //         lineStyle: {
                        //             normal: {
                        //                 width: 5,
                        //                 curveness: 0.2
                        //             }
                        //         }
                        //     }, {
                        //         source: '节点2',
                        //         target: '节点1',
                        //         label: {
                        //             normal: {
                        //                 show: true
                        //             }
                        //         },
                        //         lineStyle: {
                        //             normal: { curveness: 0.2 }
                        //         }
                        //     }, {
                        //         source: '节点1',
                        //         target: '节点3'
                        //     }, {
                        //         source: '节点2',
                        //         target: '节点3'
                        //     }, {
                        //         source: '节点2',
                        //         target: '节点4'
                        //     }, {
                        //         source: '节点1',
                        //         target: '节点4'
                        //     }
                        // ],
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 2,
                                curveness: 0
                            }
                        }
                    }
                ]
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

        chartClick(event, instance, echarts){
            this.$router.push({ path: '/system',query: {system: event.name}  })
        },
        init(){
            var test = this.$route.query
        }
      
    },
    computed: {
    },
    mounted(){
        // this.chart = this.$refs.chart.chart
        // var zr = this.chart.getZr()
        // zr.on('click',this.chartClickNull)
        // zr.on('mousemove',this.choosPoint)
    },
    created(){
        this.init()

   
    },

}

