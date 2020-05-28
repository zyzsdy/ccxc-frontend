<template>
  <div class="home">
    <TopNavbar activeIndex="/"></TopNavbar>
    <el-row>
      <el-col :sm="24" :md="{span: 12, offset: 6}">
        <div class="title-logo">
          CCBC X
        </div>
        <div class="countdown hidden-sm-and-down">{{countdown}}</div>
        <div class="countdown-md hidden-md-and-up">{{countdown}}</div>
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
import { fetchPost, defaultApiErrorAction } from '@/utils/fetchPost';

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
  async startCountdown(){
    while(this.$route.path == '/'){
      this.countdown = formatCountdown(this.endTimestamp);
      await sleep(1000);
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