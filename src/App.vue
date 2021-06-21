<template>
  <div>
    <div id="app">
      <router-view v-if="isRouterVisible"></router-view>
    </div>
    <BottomBar></BottomBar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import BottomBar from '@/components/BottomBar.vue'

@Component({
    components: {
        BottomBar
    }
})
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
      this.$nextTick(() => {
        this.reload();
      })
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

    this.sendHeartbeat();
    setInterval(this.sendHeartbeat, 60000);
  }

  reload(){
    this.isRouterVisible = false;
    this.$nextTick(() => {
      this.isRouterVisible = true;
    });
  }

  isLogin(){
    return localStorage.getItem("token") !== null;
  }
  async sendHeartbeat(){
    if(!this.isLogin()) return;

    let api = this.$gConst.apiRoot + "/heartbeat";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data["status"] == 1) {
      localStorage.setItem("newMessage", data["new_message"]);
      this.$gConst.globalBus.$emit("new-message", data["new_message"]);
    } else {
      defaultApiErrorAction(this, data);
    }
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

#app{
  min-height: calc(100vh - 255px);
}
</style>