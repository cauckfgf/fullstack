<template>
  <div id="app">
    <router-view/>
    <GoodsAction >
      <GoodsActionButton type="warning" text="首页" @click="onClickButton" />
      <GoodsActionButton type="danger" text="退出" @click="onClickButton" />
    </GoodsAction>
  </div>
</template>
<script>
  import {
    GoodsAction,
    GoodsActionButton
  } from 'vant';
  import 'vant/lib/goods-action/style';
  import 'vant/lib/goods-action-button/style';
  export default{
    components:{
      GoodsAction,
      GoodsActionButton
    },
    methods:{
      onClickButton(){
        this.$router.push('/')
      }
    }
  }

</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
