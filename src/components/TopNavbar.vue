<template>
  <el-header class="topnavbar">
    <el-row type="flex">
      <el-col>
            <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="left-menu hidden-sm-and-down" :router="true">
                  <el-menu-item index="/">CCBC 11</el-menu-item>
                  <el-menu-item index="/about">关于CCBC 11</el-menu-item>
                  <el-menu-item index="/announcement">公告</el-menu-item>
                  <el-menu-item index="/scoreboard">排行榜</el-menu-item>
                  <el-submenu index="/tools">
                    <template slot="title">工具</template>
                    <el-menu-item @click="jumpP1">密码机器</el-menu-item>
                    <el-menu-item @click="jumpP2">不暴力不成活</el-menu-item>
                  </el-submenu>
                  <el-menu-item index="/userbackend" v-if="isAdmin"><el-tag type="danger" effect="dark">出题组后台</el-tag></el-menu-item>
            </el-menu>
            <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="left-menu hidden-md-and-up" :router="true">
                  <el-submenu index="/">
                    <template slot="title">CCBC 11</template>
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/about">关于CCBC 11</el-menu-item>
                    <el-menu-item index="/announcement">公告</el-menu-item>
                    <el-menu-item index="/scoreboard">排行榜</el-menu-item>
                    <el-submenu index="/tools">
                    <template slot="title">工具</template>
                      <el-menu-item @click="jumpP1">密码机器</el-menu-item>
                      <el-menu-item @click="jumpP2">不暴力不成活</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/userbackend" v-if="isAdmin"><el-tag type="danger" effect="dark">出题组后台</el-tag></el-menu-item>
                  </el-submenu>
            </el-menu>
      </el-col>
      <el-col>
        <template v-if="isLogin">
            <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="right-menu" :router="true">
                <el-submenu index="/userarea">
                  <template slot="title">{{ username }}</template>
                  <el-menu-item index="/myprofile">个人中心</el-menu-item>
                  <el-menu-item index="/repass">修改密码</el-menu-item>
                  <el-menu-item @click="logout">注销</el-menu-item>
                </el-submenu>
            </el-menu>
        </template>
        <template v-else>

            <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="right-menu" :router="true">
                  <el-menu-item index="/login">登录</el-menu-item>
                  <el-menu-item index="/reg">注册</el-menu-item>
            </el-menu>
        </template>
      </el-col>
    </el-row>
  </el-header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import 'element-ui/lib/theme-chalk/display.css';

@Component
export default class TopNavbar extends Vue {
    @Prop() private activeIndex!: string

    get isLogin(){
      return localStorage.getItem("token") !== null;
    }

    get isAdmin(){
      return parseInt(localStorage.getItem("roleid") || "0") >= 4;
    }

    get username(){
      return localStorage.getItem("username") || "[空名称][NULL]";
    }

    async logout(){
      let api = this.$gConst.apiRoot + "/user-logout";
      let res = await fetchPostWithSign(api, {});
      let data = await res.json();

      if(data['status'] == 1){
        this.$gConst.globalBus.$emit("log-out", {
              type: "success",
              message: "成功注销"
        });
      }else{
        defaultApiErrorAction(this, data);
      }
    }
    jumpP1(){
      this.jumpP("https://www.ccbcarchive.com/tool/index(old).html");
    }
    jumpP2(){
      this.jumpP("https://www.ccbcarchive.com/tool/puzzlecalculator(old).htm");
    }
    jumpP(url: string){
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
  z-index: 100;
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
