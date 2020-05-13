<template>
  <header class="topnavbar">
    <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F789D4">
      <el-menu-item index="home">主页</el-menu-item>
      <el-menu-item>登录</el-menu-item>
      <el-menu-item>注册</el-menu-item>
    </el-menu>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TopNavbar extends Vue {
    @Prop() private activeIndex!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.topnavbar{
  height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: #555555;
}
</style>
