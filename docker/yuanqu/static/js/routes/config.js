const config = { 
    components:{
        // transactions
        'v-chart':VueECharts,
        'nenghao':nenghao
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
                                    <DropdownItem name="主页">主页</DropdownItem>
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
                        <nenghao v-if="nenghao_show"></nenghao>
                        <template v-else>
                            <Row>
                                <Col span="8"><Breadcrumb :style="{margin: '16px'}">
                                    <Breadcrumb>
                                        <BreadcrumbItem >{{menu_active1}}</BreadcrumbItem>
                                        <BreadcrumbItem >{{menu_active2}}</BreadcrumbItem>
                                    </Breadcrumb>
                                </Col>
                                <Col span="16">
                                    <Page  :page-size="15" style="margin:15px;float:right;" :total="table_count" @on-change="pageChange" show-elevator />
                                    <Button type="dashed" style="margin:15px;float:right;"icon="md-add" @click="addOBJ">添加</Button>
                                </Col>
                            </Row>
                                
                            <Table  :height="table_height" stripe  border ref="selection" :columns="table_columns" :data="table_data">
                                <template slot-scope="{ row, index }" v-for="item in table_columns" :slot="item.slot">
                                    <template v-if="edit.index==index">
                                        
                                        <Checkbox v-if="row[item.slot]===true||row[item.slot]===false" v-model="row[item.slot]"></Checkbox>
                                        <ColorPicker v-else-if="item.iscolor===true" v-model="row[item.slot]" />
                                        <Input  type="text" v-else-if='item.filters==null' v-model="row[item.slot]"/>
                                        <Select v-else-if="typeof(row[item.slot])=='object'&&row[item.slot]!=null" v-model="row[item.slot]" style="width:200px" filterable multiple>
                                            <Option v-for="i in filters[item.slot]" :value="i.value" :key="i.value">{{ i.label }}</Option>
                                        </Select>
                                        
                                        <Select v-else v-model="row[item.slot]" style="width:200px" filterable clearable>
                                            <Option v-for="i in filters[item.slot]" :value="i.value" :key="i.value">{{ i.label }}</Option>
                                        </Select>
                                    </template>
                                    <template v-else>
                                        
                                        <template v-if='row[item.slot]===true'>
                                            是
                                        </template>
                                        <template v-else-if='row[item.slot]===false'>
                                            否
                                        </template>
                                        <ColorPicker v-else-if="item.iscolor===true" v-model="row[item.slot]" disabled="true" />
                                        hasname
                                        <template v-else-if='item.hasname===true'>
                                            {{row[item.slot+'_name']}}
                                        </template>
                                        <template v-else-if='item.filters==null'>
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
                                        <Button type="error" size="small" @click="remove(row,index)">删除</Button>
                                    </div>
                                </template>
                            </Table>
                        </template>

                    </div>
                </Split>
                <Modal
                    v-model="add_user_show"
                    title="添加用户"
                    ok-text="确认"
                    @on-ok="addUserSubmit"
                    transfer>
                    <i-form ref="addUser" :model="addUser" :rules="ruleuser">
                        <FormItem prop="username">
                            <Input type="text" v-model="addUser.username" placeholder="用户名">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="addUser.password" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="repassword">
                            <Input type="password" v-model="addUser.repassword" placeholder="重复密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="isadmin">
                            <Checkbox v-model="addUser.is_staff">管理员</Checkbox>
                        </FormItem>
                    </i-form>
                </Modal>
    </div>`,
    
    data(){
        // 验证重复密码
        const repasswordValidate=(rul,value,callback)=>{
            if(this.repassword){
                if(value!==this.addUser.password){
                    callback(new Error('两次密码不一致'))
                }else{
                    callback()
                }
            }
            callback()
            this.repassword=true
        }
        return {
            theme:'light',//菜单主题
            split1:0.15,
            menu_active1:'站点管理',
            menu_active2:'站点',
            filter:{
                page:1
            },
            nenghao_show:false,
            submenu:['站点','系统','设备','设备连接线','能耗'],
            table_columns:[],
            table_data:[],
            table_count:0,
            filters:{
                system:[],
                system_type:[],
                devicetype:[],
                groups:[],
                users:[],
                project:[],
                line_style_type:[
                    {
                        label:'实线',
                        value:'solid',
                    },
                    {
                        label:'长虚线',
                        value:'dashed',
                    },
                    {
                        label:'短虚线',
                        value:'dotted',
                    },
                ]
            },
            edit:{
                index:-1,
            },
            save_url:'',
            add_user_show:false,
            addUser:{
                username:'',
                password:'',
                repassword:'',
                is_staff:false
            },
            ruleuser: {
                username: [
                    { required: true, message: '用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码位数不正确', trigger: 'blur' }
                ],
                repassword: [
                    { required: true,  trigger: 'blur' },
                    { validator:repasswordValidate, trigger: 'blur'}
                ]
            },
            repassword:false
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
        addUserSubmit(){
            ajax({
                url:this.save_url,
                data:{
                    username : this.addUser.username,
                    is_staff : this.addUser.is_staff,
                    password : this.addUser.password
                },
                method: 'post'
            }).then(res=>{
                this.table_data.push(res.data)

            })
        },
        resetAddUser(){
            this.addUser={
                username:'',
                password:'',
                repassword:'',
                is_staff:false
            }
        },
        addOBJ(){
            // 添加用户 用户组等
            if(this.menu_active2=='用户'){
                this.add_user_show=true
                this.resetAddUser()
            }else{
                ajax({
                    url:this.save_url,
                    data:{name:'名称'},
                    method: 'post'
                }).then(res=>{
                    this.table_data.push(res.data)
                    this.edit.index = this.table_data.length-1
                })
            }
        },
        menuChange(name){
            this.menu_active1=name
            if(name=='站点管理'){
                this.submenu=['站点','系统','设备','设备连接线','能耗']
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
            // if(row.system==0){
            //     row.system=null
            // }else if(row.devicetype==0){
            //     row.devicetype=null
            // }else if(row.systemtype==0){
            //     row.systemtype=null
            // }
            for(var i in row){
                if(row[i]==undefined){
                    row[i]=null
                }
            }
            delete row.password
            ajax({
                url: `${this.save_url}${this.table_data[index].id}/`,
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
        remove(row,index){
            //删除用户，站点等等
            this.$Modal.confirm({
                title:'确认删除',
                onOk:()=>{
                    ajax({
                        url: `${this.save_url}${row.id}/`,
                        // transformRequest: [function (data) {
                        //     return Qs.stringify(data, {
                        //         encode: false,
                        //         arrayFormat: 'brackets'
                        //     });
                        // }],
                        data:row,
                        method: 'DELETE'
                    }).then(res=>{
                        this.table_data.splice(index,1)
                        this.edit.index = -1;
                    })
                },
            })
                    
        },
        initTable(){
            if(this.menu_active2=='站点'){
                this.nenghao_show=false
                this.projectTable()
            }else if(this.menu_active2=='系统'){
                this.nenghao_show=false
                this.systemTable()
            }else if(this.menu_active2=='设备'){
                this.nenghao_show=false
                this.deviceTable()
            }else if(this.menu_active2=='设备连接线'){
                this.nenghao_show=false
                this.device2deviceTable()
            }else if(this.menu_active2=='能耗'){
                this.nenghao_show=true
            }
            else if(this.menu_active2=='用户'){
                this.nenghao_show=false
                this.userTable()
            }else if(this.menu_active2=='权限'){
                this.nenghao_show=false
                this.authTable()
            }else if(this.menu_active2=='分组'){
                this.nenghao_show=false
                this.groupTable()
            }else if(this.menu_active2=='消息通知'){

            }
        },
        getParams(){
            // 获取table的过滤参数
            var params = ''
            for(var i in this.filter){
                if(typeof(this.filter[i])=='object'){
                    for(var j in this.filter[i]){
                        params += `&${i}=${this.filter[i][j]}`
                    }
                }else{
                    params += `&${i}=${this.filter[i]}`
                }
                
            }
            return params
        },
        device2deviceTable(){
            var params = this.getParams()
            this.save_url = '/device/rest/device2device/'
            ajax.get(`/device/rest/device2device/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '线颜色',
                        slot: 'connection',
                        iscolor:true,
                        className: 'color_picker'
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
                        title: '是否显示流向',
                        slot: 'show_direction',
                    },
                    {
                        title: '线的类型',
                        slot: 'line_style_type',
                        hasname: true,
                        filters: this.filters.line_style_type,
                        filterRemote:(value,row)=>{
                            this.filter.line_style_type=value
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
                this.table_data=res.data
                
            })
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
                        title: '站点',
                        slot: 'project',
                        filters: this.filters.project,
                        filterRemote:(value,row)=>{
                            this.filter.project=value
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
                        slot: 'username',
                        width: 300
                    },
                    {
                        title: '所属组',
                        slot: 'groups',
                        filters: this.filters.groups,
                        filterRemote:(value,row)=>{
                            this.filter.groups=value
                            this.initTable()
                        }
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
        authTable(){
            var params = this.getParams()
            this.save_url = '/config/rest/auth/'
            ajax.get(`/config/rest/auth/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '权限名称',
                        slot: 'name'
                    },
                    {
                        title: '有权限的人员',
                        slot: 'users',
                        filters: this.filters.users,
                        filterRemote:(value,row)=>{
                            this.filter.users=value
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
        groupTable(){
            var params = this.getParams()
            this.save_url = '/config/rest/group/'
            ajax.get(`/config/rest/group/?pagesize=15&${params}`).then(res=>{
                this.table_columns=[
                    {
                        title: '权限名称',
                        slot: 'name'
                    },
                    {
                        title: '有权限的人员',
                        slot: 'users',
                        filters: this.filters.users,
                        filterRemote:(value,row)=>{
                            this.filter.users=value
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
                        slot: 'users',
                        filters: this.filters.users,
                        filterRemote:(value,row)=>{
                            this.filter.users=value
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
        
        userDrop(name){
            if(name=="个人中心"){

            }else if(name=="主页"){
                this.$router.push('/')
                _app.show=true;
            }else if(name=="退出"){
                ajax.get('/logout/').then(res=>{
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
            })
            ajax.get(`/device/rest/project/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.project.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
            })

            ajax.get(`/config/rest/group/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.groups.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
            })
            ajax.get(`/device/rest/systemtype/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.system_type.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
            })
            ajax.get(`/device/rest/devicetype/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.devicetype.push({
                        label:res.data.results[i].name,
                        value:res.data.results[i].id,
                    })
                }
            })
            ajax.get(`/config/rest/user/?pagesize=200`).then(res=>{
                for(var i in res.data.results){
                    this.filters.users.push({
                        label:res.data.results[i].username,
                        value:res.data.results[i].id,
                    })
                }

            })

        }
    },
    computed:{
        userinfo(){
            if(!store.state.userinfo.is_staff){
                this.$router.push('/')
            }
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

