<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/announcement"></AdminSidebar>
      </el-aside>
      <el-main>
        <el-dialog title="预览" :visible.sync="previewVisible">
          <div v-html="previewHtml"></div>
        </el-dialog>

        <h1>公告管理</h1>
        <div>
          <h3 v-if="editAid == 0">新公告</h3>
          <h3 v-else>正在编辑公告 AID:{{editAid}}</h3>
          <div>
            <el-input
              type="textarea"
              placeholder="使用Markdown格式书写内容"
              v-model="newAnnoString"
              :autosize="{minRows: 8}"
            ></el-input>
          </div>
          <div style="margin-top: 10px">
            <el-button type="primary" @click="addOrSaveAnno">提交</el-button>
            <el-button @click="preview">预览</el-button>
            <el-button type="success" @click="setNew">新建</el-button>
          </div>
        </div>
        <div>
          <h3>历史公告</h3>
          <el-table :data="annoList" class="anno-info-table">
            <el-table-column label="ID" prop="aid" width="50px"></el-table-column>
            <el-table-column label="发布时间" prop="formatedDate"></el-table-column>
            <el-table-column label="更新时间" prop="formatedUpdateDate"></el-table-column>
            <el-table-column label="内容" prop="firstLine"></el-table-column>
            <el-table-column label="操作" width="260px">
              <template slot-scope="u">
                <el-button type="success" size="small" @click="editAnno(u.row.aid)">编辑</el-button>
                <el-popconfirm title="是否确认删除？" @onConfirm="deleteAnno(u.row.aid)">
                  <el-button
                    slot="reference"
                    type="danger"
                    size="small"
                    plain
                    style="margin-left: 5px"
                  >删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { fetchPostWithSign, defaultApiErrorAction } from "@/utils/fetchPost";
import { formatTimestamp } from "@/utils/formatDate";
import marked from "marked";

@Component({
  components: {
    AdminSidebar
  }
})
export default class AnnouncementView extends Vue {
  annoList: AnnouncementInfo[] = [];
  editAid = 0;
  newAnnoString: string = "";
  previewVisible: boolean = false;
  previewHtml: string = "";
  async mounted() {
    let api = this.$gConst.apiRoot + "/get-announcement";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data["status"] == 1) {
      if (data["announcements"]) {
        let newAnnoList: AnnouncementInfo[] = [];

        for (let annoItem of data["announcements"]) {
          newAnnoList.push(new AnnouncementInfo(annoItem));
        }
        this.annoList = newAnnoList;
      }
    } else {
      defaultApiErrorAction(this, data);
      this.$router.push("/");
    }
  }
  preview() {
    this.previewHtml = marked(this.newAnnoString);
    this.previewVisible = true;
  }
  async addOrSaveAnno() {
    if (this.newAnnoString == "") {
      this.$message({
        type: "warning",
        message: "内容不能为空"
      });
      return;
    }

    let data;
    if (this.editAid == 0) {
      let api = this.$gConst.apiRoot + "/admin/add-announcement";
      let res = await fetchPostWithSign(api, {
        content: this.newAnnoString
      });
      data = await res.json();
    } else {
      let api = this.$gConst.apiRoot + "/admin/edit-announcement";
      let res = await fetchPostWithSign(api, {
        aid: this.editAid,
        content: this.newAnnoString
      });
      data = await res.json();
    }

    if (data["status"] == 1) {
      this.$message({
        type: "success",
        message: "公告发布成功"
      });
      this.$gConst.globalBus.$emit("reload");
    } else {
      defaultApiErrorAction(this, data);
    }
  }
  setNew() {
    this.editAid = 0;
    this.newAnnoString = "";
  }
  editAnno(aid: number) {
    let annoItem = this.annoList.find(it => it.aid == aid);
    if(annoItem) {
      this.editAid = annoItem.aid;
      this.newAnnoString = annoItem.content;
    }
  }
  async deleteAnno(aid: number){
      let api = this.$gConst.apiRoot + "/admin/delete-announcement";
      let res = await fetchPostWithSign(api, {
        aid
      });
      let data = await res.json();

      if (data["status"] == 1) {
      this.$message({
        type: "success",
        message: "删除成功"
      });
      this.$gConst.globalBus.$emit("reload");
    } else {
      defaultApiErrorAction(this, data);
    }
  }
}

class AnnouncementInfo {
  aid: number = 0;
  update_time: number = 0;
  create_time: number = 0;
  content: string = "";

  constructor(obj?: any) {
    if (obj) Object.assign(this, obj);
  }
  get formatedDate() {
    return formatTimestamp(this.create_time);
  }
  get formatedUpdateDate() {
    return formatTimestamp(this.update_time);
  }
  get firstLine() {
    return this.content.split("\n")[0];
  }
}
</script>

<style lang="scss" scoped>
.anno-info-table {
  width: 100%;
  margin-top: 20px;
}
</style>