<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/tempanno"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>未发出公告管理</h1>
        <div>
          <h3>未发布公告</h3>
          <el-table :data="annoList" class="anno-info-table">
            <el-table-column label="PID" prop="pid" width="50px"></el-table-column>
            <el-table-column label="题目名" prop="puzzle_name" width="150px"></el-table-column>
            <el-table-column label="发布时间" prop="formatedDate" width="180px"></el-table-column>
            <el-table-column label="内容" prop="content"></el-table-column>
            <el-table-column label="操作" width="260px">
              <template slot-scope="u">
                <el-button type="success" size="small" @click="editAnno(u.row.pid)" v-if="u.row.is_pub == 0">发布</el-button>
                <el-button type="info" size="small" disabled v-else>已发布</el-button>
                <el-popconfirm title="是否确认删除？" @onConfirm="deleteAnno(u.row.pid)">
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
export default class TempAnnoView extends Vue {
  annoList: TempAnnoInfo[] = [];
  async mounted() {
    let api = this.$gConst.apiRoot + "/admin/get-tempanno";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data["status"] == 1) {
      if (data["temp_anno"]) {
        let newAnnoList: TempAnnoInfo[] = [];

        for (let annoItem of data["temp_anno"]) {
          newAnnoList.push(new TempAnnoInfo(annoItem));
        }
        this.annoList = newAnnoList;
      }
    } else {
      defaultApiErrorAction(this, data);
      this.$router.push("/");
    }
  }
  async editAnno(pid: number) {
    let api = this.$gConst.apiRoot + "/admin/convert-tempanno";
    let res = await fetchPostWithSign(api, {
      pid
    });
    let data = await res.json();

    if (data["status"] == 1) {
      this.$message({
        type: "success",
        message: "发布成功"
      });
      this.$gConst.globalBus.$emit("reload");
    } else {
      defaultApiErrorAction(this, data);
    }
  }
  async deleteAnno(pid: number){
    let api = this.$gConst.apiRoot + "/admin/del-tempanno";
    let res = await fetchPostWithSign(api, {
      pid
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

class TempAnnoInfo {
  pid: number = 0;
  create_time: number = 0;
  content: string = "";
  is_pub: number = 0;
  puzzle_name: string = ""

  constructor(obj?: any) {
    if (obj) Object.assign(this, obj);
  }
  get formatedDate() {
    return formatTimestamp(this.create_time);
  }
}
</script>

<style lang="scss" scoped>
.anno-info-table {
  width: 100%;
  margin-top: 20px;
}
</style>