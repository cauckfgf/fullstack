const Block = { 
    components:{
        transactions
    },
    template:`<div>
        <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        简单区块链Demo
                    </p>
                    <p>简单的工作量证明:<br/>
                     - 查找一个 p' 使得 (p+p')/2 是3的倍数<br/>
                     - 查找一个 p'>p <br/>
                     - 当前p是{{p}},求p'<br/>
                    </p>
                    <br/>
                    <div>
                        p'应该是:
                        <InputNumber :min="1" :step="1" v-model="p_new"></InputNumber>
                        <Button type="primary" @click="test">确定</Button>
                    </div>
                </Card>
            </Col>
            <Col :xs="2" :sm="4" :md="6" :lg="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        区块
                    </p>
                    <div>
                        <Tag v-for="item,index in block" color="blue" @click.native="BlockChoose(item)">块：{{index}}</Tag>
                    </div>
                </Card>
            </Col>
            <Col :xs="2" :sm="4" :md="6" :lg="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        交易
                    </p>
                    <div>
                        <transactions :blockid="select"></transactions>
                    </div>
                </Card>
            </Col>
            <Col :xs="2" :sm="4" :md="6" :lg="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        工作量
                    </p>
                    <p>{{selectp}}<p>
                </Card>
            </Col>
            
        </Row>
    </div>`,

    data(){
        return {
            block: [],
            select:0,
            p:'',
            selectp:'',
            p_new:1,
            user:''
        }
    },
    methods:{
        BlockChoose(item){
            this.select=item.id;
            this.selectp = item.proof
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
                var block = res;
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
                            $.ajax({
                                url: '/blockchain/rest/transactions/',
                                data: {
                                    sender:'system',
                                    recipient:self.user
                                },
                                method: 'post'
                            }).then( o => {
                                block.transactions.push(`/blockchain/rest/transactions/${o.id}/`)
                                ajax.put(block.url,block).then(res=>{
                                        self.$Message.success('交易成功')
                                })
                                
                            });
                        },

                    })
            }).catch(error=>{
                self.$Message.error('算的不对')
            })
            /*$.ajax({
                url:'/blockchain/rest/block/',
                data:{
                    proof:`${this.p_new}`,
                },
                method:'post',
                success:(res)=>{
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
                                    recipient:self.user
                                },
                                method: 'post'
                            }).then( o => {
                                block.transactions.push(`/blockchain/rest/transactions/${o.data.id}/`)
                                ajax.put(block.url,block).then(res=>{
                                        self.$Message.success('交易成功')
                                })
                                
                            });
                        },

                    })
                },
                error:(Exception)=>{
                    self.$Message.error('算的不对')
                }
               

            })*/
        }
    },
    computed: {
    },
    created(){
        var self=this;
        $.ajax('/blockchain/rest/block/').done((res)=>{
            self.block=res.results
            self.p = res.results[res.results.length-1].proof
        })
    },

}