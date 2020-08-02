<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>CCXC 后台</h1>
        <div v-html="overviewHtml"></div>
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
export default class AdminHomeView extends Vue {
  overviewHtml: string = "";
  async mounted(){
    let grpapi = this.$gConst.apiRoot + "/admin/overview";
    let grpres = await fetchPostWithSign(grpapi, {});
    let grpdata = await grpres.json();

    if (grpdata["status"] == 1) {
        this.overviewHtml = grpdata.result;
    } else {
        defaultApiErrorAction(this, grpdata);
        this.$router.push("/");
    }
  }
}
</script>