<template>
  <div class="home">
    <BottomNavbar :activeIndex="'/puzzle/' + pid" :activeGroup="puzzle.groupInfo">
        <el-input v-model="answer" placeholder="请输入答案" class="answer-input hidden-sm-and-down">
            <el-tooltip class="item" effect="dark" content="最近10次回答记录" placement="top" slot="prepend">
                <el-button type="primary" icon="el-icon-files"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="提交答案" placement="top" slot="append">
                <el-button type="primary" icon="el-icon-s-promotion" @click="submit"></el-button>
            </el-tooltip>
        </el-input>
        <el-button class="hidden-md-and-up" @click="drawer = true">提交答案</el-button>
        <el-drawer title="提交答案" :visible="drawer" direction="btt" :with-header="false" @close="drawer = false" :modal="false">
            <div>
                <el-tooltip class="item" effect="dark" content="最近10次回答记录" placement="top" slot="prepend">
                    <el-button icon="el-icon-files">最近10次回答记录</el-button>
                </el-tooltip>
                <el-input v-model="answer" placeholder="请输入答案" class="answer-input">
                    <el-tooltip class="item" effect="dark" content="提交答案" placement="top" slot="append">
                        <el-button type="primary" icon="el-icon-s-promotion" @click="submit">提交</el-button>
                    </el-tooltip>
                </el-input>
            </div>
        </el-drawer>
    </BottomNavbar>
    <el-container>
        <el-main>
            <el-row>
                <el-col :sm="24" :md="{span: 12, offset: 6}" class="game-list-main">
                    <div>CCBC X</div>
                    <div>
                        <h1>{{ puzzle.title }}</h1>
                        <div v-html="puzzle.renderHtml"></div>
                    </div>
                    <div class="puzzle-main">
                        <div v-if="puzzle.type == 0">
                            <img :src="puzzle.image">
                        </div>
                        <div v-if="puzzle.type == 1" v-html="puzzle.html">

                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BottomNavbar from '@/components/BottomNavbar.vue'
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import 'element-ui/lib/theme-chalk/display.css';
import marked from "marked";

@Component({
    components: {
        BottomNavbar
    }
})
export default class PuzzleDetailView extends Vue {
    pid: number = 0;
    puzzle: Puzzle = new Puzzle();
    answer: string = "";
    drawer: boolean = false;
    async mounted(){
        this.pid = parseInt(this.$route.params.pid);

        if(!this.isLogin()){
            this.$router.push('/login')
            return;
        }

        let api = this.$gConst.apiRoot + "/play/get-puzzle-detail";
        let res = await fetchPostWithSign(api, {
            pid: this.pid
        });
        let data = await res.json();

        if(data['status'] == 1){
            if(data.puzzle){
                this.puzzle = new Puzzle(data.puzzle);
            }
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    isLogin(){
        return localStorage.getItem("token") !== null;
    }
    async submit(){
        let api = this.$gConst.apiRoot + "/check-answer";
        let res = await fetchPostWithSign(api, {
            pid: this.pid,
            answer: this.answer
        });
        let data = await res.json();

        if(data['status'] == 1){
            if(data.answer_status == 1 && this.puzzle.answer_type == 3){
                this.$message({
                    type: "success",
                    message: "回答正确！"
                });
                this.$router.push('/finalend');
                return;
            }

            let type: "success" | "error" | "info" | "warning" = "warning";
            if(data.answer_status == 1) type = "success";
            else if(data.answer_status == 2) type = "error";
            else if(data.answer_status == 3) type = "info";
            this.$alert(data.message, {
                title: "答题结果",
                type
            });
        }else{
            defaultApiErrorAction(this, data);
        }
    }
}

class Puzzle{
    pid: number = 0;
    pgid: number = 0;
    pg_name: string = "";
    type: number = 0;
    title: string = "";
    content: string = "";
    image: string = "";
    html: string = "";
    answer_type: number = 0;
    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get renderHtml(){
        return marked(this.content);
    }
    get groupInfo(){
        return {
            pgid: this.pgid,
            pg_name: this.pg_name
        }
    }
}
</script>

<style lang="scss" scoped>
.game-list-main{
    text-align: center;
}
.puzzle-main{
    margin-top: 100px;
    margin-bottom: 100px;
}
</style>

<style lang="scss">
.answer-input{
    .el-input__inner{
        background-color: #464646;
    }
}
</style>