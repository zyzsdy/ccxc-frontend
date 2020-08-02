<template>
  <div class="home">
    <TopNavbar activeIndex="/"></TopNavbar>
    <el-row>
      <el-col :sm="24" :md="{span: 12, offset: 6}">
        <div class="title-logo" v-if="isFinishCountdown" @click="startGame">
          CCBC X
        </div>
        <div v-else>
          <div class="countdown hidden-sm-and-down">{{countdown}}</div>
          <div class="countdown-md hidden-md-and-up">{{countdown}}</div>
          <el-button @click="startGame" v-if="isAAAA">emmmmmm</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Prop, Vue } from 'vue-property-decorator';
import TopNavbar from '@/components/TopNavbar.vue'
import { formatCountdown } from '@/utils/formatDate'
import { sleep } from '@/utils/asyncUtils'
import 'element-ui/lib/theme-chalk/display.css';
import { fetchPost, fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';

@Component({
    components: {
        TopNavbar
    }
})
export default class HomeView extends Vue {
  countdown: string = "0d 00:00:00";
  endTimestamp: number = 1596801600000;
  async mounted(){
    this.startCountdown();

    let api = this.$gConst.apiRoot + "/get-default-setting";
    let res = await fetchPost(api, {});
    let data = await res.json();

    if(data['status'] == 1){
      this.endTimestamp = data['start_time'];
    }else{
      defaultApiErrorAction(this, data);
    }
  }
  get isFinishCountdown(){
    let nowtime = new Date().getTime();
    return nowtime > this.endTimestamp;
  }
  get isAAAA(){
    return localStorage.getItem("etc") == "52412";
  }
  async startCountdown(){
    while(this.$route.path == '/'){
      this.countdown = formatCountdown(this.endTimestamp);
      await sleep(1000);
    }
  }
  isLogin(){
    return localStorage.getItem("token") !== null;
  }
  isReguser(){
    return parseInt(localStorage.getItem("roleid") || "0") >= 2;
  }
  async startGame(){
    if(!this.isLogin()){
      this.$router.push('/login')
      return;
    }

    if(!this.isReguser()){
      this.$router.push('/myprofile');
      this.$message.error("未报名用户不能参赛。");
      return;
    }


    let api = this.$gConst.apiRoot + "/start";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if(data['status'] == 1){
      this.$router.push('/puzzlegrouplist');
    }else{
      defaultApiErrorAction(this, data);
    }
  }
}
</script>

<style lang="scss" scoped>
.title-logo{
  margin-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
  height: 300px;
  line-height: 300px;
  font-size: 120px;
  background-color: #a71264;
  text-align: center;
  vertical-align: middle;
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(255, 255, 255, 0.1);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.countdown{
  position: absolute;
  top: 300px;
  left: 0;
  z-index: 2;
  width: 100%;
  text-align: center;
  font-size: 160px;
}
.countdown-md{
  font-size: 60px;
  text-align: center;
}
</style>