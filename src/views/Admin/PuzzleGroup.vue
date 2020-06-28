<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/puzzlegroup"></AdminSidebar>
      </el-aside>
      <el-main>
        <el-dialog title="预览" :visible.sync="previewVisible">
          <div v-html="previewHtml"></div>
        </el-dialog>

        <h1>题目分区管理</h1>

        <div>
          <h3 v-if="editingPuzzleGroupItem.pgid == 0">新建题目分区</h3>
          <h3 v-else>正在编辑题目分区 ID:{{editingPuzzleGroupItem.pgid}}</h3>
          <div>
            <div>
                <span>分区名称：</span>
                <el-input v-model="editingPuzzleGroupItem.pg_name"></el-input>
            </div>
            <div>
                <span>分区内容：</span>
                <el-input
                type="textarea"
                placeholder="使用Markdown格式书写内容"
                v-model="editingPuzzleGroupItem.pg_desc"
                :autosize="{minRows: 8}"
                ></el-input>
            </div>
          </div>
          <div style="margin-top: 10px">
            <el-button type="primary" @click="addOrSavePgrp">提交</el-button>
            <el-button @click="preview">预览</el-button>
            <el-button type="success" @click="setNew">新建</el-button>
          </div>
        </div>

        <div>
          <h3>已有题目分区</h3>
          <el-table :data="pgList" class="info-table">
            <el-table-column label="ID" prop="pgid" width="50px"></el-table-column>
            <el-table-column label="分区名称" prop="pg_name"></el-table-column>
            <el-table-column label="内容" prop="firstLine"></el-table-column>
            <el-table-column label="操作" width="260px">
              <template slot-scope="u">
                <el-button type="success" size="small" @click="editPgrp(u.row.pgid)">编辑</el-button>
                <el-popconfirm title="是否确认删除？" @onConfirm="deletePgrp(u.row.pgid)">
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
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import marked from "marked";

@Component({
  components: {
    AdminSidebar
  }
})
export default class PuzzleGroupView extends Vue {
    editingPuzzleGroupItem: PuzzleGroupItem = new PuzzleGroupItem();
    pgList: PuzzleGroupItem[] = [];
    previewVisible: boolean = false;
    previewHtml: string = "";
    setNew() {
        this.editingPuzzleGroupItem = new PuzzleGroupItem();
    }
    preview() {
        this.previewHtml = marked(this.editingPuzzleGroupItem.pg_desc);
        this.previewVisible = true;
    }
    async mounted() {
        let api = this.$gConst.apiRoot + "/admin/get-puzzle-group";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if (data["status"] == 1) {
            if (data["puzzle_group"]) {
                let newPgList: PuzzleGroupItem[] = [];

                for (let pgItem of data["puzzle_group"]) {
                    newPgList.push(new PuzzleGroupItem(pgItem));
                }
                this.pgList = newPgList;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
    async addOrSavePgrp(){
        if (this.editingPuzzleGroupItem.pg_name == "") {
            this.$message({
                type: "warning",
                message: "分区标题不能为空"
            });
            return;
        }

        let data;
        if (this.editingPuzzleGroupItem.pgid == 0) {
            let api = this.$gConst.apiRoot + "/admin/add-puzzle-group";
            let res = await fetchPostWithSign(api, {
                pg_name: this.editingPuzzleGroupItem.pg_name,
                pg_desc: this.editingPuzzleGroupItem.pg_desc
            });
            data = await res.json();
        } else {
            let api = this.$gConst.apiRoot + "/admin/edit-puzzle-group";
            let res = await fetchPostWithSign(api, {
                pgid: this.editingPuzzleGroupItem.pgid,
                pg_name: this.editingPuzzleGroupItem.pg_name,
                pg_desc: this.editingPuzzleGroupItem.pg_desc
            });
            data = await res.json();
        }

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "分区编辑成功"
            });
            this.$gConst.globalBus.$emit("reload");
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    editPgrp(pgid: number){
        let pgItem = this.pgList.find(it => it.pgid == pgid);
        if(pgItem) {
            this.editingPuzzleGroupItem = new PuzzleGroupItem(pgItem);
        }
    }
    async deletePgrp(pgid: number){
        let api = this.$gConst.apiRoot + "/admin/delete-puzzle-group";
        let res = await fetchPostWithSign(api, {
            pgid
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

class PuzzleGroupItem{
    pgid: number = 0;
    pg_name: string = "";
    pg_desc: string = "";

    constructor(obj?: any) {
        if (obj) Object.assign(this, obj);
    }

    get firstLine(){
        return this.pg_desc.split("\n")[0];
    }
}
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  margin-top: 20px;
}
</style>