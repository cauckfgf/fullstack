const other = { 
    components:{

    },
    template:`<div>
        <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        计算最佳五格
                    </p>
                    <Row>
                        <Col :xs="6" :sm="6" :md="6" :lg="6">
                            <Input v-model="xing" style="width: 300px">
                                <span slot="prepend">姓</span>
                            </Input>
                        </Col>
                        <Col :xs="18" :sm="18" :md="18" :lg="18">
                            <Button icon="ios-search" @click="zuijia(1)">大吉</Button>
                            <Button icon="ios-search" @click="zuijia(2)">吉</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <Table border :columns="columns" :data="zuijia_res" max-height="600">
                    <template slot-scope="{ row, index }" slot="f">
                        <Button type="primary" shape="circle" icon="ios-search" @click="getzi(row,index,1)">{{ row.f }}</Button>
                    </template>
                    <template slot-scope="{ row,index }" slot="s">
                        <Button type="primary" shape="circle" icon="ios-search" @click="getzi(row,index,2)">{{ row.s }}</Button>
                    </template>

                </Table>
            </Col>

        </Row>
    </div>`,

    data(){
        return {
            xing:'',
            zuijia_res:[],
            columns:[
                {
                    title: '第一个名字笔画数',
                    slot: 'f',
                    width: 160,
                    sortable: true
                },
                {
                    title: '第一个名字',
                    align: 'center',
                    children: [
                        {
                            title: '金',
                            key:'jin1',
                            sortable: true
                        },
                        {
                            title: '木',
                            key:'mu1',
                            sortable: true
                        },
                        {
                            title: '水',
                            key:'shui1',
                            sortable: true
                        },
                        {
                            title: '火',
                            key:'huo1',
                            sortable: true
                        },
                        {
                            title: '土',
                            key:'tu1',
                            sortable: true
                        },
                    ]
                    
                },
                {
                    title: '第二个名字笔画数',
                    slot: 's',
                    width: 160,
                    sortable: true
                },
                {
                    title: '第二个名字',
                    align: 'center',
                    children: [
                        {
                            title: '金',
                            key:'jin2',
                            sortable: true
                        },
                        {
                            title: '木',
                            key:'mu2',
                            sortable: true
                        },
                        {
                            title: '水',
                            key:'shui2',
                            sortable: true
                        },
                        {
                            title: '火',
                            key:'huo2',
                            sortable: true
                        },
                        {
                            title: '土',
                            key:'tu2',
                            sortable: true
                        },
                    ]
                },
            ],
        }
    },
    methods:{
        getzi(row,index,i){
            if(i==1){
                ajax({
                    url:`/kangxi/rest/hanzi/?bihua=${row.f}`,
                    method: 'get'
                }).then(res => {
                    // this.zuijia_res[index].fkey={jin1:'',m:'',s:'',h:'',t:''}
                    for(var j in res.data.results){
                        if(res.data.results[j].wuxing==1){
                            this.zuijia_res[index].jin1+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==2){
                            this.zuijia_res[index].mu1+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==3){
                            this.zuijia_res[index].shui1+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==4){
                            this.zuijia_res[index].huo1+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==5){
                            this.zuijia_res[index].tu1+=res.data.results[j].zi
                        }
                        
                    }
                })
            }else{
                ajax({
                    url:`/kangxi/rest/hanzi/?bihua=${row.s}`,
                    method: 'get'
                }).then(res => {
                    // this.zuijia_res[index].skey={j:'',m:'',s:'',h:'',t:''}
                    for(var j in res.data.results){
                        if(res.data.results[j].wuxing==1){
                            this.zuijia_res[index].jin2+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==2){
                            this.zuijia_res[index].mu2+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==3){
                            this.zuijia_res[index].shui2+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==4){
                            this.zuijia_res[index].huo2+=res.data.results[j].zi
                        }else if(res.data.results[j].wuxing==5){
                            this.zuijia_res[index].tu2+=res.data.results[j].zi
                        }
                    }
                })
            }
        },
        zuijia(i){
            ajax({
                url:`/kangxi/rest/hanzi/xing/?xing=${this.xing}&level=${i}`,
                method: 'get'
            }).then(res => {
                this.zuijia_res = res.data["大吉组合"]
            })
        },
        test(){
            var self=this;
            ajax({
                url:'/blockchain/rest/block/',
                data:{
                    proof:`${this.p_new}`,
                },
                method: 'post'
            }).then( res => {
                var block = res.data;
                self.$Modal.confirm({
                    title:'恭喜你，算对了，系统将给您一个系统币',
                    render:(h,params) => {
                            return h('Input',
                                {
                                    props: {
                                    },
                                    model: {
                                        value: self.user,
                                        callback: (value) => {
                                            self.user = value;
                                        }
                                    }
                                }
                            );
                    },
                    onOk:()=>{
                        if(self.user==''){
                            self.$Message.warning('不写名字不作统计')
                            return
                        }
                        ajax({
                            url: '/blockchain/rest/transactions/',
                            data: {
                                sender:'system',
                                recipient:self.user,
                                amount:1,
                            },
                            method: 'post'
                        }).then( o => {
                            block.transactions.push(o.data.url)
                            ajax.put(block.url,block).then(res=>{
                                self.block.push(res.data)
                                self.$Message.success('交易成功')
                            })
                            
                        });
                    },

                })
            }).catch(error=>{
                self.$Message.error('算的不对')
            })

        }
    },
    computed: {
    },
    created(){

    },

}