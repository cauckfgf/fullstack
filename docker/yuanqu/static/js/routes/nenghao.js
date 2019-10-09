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
                window.setTimeout(this.init,60000)
            })
        }
    },
    created(){
        this.init()
    }

}

