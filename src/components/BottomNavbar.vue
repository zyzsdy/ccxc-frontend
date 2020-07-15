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
      <el-col>
        <el-menu mode="horizontal" background-color="#555555" text-color="#FFFFFF" active-text-color="#F561A4" class="right-menu" :router="true">
            <el-submenu index="system-menu">
                <template slot="title"><i class="el-icon-menu"></i></template>
                <el-menu-item @click="showMailbox">信箱</el-menu-item>
                <el-menu-item @click="showHelp" index="show-help">显示帮助</el-menu-item>
                <el-menu-item index="/">返回主页</el-menu-item>
            </el-submenu>
        </el-menu>
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
    }
    showHelp(){
        
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
</style>
