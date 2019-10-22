ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
const nenghao = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">
        <Scroll :height="height">
            <Row :gutter="32" style="margin:0">
                <Col :lg="8" :xs="24"  v-for="item in chazuos">
                    <Card style="width:100%" >
                        <p slot="title">
                            <Icon type="ios-outlet"></Icon>
                            {{ item.name }}
                        </p>
                        <i-switch :disabled="!item.editabe" slot="extra" v-model="item.switch" @on-change="change(...arguments,item)" >
                            <span slot="open">开启</span>
                            <span slot="close">关闭</span>
                        </i-switch>
                        <ul style="list-style-type: none;">
                            <li v-for="(value, key, index) in item.lastdata">
                                <a :href="item.url" target="_blank">{{ key }}</a>
                                <span>
                                    <Icon type="ios-arrow-forward" v-for="n in 4" :key="n"/>
                                    {{ value }}
                                </span>
                            </li>
                        </ul>
                        <Button :disabled="!item.editabe" @click="timer(item)" type="primary">定时策略</Button>
                        <Button @click="history(item)" type="primary">历史数据</Button>
                    </Card>
                </Col>
            </Row>
        </Scroll>
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
            height:0,
            timer_value:false,
            timerData:{timers:[]},
            device:{},
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
                        {
                            type: 'slider',
                            yAxisIndex: 0,
                            filterMode: 'empty'
                        },
                        {
                            type: 'inside',
                            xAxisIndex: 0,
                            filterMode: 'empty'
                        },
                        {
                            type: 'inside',
                            yAxisIndex: 0,
                            filterMode: 'empty'
                        }
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
        init(){
            ajax.get(`/device/rest/device/?devicetype=24`).then(res => {
                this.chazuos = res.data.results
                for(var i in this.chazuos){
                    if(this.chazuos[i].lastdata['开关状态']=='true'){
                        this.chazuos[i].switch = true
                    }else{
                        this.chazuos[i].switch = false
                    }
                    
                }
                window.setTimeout(this.init,60000)
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
                    this.$Message.info("该设备没有定时任务")
                }
                
            })
        }
    },
    created(){
        this.init()
    }

}

