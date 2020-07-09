<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/puzzle"></AdminSidebar>
      </el-aside>
      <el-main>
        <el-dialog title="预览" :visible.sync="previewVisible">
          <div v-html="previewHtml"></div>
        </el-dialog>

        <h1>题目管理</h1>

        <div>
          <h3 v-if="editingPuzzleItem.pid == 0">新建题目</h3>
          <h3 v-else>正在编辑题目 ID:{{editingPuzzleItem.pid}}</h3>
          <div class="new-puzzle-area">
            <el-row>
                <el-col :span="2"><span>题目名称：</span></el-col>
                <el-col :span="4"><el-input v-model="editingPuzzleItem.title"></el-input></el-col>
                <el-col :span="2"><span>所属分组：</span></el-col>
                <el-col :span="4">
                    <el-select v-model="editingPuzzleItem.pgid" placeholder="选择题目分组">
                        <el-option
                            v-for="pg in pgList"
                            :key="pg.pgid"
                            :label="pg.showtitle"
                            :value="pg.pgid">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"><span>内容类型：</span></el-col>
                <el-col :span="4">
                    <el-select v-model="editingPuzzleItem.type" placeholder="内容类型">
                        <el-option
                            v-for="it in contentTypeOptions"
                            :key="it.id"
                            :label="it.label"
                            :value="it.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"><span>题目类型：</span></el-col>
                <el-col :span="4">
                    <el-select v-model="editingPuzzleItem.answer_type" placeholder="题目类型">
                        <el-option
                            v-for="it in answerTypeOptions"
                            :key="it.id"
                            :label="it.label"
                            :value="it.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span>题目内容：</span>
                </el-col>
                <el-col :span="22">
                    <el-input
                    type="textarea"
                    placeholder="使用Markdown格式书写内容"
                    v-model="editingPuzzleItem.content"
                    :autosize="{minRows: 8}"
                    ></el-input>
                </el-col>
            </el-row>
            <el-row v-if="editingPuzzleItem.type == 1">
                <el-col :span="2"><span>题目HTML：</span></el-col>
                <el-col :span="22">
                    <el-input 
                    type="textarea"
                    placeholder="题目中显示的HTML"
                    v-model="editingPuzzleItem.image"
                    :autosize="{minRows: 8}">
                    </el-input>
                </el-col>
            </el-row>
            <el-row v-else>
                <el-col :span="2"><span>题目图片：</span></el-col>
                <el-col :span="22">
                    <el-input v-model="editingPuzzleItem.image"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2"><span>答案：</span></el-col>
                <el-col :span="22">
                    <el-input v-model="editingPuzzleItem.answer"></el-input>
                </el-col>
            </el-row>
          </div>
          <div style="margin-top: 10px">
            <el-button type="primary" @click="addOrSavePuzzle">提交</el-button>
            <el-button @click="preview">预览</el-button>
            <el-button type="success" @click="setNew">新建</el-button>
          </div>
        </div>

        <div>
          <h3>已有题目</h3>
          <el-table :data="puzzleList" class="info-table">
            <el-table-column label="ID" prop="pid" width="50px"></el-table-column>
            <el-table-column label="所属分区">
                <template slot-scope="u">
                    {{ getPuzzleGroupName(u.row.pgid) }}
                </template>
            </el-table-column>
            <el-table-column label="题目" prop="title"></el-table-column>
            <el-table-column label="类型">
                <template slot-scope="u">
                    {{ getAnswerTypeName(u.row.answer_type) }}
                </template>
            </el-table-column>
            <el-table-column label="答案" prop="answer"></el-table-column>
            <el-table-column label="操作" width="260px">
              <template slot-scope="u">
                <el-button type="success" size="small" @click="editPuzzle(u.row.pgid)">编辑</el-button>
                <el-popconfirm title="是否确认删除？" @onConfirm="deletePuzzle(u.row.pgid)">
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
export default class PuzzleView extends Vue {
    editingPuzzleItem: PuzzleItem = new PuzzleItem();
    puzzleList: PuzzleItem[] = [];
    pgList: PuzzleGroupItem[] = [];
    contentTypeOptions = [
        {
            id: 0,
            label: "题目是图片"
        },
        {
            id: 1,
            label: "题目是HTML"
        }
    ];
    //0-小题 1-组/区域Meta 2-PreFinalMeta 3-FinalMeta 4-不计分题目
    answerTypeOptions = [
        {
            id: 0,
            label: "小题"
        },
        {
            id: 1,
            label: "区域Meta"
        },
        {
            id: 2,
            label: "FM准入"
        },
        {
            id: 3,
            label: "FinalMeta"
        },
        {
            id: 4,
            label: "不计分题目"
        }
    ];
    previewVisible: boolean = false;
    previewHtml: string = "";
    setNew() {
        this.editingPuzzleItem = new PuzzleItem();
    }
    preview() {
        this.previewHtml = marked(this.editingPuzzleItem.content);
        this.previewVisible = true;
    }
    getAnswerTypeName(id: number){
        let answerType = this.answerTypeOptions.find(it => it.id == id);
        if(answerType) return answerType.label;
        else return "[未知]";
    }
    getPuzzleGroupName(pgid: number){
        let pg = this.pgList.find(it => it.pgid == pgid);
        if(pg) return pg.pg_name;
        else return "[未知]";
    }
    async mounted() {
        let grpapi = this.$gConst.apiRoot + "/admin/get-puzzle-group";
        let grpres = await fetchPostWithSign(grpapi, {});
        let grpdata = await grpres.json();

        if (grpdata["status"] == 1) {
            if (grpdata["puzzle_group"]) {
                let newPgList: PuzzleGroupItem[] = [];

                for (let pgItem of grpdata["puzzle_group"]) {
                    newPgList.push(new PuzzleGroupItem(pgItem));
                }
                this.pgList = newPgList;
            }
        } else {
            defaultApiErrorAction(this, grpdata);
            this.$router.push("/");
        }


        let api = this.$gConst.apiRoot + "/admin/get-puzzle";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if (data["status"] == 1) {
            if (data["puzzle"]) {
                let newPuzzleList: PuzzleItem[] = [];

                for (let puzzleItem of data["puzzle"]) {
                    newPuzzleList.push(new PuzzleItem(puzzleItem));
                }
                this.puzzleList = newPuzzleList;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
    async addOrSavePuzzle(){
        if (this.editingPuzzleItem.title == "") {
            this.$message({
                type: "warning",
                message: "题目标题不能为空"
            });
            return;
        }
        if (this.editingPuzzleItem.answer == "") {
            this.$message({
                type: "warning",
                message: "题目答案不能为空"
            });
            return;
        }
        if (this.editingPuzzleItem.pgid == 0) {
            this.$message({
                type: "warning",
                message: "必须选择所属分组"
            });
            return;
        }

        let data;
        if (this.editingPuzzleItem.pid == 0) {
            let api = this.$gConst.apiRoot + "/admin/add-puzzle";
            let res = await fetchPostWithSign(api, {
                pgid: this.editingPuzzleItem.pgid,
                type: this.editingPuzzleItem.type,
                title: this.editingPuzzleItem.title,
                content: this.editingPuzzleItem.content,
                image: this.editingPuzzleItem.image,
                html: this.editingPuzzleItem.html,
                answer_type: this.editingPuzzleItem.answer_type,
                answer: this.editingPuzzleItem.answer
            });
            data = await res.json();
        } else {
            let api = this.$gConst.apiRoot + "/admin/edit-puzzle";
            let res = await fetchPostWithSign(api, {
                pid: this.editingPuzzleItem.pid,
                pgid: this.editingPuzzleItem.pgid,
                type: this.editingPuzzleItem.type,
                title: this.editingPuzzleItem.title,
                content: this.editingPuzzleItem.content,
                image: this.editingPuzzleItem.image,
                html: this.editingPuzzleItem.html,
                answer_type: this.editingPuzzleItem.answer_type,
                answer: this.editingPuzzleItem.answer
            });
            data = await res.json();
        }

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "题目编辑成功"
            });
            this.$gConst.globalBus.$emit("reload");
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    editPuzzle(pid: number){
        let puzzledItem = this.puzzleList.find(it => it.pid == pid);
        if(puzzledItem) {
            this.editingPuzzleItem = new PuzzleItem(puzzledItem);
        }
    }
    async deletePuzzle(pid: number){
        let api = this.$gConst.apiRoot + "/admin/delete-puzzle";
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

class PuzzleItem{
    pid: number = 0;
    pgid: number = 1;
    pg_name: string = "";
    type: number = 0;
    title: string = "";
    content: string = "";
    image: string = "";
    html: string = "";
    answer_type: number = 0;
    answer: string = "";

    constructor(obj?: any) {
        if (obj) Object.assign(this, obj);
    }

    get firstLine(){
        return this.content.split("\n")[0];
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
    get showtitle(){
        if(this.isHide) return `${this.pg_name}[隐藏分区]`;
        else return this.pg_name;
    }
}
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  margin-top: 20px;
}
.new-puzzle-area .el-row{
  margin-top: 10px;
}
</style>