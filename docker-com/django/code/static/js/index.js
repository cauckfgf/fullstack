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
ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
function initVue() {
    const routes = [
      { path: '/block', component: Block },
      { path: '/docker', component: Docker },
    ]
    const router = new VueRouter({
      routes // （缩写）相当于 routes: routes
    })
    _app = new Vue({
        el:"#app",
        router,
        components:{
            vueimage: vueImages.default
        },
        template:`
            <div class="layout">
                <Layout style="height: 100vh;">
                    <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                        <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses" @on-select="menuclick">
                            <MenuItem name="block">
                                <Icon type="ios-navigate"></Icon>
                                <span>区块链</span>
                            </MenuItem>
                            <MenuItem name="docker">
                                <Icon type="search"></Icon>
                                <span>Docker</span>
                            </MenuItem>
                            <MenuItem name="vue">
                                <Icon type="settings"></Icon>
                                <span>Vue</span>
                            </MenuItem>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header :style="{padding: 0}" class="layout-header-bar">
                            <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                        </Header>
                        <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                            // <router-link to="/block">Go to block</router-link>
                            // <router-link to="/docker">Go to docker</router-link>
                            <router-view></router-view>
                        </Content>
                    </Layout>
                </Layout>
            </div>`,
        created(){
            var self=this;
        },
        data(){
            return {
                isCollapsed: false
            }
        },
        methods:{
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            menuclick(name){
                router.push({ path: name })
                // // 字符串
                // router.push('home')

                // // 对象
                // router.push({ path: 'home' })

                // // 命名的路由
                // router.push({ name: 'user', params: { userId: 123 }})

                // // 带查询参数，变成 /register?plan=private
                // router.push({ path: 'register', query: { plan: 'private' }})
            }
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
            // Vue.nextTick(()=>{
            //     for(var i in $(".ttips")){
            //         AddMarkerPingMian('red',$(".ttips")[i])
            //     }
            // })
            
        }
    });
    
}


