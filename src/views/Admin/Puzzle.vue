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
                <el-col :span="2"><span>题目位置：</span></el-col>
                <el-col :span="4">
                    <el-input v-model="editingPuzzleItem.extend_data" placeholder="0,0 (row, col)"></el-input>
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
            <el-row>
                <el-col :span="2">
                    <span>扩展内容（回答正确后显示）：</span>
                </el-col>
                <el-col :span="22">
                    <el-input
                    type="textarea"
                    placeholder="使用Markdown格式书写内容"
                    v-model="editingPuzzleItem.extend_content"
                    :autosize="{minRows: 4}"
                    ></el-input>
                </el-col>
            </el-row>
            <el-row v-if="editingPuzzleItem.type == 1">
                <el-col :span="2"><span>题目HTML：</span></el-col>
                <el-col :span="22">
                    <el-input 
                    type="textarea"
                    placeholder="题目中显示的HTML"
                    v-model="editingPuzzleItem.html"
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
                <el-col :span="10">
                    <el-input v-model="editingPuzzleItem.answer"></el-input>
                </el-col>
                <el-col :span="2"><span>跳转关键字：</span></el-col>
                <el-col :span="10">
                    <el-input v-model="editingPuzzleItem.jump_keyword"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2"><span>提示1标题：</span></el-col>
                <el-col :span="6">
                    <el-input v-model="editingPuzzleItem.tips1title"></el-input>
                </el-col>
                <el-col :span="2"><span>提示2标题：</span></el-col>
                <el-col :span="6">
                    <el-input v-model="editingPuzzleItem.tips2title"></el-input>
                </el-col>
                <el-col :span="2"><span>提示3标题：</span></el-col>
                <el-col :span="6">
                    <el-input v-model="editingPuzzleItem.tips3title"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2"><span>提示1：</span></el-col>
                <el-col :span="6">
                    <el-input 
                    type="textarea"
                    placeholder=""
                    v-model="editingPuzzleItem.tips1"
                    :autosize="{minRows: 5}">
                    </el-input>
                </el-col>
                <el-col :span="2"><span>提示2：</span></el-col>
                <el-col :span="6">
                    <el-input 
                    type="textarea"
                    placeholder=""
                    v-model="editingPuzzleItem.tips2"
                    :autosize="{minRows: 5}">
                    </el-input>
                </el-col>
                <el-col :span="2"><span>提示3：</span></el-col>
                <el-col :span="6">
                    <el-input 
                    type="textarea"
                    placeholder=""
                    v-model="editingPuzzleItem.tips3"
                    :autosize="{minRows: 5}">
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="2">
                    <el-button type="info" icon="el-icon-circle-plus-outline" @click="openAdditionalAnswerDrawer">添加附加答案</el-button>
                    <el-tooltip effect="dark" class="question-mark-item"
                        content="附加答案为判题时提供额外的错误答案，当参赛者输入匹配到附加答案的答案时，虽然不是正确答案，但是在返回结果中可以带上一段特定的消息"
                        placement="bottom-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    <el-drawer :title="'附加参考答案：' + editingPuzzleItem.pid" :visible.sync="additionAnswerDrawerOpened" direction="rtl" size="50%" @open="additionAnswerDrawerOpenAction">
                        <div class="additional-drawer-content">
                            <h3 v-if="editingAdditionalAnswerItem.aaid == 0">添加附加答案</h3>
                            <h3 v-else>编辑附加答案：{{editingAdditionalAnswerItem.answer}}</h3>
                            <el-row>
                                <el-col :span="3">答案：</el-col>
                                <el-col :span="21">
                                    <el-input v-model="editingAdditionalAnswerItem.answer"></el-input>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="3">消息：</el-col>
                                <el-col :span="21">
                                    <el-input type="textarea" :autosize="{minRows: 5}" v-model="editingAdditionalAnswerItem.message"></el-input>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-button type="primary" @click="addOrSaveAdditionalAnswer">提交</el-button>
                                    <el-button type="success" @click="setNewAdditionalAnswer">新建</el-button>
                                </el-col>
                            </el-row>
                            <h3>已有附加答案</h3>
                            <el-table :data="additionAnswerList">
                                <el-table-column label="答案" prop="answer" width="200px"></el-table-column>
                                <el-table-column label="消息" prop="message"></el-table-column>
                                <el-table-column label="操作" width="150px">
                                    <template slot-scope="u">
                                        <el-button type="success" size="small" @click="editAdditionalAnswer(u.row.aaid)">编辑</el-button>
                                        <el-button type="danger" size="small" @click="deleteAdditionalAnswer(u.row.aaid)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-drawer>
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
            <el-table-column label="题目位置" prop="extend_data"></el-table-column>
            <el-table-column label="题目" prop="title"></el-table-column>
            <el-table-column label="类型">
                <template slot-scope="u">
                    {{ getAnswerTypeName(u.row.answer_type) }}
                </template>
            </el-table-column>
            <el-table-column label="答案" prop="answer"></el-table-column>
            <el-table-column label="跳转关键字（隐藏）" prop="jump_keyword"></el-table-column>
            <el-table-column label="操作" width="260px">
              <template slot-scope="u">
                <el-button type="success" size="small" @click="editPuzzle(u.row.pid)">编辑</el-button>
                <el-popconfirm title="是否确认删除？" @onConfirm="deletePuzzle(u.row.pid)">
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
    additionAnswerDrawerOpened: boolean = false;
    additionAnswerList: AdditionalAnswer[] = [];
    editingAdditionalAnswerItem: AdditionalAnswer = new AdditionalAnswer();
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
                answer: this.editingPuzzleItem.answer,
                jump_keyword: this.editingPuzzleItem.jump_keyword,
                extend_content: this.editingPuzzleItem.extend_content,
                extend_data: this.editingPuzzleItem.extend_data,
                tips1: this.editingPuzzleItem.tips1,
                tips2: this.editingPuzzleItem.tips2,
                tips3: this.editingPuzzleItem.tips3,
                tips1title: this.editingPuzzleItem.tips1title,
                tips2title: this.editingPuzzleItem.tips2title,
                tips3title: this.editingPuzzleItem.tips3title,
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
                answer: this.editingPuzzleItem.answer,
                jump_keyword: this.editingPuzzleItem.jump_keyword,
                extend_content: this.editingPuzzleItem.extend_content,
                extend_data: this.editingPuzzleItem.extend_data,
                tips1: this.editingPuzzleItem.tips1,
                tips2: this.editingPuzzleItem.tips2,
                tips3: this.editingPuzzleItem.tips3,
                tips1title: this.editingPuzzleItem.tips1title,
                tips2title: this.editingPuzzleItem.tips2title,
                tips3title: this.editingPuzzleItem.tips3title,
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
    async reloadAdditionalAnswerList(){
        this.additionAnswerList = [];

        let api = this.$gConst.apiRoot + "/admin/get-additional-answer";
        let res = await fetchPostWithSign(api, {
            pid: this.editingPuzzleItem.pid
        });
        let data = await res.json();

        if (data["status"] == 1) {
            if (data["additional_answer"]) {
                let newAAList: AdditionalAnswer[] = [];

                for (let aaItem of data["additional_answer"]) {
                    newAAList.push(new AdditionalAnswer(aaItem));
                }
                this.additionAnswerList = newAAList;
            }
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    async additionAnswerDrawerOpenAction(){
        await this.reloadAdditionalAnswerList();
    }
    async addOrSaveAdditionalAnswer(){
        if (this.editingPuzzleItem.pid == 0){
            this.$message({
                type: "warning",
                message: "请先点击编辑按钮，若您正在新建题目，必须先提交新建题目之后才能编辑附加答案。"
            });
            return;
        }

        if (this.editingAdditionalAnswerItem.answer == "") {
            this.$message({
                type: "warning",
                message: "附加答案不能为空"
            });
            return;
        }
        if (this.editingAdditionalAnswerItem.message == "") {
            this.$message({
                type: "warning",
                message: "附加答案消息不能为空"
            });
            return;
        }

        let data;
        if (this.editingAdditionalAnswerItem.aaid == 0) {
            let api = this.$gConst.apiRoot + "/admin/add-additional-answer";
            let res = await fetchPostWithSign(api, {
                pid: this.editingPuzzleItem.pid,
                answer: this.editingAdditionalAnswerItem.answer,
                message: this.editingAdditionalAnswerItem.message
            });
            data = await res.json();
        } else {
            let api = this.$gConst.apiRoot + "/admin/edit-additional-answer";
            let res = await fetchPostWithSign(api, {
                aaid: this.editingAdditionalAnswerItem.aaid,
                pid: this.editingPuzzleItem.pid,
                answer: this.editingAdditionalAnswerItem.answer,
                message: this.editingAdditionalAnswerItem.message
            });
            data = await res.json();
        }

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "编辑附加答案成功"
            });
            await this.reloadAdditionalAnswerList();
            this.editingAdditionalAnswerItem = new AdditionalAnswer();
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    editAdditionalAnswer(aaid: number){
        let additionalItem = this.additionAnswerList.find(it => it.aaid == aaid);
        if(additionalItem) {
            this.editingAdditionalAnswerItem = new AdditionalAnswer(additionalItem);
        }
    }
    setNewAdditionalAnswer(){
        this.editingAdditionalAnswerItem = new AdditionalAnswer();
    }
    async deleteAdditionalAnswer(aaid: number){
        let api = this.$gConst.apiRoot + "/admin/delete-additional-answer";
        let res = await fetchPostWithSign(api, {
            aaid
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "删除附加答案成功"
            });
            await this.reloadAdditionalAnswerList();
            this.editingAdditionalAnswerItem = new AdditionalAnswer();
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    openAdditionalAnswerDrawer(){
        if (this.editingPuzzleItem.pid == 0){
            this.$message({
                type: "warning",
                message: "请先点击编辑按钮，若您正在新建题目，必须先提交新建题目之后才能编辑附加答案。"
            });
            return;
        }

        this.additionAnswerDrawerOpened = true;
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
    jump_keyword: string = "";
    extend_content: string = "";
    extend_data: string = "";
    tips1: string = "";
    tips2: string = "";
    tips3: string = "";
    tips1title: string = "";
    tips2title: string = "";
    tips3title: string = "";

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

class AdditionalAnswer{
    aaid: number = 0;
    pid: number = 0;
    answer: string = "";
    message: string = "";

    constructor(obj?: any){
        if (obj) Object.assign(this, obj);
    }
}
</script>

<style lang="scss">
.info-table {
  width: 100%;
  margin-top: 20px;
}
.new-puzzle-area .el-row{
  margin-top: 10px;
}
.question-mark-item{
  margin-left: 10px;
  color: gray;
}
.additional-drawer-content{
    padding-left: 10px;
    padding-right: 10px;
}
.additional-drawer-content .el-input>.el-input__inner{
    background-color: rgb(71,71,71);
}
.additional-drawer-content .el-textarea>.el-textarea__inner{
    background-color: rgb(71,71,71);
}
</style>