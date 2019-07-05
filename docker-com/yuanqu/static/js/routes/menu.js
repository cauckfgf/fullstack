
ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
const menu = {
    components:{
        // vueimage: vueImages.default
    },
    template:`
        <div class="layout">
            <Layout style="height: 100vh;">
                <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                    <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses" @on-select="menuclick">
                        <MenuItem name="yuanqu">
                            <Icon type="ios-navigate"></Icon>
                            <span>院区管理</span>
                        </MenuItem>
                        <MenuItem name="yuanqu">
                            <Icon type="search"></Icon>
                            <span>拓扑图demo</span>
                        </MenuItem>
                    </Menu>
                </Sider>
                <Layout>
                    <Header :style="{padding: 0}" class="layout-header-bar">
                        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    </Header>
                    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">

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
}

