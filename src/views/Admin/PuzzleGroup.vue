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
                <el-checkbox v-model="editingPuzzleGroupItem.isHide">隐藏分区</el-checkbox>
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
            <el-table-column label="分区名称" prop="pg_name">
              <template slot-scope="u">
                <span>{{ u.row.pg_name }}</span>
                <el-tag v-if="u.row.isHide" effect="dark" size="mini">隐藏分区</el-tag>
              </template>
            </el-table-column>
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

        <div>
          <h3>可访问分组控制</h3>
          <el-alert
            title="通过此处控制答题者在8x8格子里能看到的题目组数。当前值为1时，可以看到分组1内的小题，当前值为2时可以看到分组1和2的小题，当前值为3时可以看到分组1、2、3的小题。"
            description="每当有队伍通过meta，此处的分组控制值都会自动增加1。"
            type="info"
            effect="dark"
            show-icon
            :closable="false"
          ></el-alert>
          <h2>当前值： {{ avaliableGroupId }}</h2>
          <el-button type="primary" @click="setAvaliableGroupId(1)">1</el-button>
          <el-button type="primary" @click="setAvaliableGroupId(2)">2</el-button>
          <el-button type="primary" @click="setAvaliableGroupId(3)">3</el-button>
        </div>

        <div>
          <h3>提示币价格</h3>
          <el-row>
            <el-col :span="2"><span>默认消耗</span></el-col>
            <el-col :span="4"><el-input v-model="tipsCost.cost_default"></el-input></el-col>
            <el-col :span="2"><span>Meta消耗</span></el-col>
            <el-col :span="4"><el-input v-model="tipsCost.cost_meta"></el-input></el-col>
            <el-button type="primary" @click="updateTipsCost">更新</el-button>
          </el-row>
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
    avaliableGroupId: number = 1;
    tipsCost: TipsCost = new TipsCost();
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
            this.avaliableGroupId = data["avaliable_group_id"];
            this.tipsCost.cost_default = data["tips_cost_default"];
            this.tipsCost.cost_meta = data["tips_cost_meta"];
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
                pg_desc: this.editingPuzzleGroupItem.pg_desc,
                is_hide: this.editingPuzzleGroupItem.isHide ? 1 : 0
            });
            data = await res.json();
        } else {
            let api = this.$gConst.apiRoot + "/admin/edit-puzzle-group";
            let res = await fetchPostWithSign(api, {
                pgid: this.editingPuzzleGroupItem.pgid,
                pg_name: this.editingPuzzleGroupItem.pg_name,
                pg_desc: this.editingPuzzleGroupItem.pg_desc,
                is_hide: this.editingPuzzleGroupItem.isHide ? 1 : 0
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
    async setAvaliableGroupId(value: number) {
        let api = this.$gConst.apiRoot + "/admin/set-avaliable-group-id";
        let res = await fetchPostWithSign(api, {
            value
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "修改成功"
            });
            this.$gConst.globalBus.$emit("reload");
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    async updateTipsCost(){
        let api = this.$gConst.apiRoot + "/admin/update-tips-cost";
        let res = await fetchPostWithSign(api, {
            tips_cost_default: this.tipsCost.cost_default,
            tips_cost_meta: this.tipsCost.cost_meta
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "修改成功"
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
    isHide: boolean = false;

    constructor(obj?: any) {
        if (obj) Object.assign(this, obj);
        if(obj && obj["is_hide"] && obj["is_hide"] == 1) this.isHide = true;
        else this.isHide = false;
    }

    get firstLine(){
        return this.pg_desc.split("\n")[0];
    }
}

class TipsCost{
    cost_default: number = 0;
    cost_meta: number = 0;
}
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  margin-top: 20px;
}
</style>