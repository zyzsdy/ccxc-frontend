<template>
  <el-menu class="right-navbar" :default-active="activeIndex" text-color="#FFFFFF" active-text-color="#F561A4" :router="true">
      <el-menu-item-group>
          <template slot="title">CCBC X 后台</template>
          <el-menu-item index="/userbackend">概览</el-menu-item>
          <el-menu-item index="/userbackend/answerlog">答案记录</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
          <template slot="title">用户与组队</template>
          <el-menu-item index="/userbackend/user">用户</el-menu-item>
          <el-menu-item index="/userbackend/group">组队</el-menu-item>
          <el-menu-item index="/userbackend/loginlog">登录记录</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
          <template slot="title">站点管理</template>
          <el-menu-item index="/userbackend/message">站内信</el-menu-item>
          <el-menu-item index="/userbackend/announcement">公告</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
          <template slot="title">题目编辑</template>
          <el-menu-item index="/userbackend/puzzle">题目管理</el-menu-item>
          <el-menu-item index="/userbackend/puzzlegroup">题目分区管理</el-menu-item>
          <el-menu-item @click="openUploadDialog">上传图片</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
          <template slot="title">系统功能</template>
          <el-menu-item index="/userbackend/cachepurge">清理缓存</el-menu-item>
          <el-menu-item index="/">返回主站</el-menu-item>
      </el-menu-item-group>
  </el-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'

@Component
export default class TopNavbar extends Vue {
    @Prop() private activeIndex!: string

    mounted(){
      if(!this.isLogin || !this.isAdmin){
        this.$router.push("/");
        this.$gConst.globalBus.$emit("log-out", {
            message: "您不能查看指定页面。",
            type: "error"
        });
      }
    }

    get isLogin(){
      return localStorage.getItem("token") !== null;
    }

    get isAdmin(){
      return parseInt(localStorage.getItem("roleid") || "0") >= 4;
    }

    get username(){
      return localStorage.getItem("username") || "[空名称][NULL]";
    }

    openUploadDialog(){

    }
}
</script>

<style lang="scss" scoped>
.right-navbar{
  background-color: #555555;
  min-height: 100vh;
}
.el-menu{
  border-right: none;
}
</style>