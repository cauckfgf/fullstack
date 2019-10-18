ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});

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
                        <i-switch slot="extra" v-model="item.switch" @on-change="change(...arguments,item)" >
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
                        <Button @click="timer(item)" type="primary">定时策略</Button>
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
                    <Col span="24" v-for="t,tindex in timerData.timers">
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
                    <Button type="success" @click="save">保存</Button>
                    <Button type="dashed" @click="newtimer">新增</Button>
                </Row>
            </Form>
        </Drawer>
    </div>`,

    data(){
        return {
            chazuos:[],
            height:0,
            timer_value:false,
            timerData:{timers:[]},
            device:{},
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
                    this.$Message.info("该设备没有定时任务")
                }
                
            })
        }
    },
    created(){
        this.init()
    }

}

