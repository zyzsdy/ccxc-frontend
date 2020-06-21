<template>
  <div id="app">
    <router-view v-if="isRouterVisible"></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  isRouterVisible = true

  created(){
    this.$gConst.globalBus.$on("show-error", (message: string) => {
      this.$message({
        message: message,
        type: "error"
      });
    });
    this.$gConst.globalBus.$on("redirect-location", (data: {message: string, location: string}) => {
      this.$message({
        message: data.message,
        type: "error"
      });
      this.$router.push(data.location);
    });
    this.$gConst.globalBus.$on("log-out", (data: {message: string, type: "error" | "success" | "warning" | "info" | undefined}) => {
      localStorage.removeItem("uid");
      localStorage.removeItem("username");
      localStorage.removeItem("roleid");
      localStorage.removeItem("token");
      localStorage.removeItem("sk");
      this.$alert(data.message, "您的登录已经注销", {
        type: data.type
      });
      this.reload();
      this.$router.push("/login");
    });
    this.$gConst.globalBus.$on("reload", () => {
      this.reload();
    });
  }

  reload(){
    this.isRouterVisible = false;
    this.$nextTick(() => {
      this.isRouterVisible = true;
    });
  }
}
</script>

<style>
body{
  margin: 0;
  background-color: #252525;
  color: #FFFFFF;
}
.home{
  padding-top: 60px;
}

img{
  width: 100%;
}
</style>