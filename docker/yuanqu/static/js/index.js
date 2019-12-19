"use static";

!function () {

    initVue();
    
}();
// <figure id="multiSlide" class="multiSlide">
//                         <div v-for="item in this.registeredBoxes" class="box" :style="item.style" :data-pos="item.datapos">
//                             <img :src="item.img"></img>
//                         </div>
//                         <div>
//                             <Button size="large" type="primary" @click="move('top')" shape="circle" icon="arrow-up-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('bottom')" shape="circle" icon="arrow-down-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('right')" shape="circle" icon="arrow-right-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('left')" shape="circle" icon="arrow-left-a" style="margin:5px"></Button>
//                         </div>
//                     </figure>
// ajax = axios.create({
//     // baseURL: ajaxUrl,
//     timeout: 30000,
//     headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
// });
echarts.registerTheme('shine')

function initVue() {
    const routes = [
      { path: '/', component: system },
      // { path: '/yuanqu', component: yuanqu },
      { path: '/system', component: system },
      { path: '/config', component: config },
    ]
    const router = new VueRouter({
        routes // （缩写）相当于 routes: routes
    })
    
    _app = new Vue({
        el:"#app",
        router,
        store,
        components:{
            // vueimage: vueImages.default
            'v-chart':VueECharts
        },
        template:`
            <div style="width: 100%;  height: calc(100%);background: url('/static/image/bg.png') no-repeat center!important;background-size: 100% 100%!important;">
                
                
                <Layout  style='height:100%'>
                    <Content :style="{background: '#fff', height:'100%'}">

                        <router-view></router-view>
                    </Content>
                </Layout>
                <Modal
                    v-model="login_show"
                    title="登录"
                    ok-text="登录"
                    @on-ok="handleSubmit"
                    transfer>
                    <i-form ref="formInline" :model="formInline" :rules="ruleInline">
                        <FormItem prop="user">
                            <Input type="text" v-model="formInline.user" placeholder="用户名">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="formInline.password" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                    </i-form>
                </Modal>
            </div>`,
        created(){
            var self=this;
        },
        data(){
            return {
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码位数不正确', trigger: 'blur' }
                    ]
                },
                formInline:{
                    user:'',
                    password:''
                },
                login_show:false,
                show : true,
                isCollapsed: false,



            }
        },
        methods:{
            getUserInfo(){
                ajax.get(`/device/rest/device/userinfo/`).then(res => {
                    // this.$store.state.userinfo = res.data
                    this.$store.commit('set_userinfo',res.data)
                })
            },
            handleSubmit(){
                // this.login_show=true
                ajax({
                    url:'/login/',
                    transformRequest: [function (data) {
                        return Qs.stringify(data, {
                            encode: false,
                            arrayFormat: 'brackets'
                        });
                    }],
                    data:{
                        csrfmiddlewaretoken:csrf_token.children[0].value,
                        username:this.formInline.user,
                        password:this.formInline.password,
                    },
                    method: 'post'
                }).then(res=>{
                    if(res.data.res=='succ'){
                        this.getUserInfo()
                        this.login_show=false
                    }else{
                        this.$Message.warning("用户名或密码错误")
                        this.login_show=true
                    }

                })
            },
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },



            windowResize(){
                this.$store.commit('set_clientHeight',document.documentElement.clientHeight)
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
                if(flag==null){
                    this.$store.commit('set_ismoble',false)
                }else{
                    this.$store.commit('set_ismoble',true)
                }
                
            },
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        mounted(){
            if(this.$route.path!='/'){
                this.show = false
                router.push({ path: this.$route.path, query: this.$route.query })
            }
            
            window.onresize = ()=>{
               this.windowResize()
            }
            
        },
        created(){
            // this.getProject()
            this.getUserInfo()
        }
    });
    
}


