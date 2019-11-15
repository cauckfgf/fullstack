const config = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">
                <Header class='self-header'>
                    <Menu mode="horizontal" @on-select="menuChange" :theme="theme" :active-name="menu_active1" style="width: 100%;">
                        <img class="layout-logo" src="/static/image/timg1.png"></img>
                        <div class="layout-nav">
                             <Dropdown @on-click='userDrop'>
                                <a href="javascript:void(0)" >
                                    <Avatar style="background-color: #87d068" icon="ios-person" />
                                    {{ userinfo.username }}
                                </a>
                                <DropdownMenu slot="list" v-if="userinfo.islogin" >
                                    <DropdownItem name="个人中心">个人中心</DropdownItem>
                                    <DropdownItem name="系统配置">系统配置</DropdownItem>
                                    <DropdownItem name="退出">退出</DropdownItem>
                                </DropdownMenu>
                                <DropdownMenu slot="list" v-else>
                                    <DropdownItem name="登录">登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div class="layout-nav">
                            <MenuItem name="站点管理">
                                <Icon type="ios-paper" />
                                站点管理
                            </MenuItem>
                            <MenuItem name="用户管理">
                                <Icon type="ios-people" />
                                用户管理
                            </MenuItem>
                            <MenuItem name="综合设置">
                                <Icon type="ios-construct" />
                                综合设置
                            </MenuItem>
                        </div>

                    </Menu>
                </Header>
                <Breadcrumb :style="{margin: '16px'}">
                    <BreadcrumbItem >{{menu_active1}}</BreadcrumbItem>
                    <BreadcrumbItem >{{menu_active2}}</BreadcrumbItem>
                </Breadcrumb>
                <Split v-model="split1"  style="background: url('/static/image/systembg.jpg') no-repeat center!important;background-size: 100% 100%!important;">
                    
                    <div slot="left" class="demo-split-pane">
                        <Menu :theme="theme" style="width:100%;" @on-select="submenuChange" :active-name="menu_active2" >
                            <MenuItem v-for="s in submenu" :name="s">{{s}}</MenuItem>
                        </Menu>
                    </div>
                    <div slot="right" style="width: 100%;  height: 100%;">

                    </div>
                </Split>
    </div>`,
    
    data(){
        return {
            theme:'light',//菜单主题
            split1:0.15,
            menu_active1:'站点管理',
            menu_active2:'站点',
            submenu:['站点','系统','设备']

        }
    },
    filters: {
        formatLable: function(data) {
            return `点位${data}`
        }
    },
    methods:{
        submenuChange(name){
            this.menu_active1=name

        },
        menuChange(name){
            this.menu_active2=name
            if(name=='站点管理'){
                this.submenu=['站点','系统','设备']
            }else if(name=='用户管理'){
                this.submenu=['用户','权限','分组']
            }else if(name=='综合设置'){
                this.submenu=['消息通知']
            }
            this.menu_active2=this.submenu[0]

        },
        guanzhu_change(l){
            var devices = []
            var devices_all = []
            for(var i in l){
                devices.push(l[i].id)
            }
            for(var i in this.device_list){
                devices_all.push(this.device_list[i].id)
            }
            ajax({
                url:'/device/rest/device/shoucang/',
                transformRequest: [function (data) {
                    return Qs.stringify(data, {
                        encode: false,
                        arrayFormat: 'brackets'
                    });
                }],
                data:{
                    devices:devices,
                    devices_all:devices_all,
                },
                method: 'post'
            }).then(res=>{
                this.guanzhu_button_loading = false
            })
        },

        userDrop(name){
            if(name=="个人中心"){

            }else if(name=="系统配置"){
                this.$router.push('/config/')
            }else if(name=="退出"){
                ajax.get('/admin/logout/').then(res=>{
                    // this.$root.getUserInfo()
                    location.reload()
                })
            }else if(name="登录"){
                _app.login_show=true
            }
        },
    },
    computed:{
        userinfo(){
            return store.state.userinfo;
        }
    },
    mounted(){

    },
    created(){

        
    },

}

