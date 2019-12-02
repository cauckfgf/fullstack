const nenghao = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">
        <Tabs ref='tabs' value='总计'>
            <TabPane label="总计" icon="ios-analytics-outline" name='总计'>
                <Row :gutter="32" style="margin:0;height: 98vh;overflow: auto;" type="flex" justify="center" >
                    <Col :lg="8" :xs="24" class='self_col'>
                        <i-circle
                            :size="250"
                            :trail-width="4"
                            :stroke-width="5"
                            :percent="98"
                            stroke-linecap="square"
                            stroke-color="#43a3fb">
                            <div class="demo-Circle-custom">
                                <h1>156</h1>
                                <p>在线插座数量</p>
                                <span>
                                    占总插座数量
                                    <i>98%</i>
                                </span>
                            </div>
                        </i-circle>
                    </Col>
                    <Col :lg="8" :xs="24" class='self_col'>
                        <i-circle
                            :size="250"
                            :trail-width="4"
                            :stroke-width="5"
                            :percent="52"
                            stroke-linecap="square"
                            stroke-color="#43a3fb">
                            <div class="demo-Circle-custom">
                                <h1>81</h1>
                                <p>插座通电数量</p>
                                <span>
                                    占在线插座数量
                                    <i>52%</i>
                                </span>
                            </div>
                        </i-circle>
                    </Col>
                    <Col :lg="8" :xs="24" class='self_col'>
                        <i-circle
                            :size="250"
                            :trail-width="4"
                            :stroke-width="5"
                            :percent="29"
                            stroke-linecap="square"
                            stroke-color="#43a3fb">
                            <div class="demo-Circle-custom">
                                <h1>45</h1>
                                <p>空调数量</p>
                                <span>
                                    占在线插座数量
                                    <i>29%</i>
                                </span>
                            </div>
                        </i-circle>
                    </Col>
                    <Col :lg="8" :xs="24" class='self_col'>
                        <i-circle
                            :size="250"
                            :trail-width="4"
                            :stroke-width="5"
                            :percent="35"
                            stroke-linecap="square"
                            stroke-color="#43a3fb">
                            <div class="demo-Circle-custom">
                                <h1>35</h1>
                                <p>电脑数量</p>
                                <span>
                                    占在线插座数量
                                    <i>35%</i>
                                </span>
                            </div>
                        </i-circle>
                    </Col>
                    <Col :lg="8" :xs="24" class='self_col'>
                        <i-circle
                            :size="250"
                            :trail-width="4"
                            :stroke-width="5"
                            :percent="3"
                            stroke-linecap="square"
                            stroke-color="#43a3fb">
                            <div class="demo-Circle-custom">
                                <h1>5</h1>
                                <p>打印机数量</p>
                                <span>
                                    占在线插座数量
                                    <i>3%</i>
                                </span>
                            </div>
                        </i-circle>
                    </Col>
                    <Col :lg="8" :xs="24" class='self_col'>
                        <i-circle
                            :size="250"
                            :trail-width="4"
                            :stroke-width="5"
                            :percent="52"
                            stroke-linecap="square"
                            stroke-color="#43a3fb">
                            <div class="demo-Circle-custom">
                                <h1>71</h1>
                                <p>其他用途数量</p>
                                <span>
                                    占在线插座数量
                                    <i>45%</i>
                                </span>
                            </div>
                        </i-circle>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="详情" icon="ios-outlet-outline" name='详情'>
                <Scroll :height="height">
                    <Row :gutter="32" style="margin:0">
                        
                        <Col :lg="6" :xs="24"  v-for="item in chazuos">
                            <Card style="width:100%" >
                                <p slot="title">
                                    <Checkbox v-model="item.choose" size='large' :disabled="!item.editabe"></Checkbox>
                                    <Icon type="ios-outlet"></Icon>
                                    {{ item.name }}
                                    
                                </p>
                                <i-switch :disabled="!item.editabe" slot="extra" v-model="item.switch" @on-change="change(...arguments,item)" >
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <CellGroup>
                                    <Cell v-for="(value, key, index) in item.lastdata" v-if="key!='开关状态'&&key!='倒计时'" :title="key" :extra="value" />
                                </CellGroup>
    
                                <Button :disabled="!item.editabe" @click="timer(item)" type="primary">定时策略</Button>
                                <Button @click="history(item)" type="primary">历史数据</Button>
                                <Button @click="infraed(item)" v-if="item.infraed!=null && item.infraed.remote_index!=undefined" type="primary">遥控器</Button>
                            </Card>
                        </Col>
                        <Col :lg="24" :xs="24">
                            <Divider>批量添加定时策略到插座</Divider>
                            <Button style="margin:10px" type="success" v-for="i in timer_proxy" icon="md-add" @click="edit_timer_to_device(i)" >{{i.describe}}</Button>
                            <Button type="dashed" @click="show_add_proxy" long icon="md-add">添加策略</Button>
                        </Col>
                    </Row>
                </Scroll>
            </TabPane>
            <TabPane label="对比" icon="ios-image-outline" name='对比'>
                <v-chart autoresize style="width: 100%;  height: 90%;" theme="light" :options="history_duibi"   ref="duibi"/>
            </TabPane>
        </Tabs>
        <div style="position:absolute;top:35px;right:10px;" v-show="$refs.tabs!=undefined && $refs.tabs.activeKey=='详情'">
            <Dropdown style="margin:5px"  @on-click="init">
                <a href="javascript:void(0)">
                    用途
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list" >

                    <DropdownItem name="空调">空调</DropdownItem>
                    <DropdownItem name="其他">其他</DropdownItem>
                    <DropdownItem name="重置">重置</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown style="margin:5px" @on-click="init">
                <a href="javascript:void(0)">
                    分类
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list" >
                    <DropdownItem name="宿舍">宿舍区</DropdownItem>
                    <DropdownItem name="办公">办公区</DropdownItem>
                    <DropdownItem name="重置">重置</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <Drawer
            title="定时策略"
            v-model="timer_value"
            placement=''
            width='100'
        >
            <Form :model="timerData">
                <Row :gutter="32">
                    <Col :lg="8" :xs="24"  v-for="t,tindex in timerData.timers">
                        <FormItem label="时间"">
                            <TimePicker :steps="[1,1,60]" type="time" format="HH:mm" v-model="t.time" placeholder="Select time" style="width: 168px"></TimePicker>
                        </FormItem>
                        <FormItem label="动作">
                            <i-switch v-model="t.functions[0].value" size="large">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="循环方式">
                            <div>星期</div>
                            <Tag v-for="l,index in t.loops" checkable color="success" @on-change="loop_change(...arguments,tindex,index)" :checked="l==1">星期{{index|xingqi}}</Tag>
                            
                        </FormItem>
                        <FormItem>
                            <Button type="error" @click="deletetimer(tindex)">删除</Button>
                        </FormItem>
                        <Divider />
                    </Col>
                    <Col span="24">
                        <FormItem>
                            <Button type="success" @click="save">保存</Button>
                            <Button type="dashed" @click="newtimer">新增</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Drawer>
        <Drawer
            title="遥控器"
            v-model="infrae_info.show"
            placement=''
            width='100'
        >
            <Form :model="infrae_info.data">
                <Row :gutter="32">
                    <Col :lg="8" :xs="24">
                        <FormItem label="模式">
                            <RadioGroup v-model="infrae_info.data.mode">
                                <Radio label="0">
                                    <span>制冷</span>
                                </Radio>
                                <Radio label="1">
                                    <span>制热</span>
                                </Radio>
                                <Radio label="2">
                                    <span>自动</span>
                                </Radio>
                                <Radio label="3">
                                    <span>送风</span>
                                </Radio>
                                <Radio label="4">
                                    <span>除湿</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="开关">
                            <i-switch :value="infrae_info.data.power=='1'" size="large">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="温度">
                            <InputNumber :disabled="infrae_info.data.mode=='2'" :max="30" :min="16" v-model="infrae_info.data.temp"></InputNumber>
                        </FormItem>
                        <FormItem label="风速">
                            <RadioGroup v-model="infrae_info.data.wind">
                                <Radio label="0">
                                    <span>自动</span>
                                </Radio>
                                <Radio label="1">
                                    <span>低</span>
                                </Radio>
                                <Radio label="2">
                                    <span>中</span>
                                </Radio>
                                <Radio label="3">
                                    <span>高</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <Divider />
                    </Col>
                    <Col span="24">
                        <FormItem>
                            <Button type="success" @click="save">保存</Button>
                            <Button type="dashed" @click="newtimer">新增</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Drawer>
        <Drawer
            title="添加定时策略"
            v-model="add_timer_value"
            placement=''
            width='100'
        >
            <Form :model="addtimerData">
                <Row :gutter="32">
                    <Col :lg="8" :xs="24"  v-for="t,tindex in addtimerData.data.timers">
                        <FormItem label="时间"">
                            <TimePicker :steps="[1,1,60]" type="time" format="HH:mm" v-model="t.time" placeholder="Select time" style="width: 168px"></TimePicker>
                        </FormItem>
                        <FormItem label="动作">
                            <i-switch v-model="t.functions[0].value" size="large">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="循环方式">
                            <div>星期</div>
                            <Tag v-for="l,index in t.loops" checkable color="success" @on-change="loop_change(...arguments,tindex,index)" :checked="l==1">星期{{index|xingqi}}</Tag>
                            
                        </FormItem>
                        <FormItem>
                            <Button type="error" @click="deletetimer(tindex)">删除</Button>
                        </FormItem>
                        <Divider />
                    </Col>
                    <Col span="24">
                        <FormItem>
                            <Input v-model="addtimerData.describe" type="textarea" :rows="4" placeholder="描述" />
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem>
                            <Button type="success" @click="save_timer_proxy">保存</Button>
                            <Button type="dashed" @click="new_timer_proxy">新增</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Drawer>
        <Drawer
            :title="history_draw.title"
            v-model="history_draw.show"
            placement=''
            width='100'
        >
        <v-chart autoresize style="width: 100%;  height: 100%;" :options="history_draw.history_option"   ref="chart"/>
        </Drawer>
    </div>`,

    data(){

        return {
            chazuos:[],
            fenlei:[],
            chazuo_filter:[],
            height:0,
            timer_value:false,
            add_timer_value:false,
            timerData:{timers:[]},
            addtimerData:{data:{timers:[]},describe:''},
            device:{},
            timer_proxy:[],//定时策略，对应models 》》 TimerTuYa
            infrae_info:{
                show:false,
                data: {}
            },
            history_draw:{
                show:false,
                title:'',
                radio:'周',
                history_option: {
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
                }
            },
            history_duibi:{
                title: {
                    text: '节能开启前后,用电对比'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data:['开启前','开启后'],
                    top:40
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    top:40,
                    feature: {
                        myTool0: {
                            show: true,
                            title: '日',
                            text: '日',
                            icon: 'image://https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2541928986,283009610&fm=58',
                            onclick: ()=>{
                                this.randomData('日')
                            }
                        },
                        myTool1: {
                            show: true,
                            title: '周',
                            text: '周',
                            icon: 'image://https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2754478880,138256405&fm=58',
                            onclick: ()=>{
                                this.randomData('周')
                            }
                        },
                        myTool2: {
                            show: true,
                            title: '月',
                            text: '月',
                            icon: 'image://https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2605606428,551422860&fm=58',
                            onclick: ()=>{
                                this.randomData('月')
                            }
                        },

                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : [],
                        axisLabel: {
                            formatter: function (value, idx) {
                                var date = new Date(value);
                                return idx === 0 ? value : date.format("MM-dd\r\nhh:mm");  
                            }
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            filterMode: 'empty',
                            start: 0,
                            end: 100,
                        },
                        // {
                        //     type: 'slider',
                        //     yAxisIndex: 0,
                        //     filterMode: 'empty'
                        // },
                        {
                            type: 'inside',
                            xAxisIndex: 0,
                            filterMode: 'empty',
                            start: 0,
                            end: 100,
                        },
                        // {
                        //     type: 'inside',
                        //     yAxisIndex: 0,
                        //     filterMode: 'empty'
                        // }
                    ],
                series : [
                    {
                        name:'开启前',
                        type:'line',
                        areaStyle: {},
                        step:'start',
                        data:[0]
                    },
                    {
                        name:'开启后',
                        type:'line',
                        areaStyle: {},
                        step:'start',
                        data:[0]
                    },
                ]
            }
        }
    },
    filters: {
        xingqi:function(i){
            if(i==0){
                return '一'
            }else if(i==1){
                return '二'
            }else if(i==2){
                return '三'
            }else if(i==3){
                return '四'
            }else if(i==4){
                return '五'
            }else if(i==5){
                return '六'
            }else if(i==6){
                return '日'
            }
        },
        formatloop: function(data) {
            var week = []
            for(var i in data){
                if(data[i]=='1'){
                    week.push('一')
                }
                if(data[i]=='1'){
                    week.push('二')
                }
                if(data[i]=='1'){
                    week.push('三')
                }
                if(data[i]=='1'){
                    week.push('四')
                }
                if(data[i]=='1'){
                    week.push('五')
                }
                if(data[i]=='1'){
                    week.push('六')
                }
                if(data[i]=='1'){
                    week.push('日')
                }
            }
            if(data=='1111111'){
                return '每天'
            }else{
                return ''.join(week)
            }
        }
    },
    methods:{
        randomNum(minNum, maxNum) {
          switch (arguments.length) {
            case 1:
              return parseInt(Math.random() * minNum + 1, 10);
              break;
            case 2:
              return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
              //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
              break;
            default:
              return 0;
              break;
          }
        },
        randomData(t='周') {
            // 节能生成假数据
            var nowdate = new Date();
            var x = 0
            var y = 0
            if(t=='日'){
                x = 24*3600*1000
                y = 24
            }else if(t=='周'){
                x = 7*24*3600*1000
                y = 24*7
            }else if(t=='月'){
                x = 30*24*3600*1000
                y = 24*7*30
            }
            var oneweekdate = new Date(nowdate-x);
            this.history_duibi.xAxis[0].data=[]
            this.history_duibi.series[0].data=[0]
            this.history_duibi.series[1].data=[0]
            for(var i=0;i<y;i++){
                var tmp = new Date(oneweekdate.valueOf()+i*3600*1000);
                var hour = tmp.getHours()
                var randomdata = 0
                var diff = 0
                if(hour<9||hour>22){
                    randomdata = this.randomNum(50,60)
                    diff = this.randomNum(10,15)
                }else{
                    randomdata = this.randomNum(100,150)
                    diff = this.randomNum(5,10)
                }
                this.history_duibi.xAxis[0].data.push(tmp.format("yyyy-MM-dd hh:00"))
                this.history_duibi.series[0].data.push(this.history_duibi.series[0].data[i]+randomdata)
                this.history_duibi.series[1].data.push(this.history_duibi.series[1].data[i]+randomdata-diff)
            }
            var sumbefor = eval(this.history_duibi.series[0].data.join('+'))
            var sumnow = eval(this.history_duibi.series[1].data.join('+'))
            var d = (sumbefor-sumnow)*100/sumbefor
            this.history_duibi.title.text= `节能开启前后,用电对比 (节能${d.toFixed(2)}%)`
            
        },
        show_add_proxy(){
            this.add_timer_value=true
        },
        timerage(t){
            this.history(this.device,t)
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
        infraed(d){
            ajax.get(`/device/rest/device/${d.id}/infraredStatus/`).then(res => {
                this.infrae_info.show=true
                this.infrae_info.data=res.data.result
            })
        },
        history(d,t='日'){
            this.device=d
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
                // this.history_draw.history_option.title.text = 
                this.history_draw.title = `${d.name}历史数据`
                this.history_draw.history_option.xAxis.data = sensordatas.map(function (item) {
                    return item.stime;
                })
                this.history_draw.history_option.series[0].data = sensordatas.map(function (item) {
                    return item.data;
                })
                this.history_draw.show=true
            })
            
        },
        save_timer_proxy(){
            var data = {
                describe:this.addtimerData.describe,
                // data:this.addtimerData.data
                data:JSON.stringify(this.addtimerData.data)
            }
            ajax({
                url:`/device/rest/timer/`,
                // transformRequest: [function (data) {
                //     return Qs.stringify(data, {
                //         encode: false,
                //         arrayFormat: 'brackets'
                //     });
                // }],
                data:data,
                method: 'post'
            }).then(res=>{
                // this.init()
                this.get_timer_proxy()
                this.$Message.info("保存成功")
            })
        },
        save(){
            ajax({
                url:`/device/rest/device/${this.device.id}/timer/`,
                // transformRequest: [function (data) {
                //     return Qs.stringify(data, {
                //         encode: false,
                //         arrayFormat: 'brackets'
                //     });
                // }],
                data:this.timerData,
                method: 'post'
            }).then(res=>{
                // this.init()
                this.$Message.info("保存成功")
            })
        },
        loop_change(b,i,j){
            if(b){
                this.timerData.timers[i].loops[j] = '1'
            }else{
                this.timerData.timers[i].loops[j] = '0'
            }
            
        },
        deletetimer(i){
            this.timerData.timers.splice(i,1)
        },
        edit_timer_to_device(i){
            var devices = []
            for(var c in this.chazuos){
                if(this.chazuos[c].choose){
                    devices.push(this.chazuos[c].id)
                }
            }
            ajax({
                url:`/device/rest/timer/${i.id}/add2device/`,
                // transformRequest: [function (data) {
                //     return Qs.stringify(data, {
                //         encode: false,
                //         arrayFormat: 'brackets'
                //     });
                // }],
                data:{'devices':devices},
                method: 'post'
            }).then(res=>{
                this.$Message.info("添加成功")
                // this.init()
            })
        },
        new_timer_proxy(){
            this.addtimerData.data.timers.push({
                    functions: [
                        {
                            code: "switch_1",
                            value: false
                        }
                    ],
                    loops: "1111111",
                    time: "12:00",
            })
        },
        newtimer(){
            this.timerData.timers.push({

                    functions: [
                        {
                            code: "switch_1",
                            value: false
                        }
                    ],
                    loops: "1111111",
                    time: "22:20",
            })
        },
        init(name){
            var url = `/device/rest/device/?devicetype=24`
            if(name=='重置'||name==undefined){

            }else if(name=='空调'||name=='宿舍区'){
                url += `&name__contains=${name}`
            }else if(name=='其他'){
                url += `&name__contains!=空调`
            }
            else if(name=='办公'){
                url += `&name__contains!=宿舍`
            }
            ajax.get(url).then(res => {
                this.chazuos = res.data.results
                for(var i in this.chazuos){
                    if(this.chazuos[i].lastdata['开关状态']=='true'){
                        this.chazuos[i].switch = true
                    }else{
                        this.chazuos[i].switch = false
                    }
                    this.chazuos[i].choose = false
                    
                }
                // window.setTimeout(this.init(''),60000)
            })
            this.height = document.body.clientHeight
        },
        change(status,item){
            if(status){
                ajax.get(`/device/rest/device/${item.id}/switch_on/`).then(res => {

                })
            }else{
                ajax.get(`/device/rest/device/${item.id}/switch_off/`).then(res => {

                })
            }
                
        },
        timer(device){
            this.device=device
            ajax.get(`/device/rest/device/${device.id}/timer/`).then(res => {
                if(res.data.success){
                    this.timer_value=true
                    this.timerData.timers = []
                    for(var r in res.data.result){
                        for(var i in res.data.result[r].groups){
                            for(var j in res.data.result[r].groups[i].timers){
                                res.data.result[r].groups[i].timers[j].loops = res.data.result[r].groups[i].timers[j].loops.split('')
                                this.timerData.timers.push(res.data.result[r].groups[i].timers[j])
                            }
                        }
                    }
    
                    // this.timerData = res.data.result[0].groups[0]
                    
                }else{
                    this.timerData.timers=[]
                    this.timer_value=true
                    this.$Message.info("该插座没有定时任务")
                }
                
            })
        },
        get_timer_proxy(){
            ajax.get(`/device/rest/timer/`).then(res =>{
                this.timer_proxy = res.data.results
            })
            
        }
    },
    created(){
        this.init()
        this.get_timer_proxy()
        this.randomData()
        ajax.get(`/device/rest/device/fenlei/`).then(res =>{
            this.fenlei = res.data.results
        })
    }

}

