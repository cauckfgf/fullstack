const config = { 
    components:{
        // transactions
        'v-chart':VueECharts
    },
    template:`<div style="width: 100%;  height: 100%;">
                <Header class='self-header'>
                    <Menu mode="horizontal" @on-select="menuChange" :theme="theme" :active-name="menu_active1" style="width: 100%;">
                        <a href="javascript:void(0)" @click="home">
                            <img class="layout-logo" src="/static/image/timg1.png" ></img>
                        </a>
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

                <Split v-model="split1">
                    
                    <div slot="left">
                        <Menu :theme="theme" style="width:100%;" @on-select="submenuChange" :active-name="menu_active2" >
                            <MenuItem v-for="s in submenu" :name="s">{{s}}</MenuItem>
                        </Menu>
                    </div>
                    <div slot="right" style="width: 100%;  height: 100%;">
                        <Row>
                            <Col span="12"><Breadcrumb :style="{margin: '16px'}">
                                <Breadcrumb>
                                    <BreadcrumbItem >{{menu_active1}}</BreadcrumbItem>
                                    <BreadcrumbItem >{{menu_active2}}</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                            <Col span="12">
                                <Page  :page-size="20" style="margin:15px;float:right;" :total="table_count" @on-change="pageChange" show-elevator />
                            </Col>
                        </Row>
                            

                        <Table :height="table_height" stripe  border ref="selection" :columns="table_columns" :data="table_data">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="primary" size="small" style="margin-right: 5px" @click="change(index)">修改</Button>
                                <Button type="error" size="small" @click="remove(index)">删除</Button>
                            </template>
                        </Table>
                    </div>
                </Split>
    </div>`,
    
    data(){
        return {
            theme:'light',//菜单主题
            split1:0.15,
            menu_active1:'站点管理',
            menu_active2:'站点',
            filter:{
                page:1
            },
            submenu:['站点','系统','设备'],
            table_columns:[],
            table_data:[],
            table_count:0,
        }
    },
    filters: {
        formatLable: function(data) {
            return `点位${data}`
        }
    },
    methods:{
        submenuChange(name){
            this.menu_active2=name
            this.initTable()
        },
        home(){
            this.$router.push('/')
            _app.show=true;
        },
        menuChange(name){
            this.menu_active1=name
            if(name=='站点管理'){
                this.submenu=['站点','系统','设备']
            }else if(name=='用户管理'){
                this.submenu=['用户','权限','分组']
            }else if(name=='综合设置'){
                this.submenu=['消息通知']
            }
            this.menu_active2=this.submenu[0]
            this.initTable()
        },
        pageChange(p){
            this.filter.page=p
            this.initTable()
        },
        change(){
            //修改用户，站点等等
        },
        remove(){
            //删除用户，站点等等
        },
        initTable(){
            if(this.menu_active2=='站点'){
                this.projectTable()
            }else if(this.menu_active2=='系统'){
                this.systemTable()
            }else if(this.menu_active2=='设备'){
                this.deviceTable()
            }else if(this.menu_active2=='用户'){
                this.userTable()
            }else if(this.menu_active2=='权限'){

            }else if(this.menu_active2=='分组'){

            }else if(this.menu_active2=='消息通知'){

            }
        },
        deviceTable(){
            ajax.get(`/device/rest/device/?pagesize=15&page=${this.filter.page}`).then(res=>{
                this.table_columns=[
                    {
                        title: '设备名称',
                        key: 'name'
                    },
                    {
                        title: '设备类型',
                        key: 'devicetype_name'
                    },
                    {
                        title: '所属系统',
                        key: 'system'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ]
                this.table_data=res.data.results
                this.table_count=res.data.count
            })
        },
        systemTable(){
            ajax.get(`/device/rest/system/?pagesize=15&page=${this.filter.page}`).then(res=>{
                this.table_columns=[
                    {
                        title: '系统名称',
                        key: 'name'
                    },
                    {
                        title: '系统类型',
                        key: 'system_type'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ]
                this.table_data=res.data.results
                this.table_count=res.data.count
            })
        },
        userTable(){
            ajax.get(`/config/rest/user/?pagesize=15&page=${this.filter.page}`).then(res=>{
                this.table_columns=[
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '是否是管理员',
                        key: 'is_staff'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ]
                this.table_data=res.data.results
                this.table_count=res.data.count
            })
        },
        projectTable(){
            ajax.get(`/device/rest/project/?pagesize=15&page=${this.filter.page}`).then(res=>{
                this.table_columns=[
                    {
                        title: '站点名称',
                        key: 'name',
                        width: 150,
                    },
                    {
                        title: '经纬度',
                        key: 'position',
                        width: 200,
                    },
                    {
                        title: '所属用户',
                        key: 'users'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ]
                this.table_data=res.data.results
                this.table_count=res.data.count
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
        },
        table_height(){
            return store.state.clientHeight-130;
        },
    },
    mounted(){

    },
    created(){
        this.initTable()
        
    },

}

