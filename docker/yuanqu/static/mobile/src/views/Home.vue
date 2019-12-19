<template>
  <div class="home">
    <img alt="Vue logo" style="width: 100%;" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574246442416&di=9932a6b33fe208a8afdfcf50d9b71604&imgtype=0&src=http%3A%2F%2Ft-img.51f.com%2Fxf%2Fxw%2Ffa81cb5c-9536-40d8-8dbd-92b1983dc535.png">
    <Grid :column-num="3">
      <GridItem
        v-for="item in project"
        :key="item.id"
        icon="photo-o"
        :text="item.name"
        :to="'/station/'+item.id+'?'+'name='+item.name"
      />
    </Grid>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { Grid, GridItem } from 'vant';
import 'vant/lib/grid/style';
import 'vant/lib/grid-item/style';
import Vue from 'vue'
export default {
  name: 'home',
  components: {
    Grid,
    GridItem
  },
  data(){
    return {
        project:[]
    }
  },
  created(){
        Vue.axios.get(`${this.$store.state.api}/device/rest/project/?pagesize=200`).then((res) => {
            this.project = res.data.results
        })
  }
}
</script>
