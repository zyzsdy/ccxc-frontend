<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
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
</style>