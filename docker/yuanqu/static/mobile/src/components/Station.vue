<template>
  <div>
    <NavBar
      :title="$route.query.name"
      left-text="返回"

      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <Cell title="选择系统" :value="activeKeyName" @click="pop_show=!pop_show" is-link> 
    </Cell>
    <PullRefresh v-model="loading" @refresh="getDevice">

        
          <van-panel v-for="item in device"  :key="item.id" >
            <div class="device">
              {{item.name}}
              <CellGroup style="width:40%">
                <!-- <van-image width="100" height="100" src="../assets/image/39.png"></van-image> -->
                <Cell v-for="s in item.sensors" :key="s.id" :title="s.name" :value="s.lastdata+s.unit"  @click="null"/>
              </CellGroup>
            </div>
          </van-panel>


    </PullRefresh>
    <Popup v-model="pop_show" position="bottom" :style="{ height: '30%' }" overlay>
      <Cell v-for="item in system" :key="item.id" :title="item.name"   @click="changeSystem(item)"/>
    </Popup>
  </div>
</template>

<script>
// import { Row, Col } from 'vant';
import Vue from 'vue'
import { NavBar } from 'vant';
import { Popup, Cell, CellGroup,  Panel, PullRefresh } from 'vant';
import 'vant/lib/nav-bar/style';
import 'vant/lib/sidebar/style';
import 'vant/lib/sidebar-item/style';
import 'vant/lib/popup/style';
import 'vant/lib/cell/style'
import 'vant/lib/image/style'
import 'vant/lib/panel/style'
import 'vant/lib/list/style'
import 'vant/lib/pull-refresh/style'
// Vue.use(NavBar);
export default {
  name: 'Station',
  components: {
    NavBar,
    // Sidebar,
    // SidebarItem,
    Popup,
    Cell,
    
    CellGroup,
    PullRefresh,
    // 'van-image' : Image,
    'van-panel' : Panel,

  },
  props: ['id'],
  methods: {
    onClickLeft() {
      this.$router.push('/')
    },
    onClickRight() {
      
    },
    changeSystem(item){
      this.activeKeyName=item.name
      this.pop_show=false
      this.system_active = item.id
      this.getDevice()
    },
    getDevice(){
      this.loading=true
      Vue.axios.get(`${this.$store.state.api}/device/rest/device/?pagesize=10&system=${this.system_active}&Sensor__isnull=false&page=${this.device_page}`).then((res) => {
        this.device = res.data.results
        this.loading=false
        // this.finished=true
      })
    }
  },
  data(){
    return {
      system:[],
      activeKey: 0,
      activeKeyName:'',
      pop_show:false,
      device:[],
      loading: false,
      finished: false,
      system_active:null,
      device_page:1,
    }
  },
  created(){
    Vue.axios.get(`${this.$store.state.api}/device/rest/system/?pagesize=200&project=${this.$route.params.id}`).then((res) => {
        this.system = res.data.results
        this.system_active = this.system[0].id
        this.getDevice()
        this.activeKeyName=this.system[0].name
    })
  }
}
</script>


<style>
.van-cell__title{
      text-align: left;
}
.device{
  display: flex;
  display: -webkit-flex; 
  justify-content: space-between;
  align-items:center;
  padding: 0 15px;
}
</style>