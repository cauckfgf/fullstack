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
        <Row :gutter="32">
            <Col span="8"  v-for="item in chazuos">
                <Card style="width:100%" >
                    <p slot="title">
                        <Icon type="ios-outlet"></Icon>
                        {{ item.name }}
                    </p>
                    <i-switch slot="extra" v-model="item.switch" @on-change="change(status,item)" >
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
                    
                </Card>
            </Col>
        </Row>
    </div>`,

    data(){
        return {
            chazuos:[]
        }
    },
    filters: {
        formatLable: function(data) {
            return `点位${data}`
        }
    },
    methods:{
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
        },
        change(status,item){
            if(status){
                ajax.get(`/device/rest/device/${item.id}/`).then(res => {

                })
            }else{
                ajax.get(`/device/rest/device/${item.id}/`).then(res => {

                })
            }
                
        }
    },
    created(){
        this.init()
    }

}

