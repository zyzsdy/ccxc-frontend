<template>
  <el-header class="topnavbar">
    <el-row type="flex">
      <el-col>
            <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="left-menu" :router="true">
                  <el-menu-item index="/">CCBC X</el-menu-item>
            </el-menu>
      </el-col>
      <el-col>
            <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="right-menu" :router="true">
                  <el-menu-item>登录</el-menu-item>
                  <el-menu-item index="/reg">注册</el-menu-item>
            </el-menu>
      </el-col>
    </el-row>
  </el-header>
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
.el-menu.el-menu--horizontal{
  border-bottom: none;
}
.right-menu{
  float: right;
}
.left-menu{
  float: left;
}
</style>
