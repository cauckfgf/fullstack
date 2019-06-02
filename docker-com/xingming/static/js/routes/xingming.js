const xingming = { 
    components:{
        transactions
    },
    template:`<div>
        <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        计算最佳五格
                    </p>
                    <Input v-model="xing" style="width: 300px">
                        <span slot="prepend">姓</span>
                        <Button slot="append" icon="ios-search" @click="zuijia"></Button>
                    </Input>
                    <Button slot="append" icon="ios-search" @click="zuijia(1)">大吉</Button>
                    <Button slot="append" icon="ios-search" @click="zuijia(2)">吉</Button>
                </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <Table border :columns="columns" :data="zuijia_res">
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
                    key:'fkey',
                    sortable: true
                },
                {
                    title: '第二个名字笔画数',
                    slot: 's',
                    width: 160,
                    sortable: true
                },
                {
                    title: '第二个名字',
                    key:'skey',
                    sortable: true
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
                    this.zuijia_res[index].fkey=''
                    for(var j in res.data.results){
                        this.zuijia_res[index].fkey+=res.data.results[j].zi
                    }
                })
            }else{
                ajax({
                    url:`/kangxi/rest/hanzi/?bihua=${row.s}`,
                    method: 'get'
                }).then(res => {
                    this.zuijia_res[index].skey=''
                    for(var j in res.data.results){
                        this.zuijia_res[index].skey+=res.data.results[j].zi
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