<template>
  <el-header class="bottomnavbar">
    <el-row type="flex" justify="space-around">
      <el-col>
        <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="left-menu hidden-sm-and-down" :router="true">
                <el-menu-item index="/puzzlegrouplist">区域列表</el-menu-item>
                <el-menu-item :index="'/puzzlegroup/' + innerGroup.pgid" v-if="innerGroup.pgid != 0">{{innerGroup.pg_name}}</el-menu-item>
        </el-menu>
        <el-menu mode="horizontal" :default-active="activeIndex" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="left-menu hidden-md-and-up" :router="true">
                <el-submenu index="/">
                <template slot="title">导航</template>
                <el-menu-item index="/puzzlegrouplist">区域列表</el-menu-item>
                <el-menu-item :index="'/puzzlegroup/' + innerGroup.pgid" v-if="innerGroup.pgid != 0">{{innerGroup.pg_name}}</el-menu-item>
                </el-submenu>
        </el-menu>
      </el-col>
      <el-col class="answer-submit-form">
          <slot></slot>
      </el-col>
      <el-col class="content-right">
        <el-badge :value="newMessage" :hidden="newMessage == 0">
          <el-menu mode="horizontal" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="right-menu" :router="true">
              <el-submenu index="system-menu">
                  <template slot="title"><i class="el-icon-menu"></i></template>
                  <el-menu-item @click="showMailbox">信箱<span class="new-badge" v-if="newMessage != 0">{{ newMessage }}</span></el-menu-item>
                  <el-menu-item @click="showInfo">显示答题信息</el-menu-item>
                  <el-menu-item index="/">返回主页</el-menu-item>
              </el-submenu>
          </el-menu>
        </el-badge>
      </el-col>
    </el-row>
    <el-dialog title="信箱" :visible.sync="showMailBoxDialog" width="90%" :modal-append-to-body="false">
      <MessageBox></MessageBox>
    </el-dialog>
  </el-header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import MessageBox from '@/components/MessageBox.vue'
import 'element-ui/lib/theme-chalk/display.css';

@Component({
    components: {
        MessageBox
    }
})
export default class BottomNavbar extends Vue {
    @Prop() private activeIndex!: string
    @Prop() private activeGroup!: {pgid: number, pg_name: string}
    showMailBoxDialog: boolean = false;
    newMessage: number = 0;
    mounted(){
      let newMessage = parseInt(localStorage.getItem("newMessage") || "0");
      if(newMessage){
        this.newMessage = newMessage;
      }else{
        this.newMessage = 0;
      }

      this.$gConst.globalBus.$on("new-message", (data: number) => {
        this.newMessage = data;
      });
    }
    get innerGroup(){
      if(this.activeGroup) return this.activeGroup;
      else return {pgid: 0, pg_name: ""};
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
    showMailbox(){
      this.showMailBoxDialog = true;
      this.newMessage = 0;
    }
    async showInfo(){


      let api = this.$gConst.apiRoot + "/play/get-game-info";
      let res = await fetchPostWithSign(api, {});
      let data = await res.json();

      if (data["status"] == 1) {
        let gameInfo = new GameInfo(data);

        const h = this.$createElement;
        this.$msgbox({
          title: "信息",
          message: h("div", [
            h('p', `已开放区域数量：${gameInfo.open_group_count}`),
            h('p', `已正确解答题目数量：${gameInfo.finished_puzzle_count}`),
            h('p', `开放新分区：${gameInfo.is_open_next_group == 1 ? "可以开放" : "不能开放"}`),
            h('p', `得分：${gameInfo.score.toFixed(2)}`),
            h('p', `罚时：${gameInfo.penalty.toFixed(2)} 小时`),
          ])
        });
      } else {
        defaultApiErrorAction(this, data);
      }
    }
}

class GameInfo{
  open_group_count: number = 0;
  finished_puzzle_count: number = 0;
  is_open_next_group: number = 0;
  score: number = 0;
  penalty: number = 0;

  constructor(obj?: any) {
      if (obj) Object.assign(this, obj);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.bottomnavbar{
  height: 60px;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #555555;
  z-index: 100;
}
.el-menu.el-menu--horizontal{
  border-bottom: none;
}
.content-right{
  text-align: right;
}
.right-menu{
  float: right;
}
.left-menu{
  float: left;
}
.answer-submit-form{
    text-align: center;
    line-height: 60px;
}
.new-badge{
  display: inline-block;
  background-color: #FF7171;
  border-radius: 10px;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #555555;
}
</style>

<style lang="scss">
.el-badge__content.is-fixed{
  transform: none;
  top: 8px;
  right: 30px;
  color: #FFFFFF;
}
</style>
