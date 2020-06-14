<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/announcement"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>公告管理</h1>
        <div>
          <h3>发送新公告</h3>
          <div>
            <el-input
              type="textarea"
              placeholder="使用Markdown格式书写内容"
              v-model="newAnnoString"
              :autosize="{minRows: 8}"
            ></el-input>
          </div>
          <div style="margin-top: 10px">
            <el-button type="primary">发送</el-button>
          </div>
        </div>
        <div>
            <h3>历史公告</h3>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { fetchPostWithSign, defaultApiErrorAction } from "@/utils/fetchPost";

@Component({
  components: {
    AdminSidebar
  }
})
export default class AnnouncementView extends Vue {
  newAnnoString: string = "";
}
</script>