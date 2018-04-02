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
        template:`<Row>
                     <Col :xs="4" :sm="4" :md="4" :lg="4" v-for="item in shangpin">
                        <div id="tt-box" tt-width="628" tt-height="100">
                          <div id="tt-ds1" class="tt-global" tt-type="alkemia/items">
                            <div class="tt-item" tt-data="items">
                              <div class="tt-pic">
                                <a href="item.auctionUrl" target="_blank" tt-data="ds_img"><img src="item.pictUrl"></a>
                              </div>
                              <ul class="tt-attr-l">
                                <li class="tt-title"><a href="item.auctionUrl" target="_blank">item.title</a></li>
                                <li tt-if="ds_istmall" class="tt-tmall"></li>
                                <li class="tt-seller">
                                  <a href="{{ds_shop_click}}" class="tt-seller-name" target="_blank">{{ds_nick}}</a>
                                  <a href="http://www.taobao.com/webww/?ver=1&touid=cntaobao{{{ds_nick}}}&siteid=cntaobao&status=1&portalId=&gid=&itemsId="
                                     class="tt-ww-small" target="_blank">
                                     <img src="http://img02.taobaocdn.com/tps/i2/T1sJ3.XgNeXXX9g2ba-18-18.png">
                                  </a>
                                </li>
                              </ul>
                              <ul class="tt-attr-r">
                                <li class="tt-price">
                                  <span class="tt-price-16"><i></i>{{ds_discount_price}}</span>
                                  <span class="tt-price-12" tt-if="ds_reserve_price"><i></i>{{ds_reserve_price}}</span>
                                </li>
                                <li class="tt-postfee">邮费：{{ds_postfee}}</li>
                                <li class="tt-sale">销量：{{ds_sell}}件</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                    </Col>
                 </Row>`,
        created(){
            var self=this;
            ajax.get('/weixin/ylg/').then((res)=>{
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
           
        },
        computed: {

        },
        mounted(){

            
        }
    });
    
}


