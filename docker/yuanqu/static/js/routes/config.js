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
                            <template slot-scope="{ row, index }" v-for="item in table_columns" :slot="item.slot">
                                <template v-if="edit.index==index">
                                    <Input  type="text" v-if='item.filters==null' v-model="row[item.slot]"/>
                                    <Select v-else v-model="row[item.slot]" style="width:200px">
                                        <Option v-for="i in filters[item.slot]" :value="i.value" :key="i.value">{{ i.label }}</Option>
                                    </Select>
                                </template>
                                <template v-else>
                                    <template v-if='item.filters==null'>
                                        {{row[item.slot]}}
                                    </template>
                                    <template v-else>
                                        {{row[item.slot+'_name']}}
                                    </template>
                                </template>
                            </template>
                            <template slot-scope="{ row, index }" slot="action">
                                <div v-if="edit.index === index">
                                    <Button type="info" size="small" @click="handleSave(row,index)">保存</Button>
                                    <Button type="warning" size="small" @click="edit.index = -1">取消</Button>
                                </div>
                                <div v-else>
                                    <Button  type="primary" size="small" style="margin-right: 5px" @click="handleEdit(row, index)">修改</Button>
                                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                                </div>
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
            filters:{
                system:[],
                system_type:[],
                devicetype:[]
            },
            edit:{
                index:-1,
            },
            save_url:''
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
            this.resetFilter()
            this.initTable()
        },
        home(){
            this.$router.push('/')
            _app.show=true;
        },
        resetFilter(){
            this.filter={
                page:1
            }
            this.edit.index = -1;
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
            this.resetFilter()
            this.initTable()
        },
        pageChange(p){
            this.filter.page=p
            this.initTable()
        },
        handleEdit(row, index){
            //修改用户，站点等等
            this.edit.index = index;
        },
        handleSave(row, index){
            if(row.system==0){
                row.system=null
            }else if(row.devicetype==0){
                row.devicetype=null
            }else if(row.systemtype==0){
                row.systemtype=null
            }
            ajax({
                    url: `${this.save_url}${row.id}/`,
                    // transformRequest: [function (data) {
                    //     return Qs.stringify(data, {
                    //         encode: false,
                    //         arrayFormat: 'brackets'
                    //     });
                    // }],
                    data:row,
                    method: 'PATCH'
                }).then(res=>{
                    this.edit.index = -1;
                    this.table_data[index]=res.data
                    this.table_data.push({})
                    this.table_data.pop()
                })
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
        getParams(){
            // 获取table的过滤参数
            var params = ''
            for(var i in this.filter){
                params += params+`&${i}=${this.filter[i]}`
            }
            return params
        },
        deviceTable(){
            var params = this.getParams()
            this.save_url = '/device/rest/device/'
            ajax.get(`/device/rest/device/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '设备名称',
                        slot: 'name'
                    },
                    {
                        title: '设备类型',
                        slot: 'devicetype',
                        filters: this.filters.devicetype,
                        filterRemote:(value,row)=>{
                            this.filter.devicetype=value
                            this.initTable()
                        }
                    },
                    {
                        title: '所属系统',
                        slot: 'system',
                        filters: this.filters.system,
                        filterRemote:(value,row)=>{
                            this.filter.system=value
                            this.initTable()
                        }
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
            var params = this.getParams()
            this.save_url = '/device/rest/system/'
            ajax.get(`/device/rest/system/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '系统名称',
                        slot: 'name'
                    },
                    {
                        title: '系统类型',
                        slot: 'system_type',
                        filters: this.filters.system_type,
                        filterRemote:(value,row)=>{
                            this.filter.systemtype=value
                            this.initTable()
                        }
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
            var params = this.getParams()
            this.save_url = '/config/rest/user/'
            ajax.get(`/config/rest/user/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '用户名',
                        slot: 'username'
                    },
                    {
                        title: '是否是管理员',
                        slot: 'is_staff'
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
            var params = this.getParams()
            this.save_url = '/device/rest/project/'
            ajax.get(`/device/rest/project/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '站点名称',
                        slot: 'name',
                        width: 150,
                    },
                    {
                        title: '经纬度',
                        slot: 'position',
                        width: 200,
                    },
                    {
                        title: '所属用户',
                        slot: 'users'
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
        getDefault(){
            //获取默认参数 设备类型 等用于过滤
            ajax.get(`/device/rest/system/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.system.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
                this.filters.system.push({
                    label:'--',
                    value:0,
                })
            })
            ajax.get(`/device/rest/systemtype/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.system_type.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
                this.filters.system_type.push({
                    label:'--',
                    value:0,
                })
            })
            ajax.get(`/device/rest/devicetype/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.devicetype.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
                this.filters.devicetype.push({
                    label:'--',
                    value:0,
                })
            })

        }
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
        this.initTable()
    },
    created(){
        this.getDefault()
    },

}

