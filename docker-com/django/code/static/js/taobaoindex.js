"use static";

!function () {

    initVue();
    
}();


function initVue() {
    ajax = axios.create({
        // baseURL: ajaxUrl,
        timeout: 30000,
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
    });
    _app = new Vue({
        el:"#app",
        components:{

        },
        template:`<div class="layout">
                  <Layout>
                        <Menu mode="horizontal" theme="light" active-name="卫衣" @on-select="choose">
                            <MenuItem name="卫衣" >
                                <Icon type="ios-paper"></Icon>
                                卫衣
                            </MenuItem>
                            <MenuItem name="保温杯">
                                <Icon type="ios-people"></Icon>
                                保温杯
                            </MenuItem>
                            <MenuItem name="背包">
                                <Icon type="settings"></Icon>
                                背包
                            </MenuItem>
                            <MenuItem name="零食" >
                                <Icon type="settings"></Icon>
                                零食
                            </MenuItem>
                        </Menu>
                      <Content :style="{padding: '0 50px'}">
			<Breadcrumb :style="{margin: '20px 0'}">
                   		 <BreadcrumbItem>首页</BreadcrumbItem>
                   		 <BreadcrumbItem>商场</BreadcrumbItem>
                    		<BreadcrumbItem>all</BreadcrumbItem>
                	</Breadcrumb>
                        <Row>
                           <Col :xs="4" :sm="4" :md="4" :lg="4" v-for="item in shangpin">
                              <div id="tt-box" tt-width="628" tt-height="100">
                                <div id="tt-ds1" class="tt-global" tt-type="alkemia/items">
                                  <div class="tt-item" tt-data="items">
                                    <div class="tt-pic">
                                      <a :href="item.auctionUrl" target="_blank" tt-data="ds_img"><img :src="item.pictUrl" height="200" width="200"></a>
                                    </div>
                                    <ul class="tt-attr-l">
                                      <li class="tt-title"><a :href="item.auctionUrl" target="_blank"><span v-html="item.title">{{item.title}}</span></a></li>
                                      <li tt-if="ds_istmall" class="tt-tmall"></li>
                                      <li class="tt-seller">
                                        <a href="http://www.taobao.com/webww/?ver=1&touid=cntaobao{{item.nick}}&siteid=cntaobao&status=1&portalId=&gid=&itemsId="
                                           class="tt-ww-small" target="_blank">
                                           <img src="http://img02.taobaocdn.com/tps/i2/T1sJ3.XgNeXXX9g2ba-18-18.png">
                                        </a>
                                      </li>
                                    </ul>
                                    <ul class="tt-attr-r">
                                      <li class="tt-price">
                                        <span class="tt-price-16"><i></i>{{item.reservePrice}}</span>
                                        <span class="tt-price-12" tt-if="ds_reserve_price"><i></i>{{item.reservePrice}}</span>
                                      </li>
                                      <li class="tt-postfee">邮费：包邮</li>
                                      <li class="tt-sale">销量：{{item.biz30day}}件</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                          </Col>
                       </Row>
                     /Content>
                  </Layout>
                </div>`,
        created(){
            var self=this;
            ajax.get('/weixin/ylg/?s=卫衣').then((res)=>{
                self.shangpin = res.data.data.pageList
            })
        },
        data(){
            return {
                isCollapsed: false,
                shangpin:[]
            }
        },
        methods:{
           choose(name){
              var self=this;
              ajax.get(`/weixin/ylg/?s=${name}`).then((res)=>{
                  self.shangpin = res.data.data.pageList
              })
           }
        },
        computed: {

        },
        mounted(){

            
        }
    });
    
}


