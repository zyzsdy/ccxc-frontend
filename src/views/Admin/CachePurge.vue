<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/cachepurge"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>清理缓存</h1>
        <el-alert title="警告：本页面直接操作数据库Redis缓存。请谨慎操作"
        description="本页面操作需管理员权限。" type="warning" effect="dark" show-icon :closable="false"></el-alert>
        <div style="margin-top: 10px">
            <el-button @click="cachepurge('anno')" type="danger">公告</el-button>
            <el-button @click="cachepurge('invi')" type="danger">邀请</el-button>
            <el-button @click="cachepurge('mess')" type="danger">站内信</el-button>
            <el-button @click="cachepurge('prog')" type="danger">进度</el-button>
            <el-button @click="cachepurge('puzz')" type="danger">题目</el-button>
            <el-button @click="cachepurge('puzg')" type="danger">题目组</el-button>
            <el-button @click="cachepurge('pall')" type="danger">题目和题目组</el-button>
            <el-button @click="cachepurge('user')" type="danger">用户</el-button>
            <el-button @click="cachepurge('useg')" type="danger">用户组</el-button>
            <el-button @click="cachepurge('usgb')" type="danger">用户绑定</el-button>
            <el-button @click="cachepurge('uall')" type="danger">用户相关全部</el-button>
            <el-button @click="cachepurge('aall')" type="danger">全部</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'

@Component({
  components: {
    AdminSidebar
  }
})
export default class CachePurgeView extends Vue {
    async cachepurge(op_key: string){
        let api = this.$gConst.apiRoot + "/admin/purge-cache";
            let res = await fetchPostWithSign(api, {
                op_key
            });
            let data = await res.json();

            if(data['status'] == 1){
                this.$message({
                    message: "清理成功",
                    type: "success"
                })
            }else{
                defaultApiErrorAction(this, data);
            }
    }
}
</script>