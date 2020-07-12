<template>
  <div class="home">
    <BottomNavbar activeIndex="/puzzlegroup"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :sm="24" :md="{span: 12, offset: 6}" class="game-list-main">
                    <div>CCBC X</div>
                    <div>
                        <h1>{{ puzzleGroupDetailInfo.puzzle_group_info.pg_name }}</h1>
                        <div v-html="puzzleGroupDetailInfo.puzzle_group_info.renderHtml"></div>
                    </div>
                    <div class="puzzle-group-list">
                        <div class="puzzle-group" :class="g.statusClass" v-for="g in puzzleGroupDetailInfo.puzzle_list" :key="g.pid">
                            {{ g.title }}
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
import marked from "marked";

@Component({
    components: {
        BottomNavbar
    }
})
export default class PuzzleGroupDetailView extends Vue {
    pgid: number = 0;
    puzzleGroupDetailInfo: PuzzleGroupDetailInfo = new PuzzleGroupDetailInfo();
    async mounted(){
        this.pgid = parseInt(this.$route.params.pgid);

        console.log("PGID: ", this.pgid);

        if(!this.isLogin()){
            this.$router.push('/login')
            return;
        }

        let api = this.$gConst.apiRoot + "/play/get-puzzle-list";
        let res = await fetchPostWithSign(api, {
            pgid: this.pgid
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.puzzleGroupDetailInfo = new PuzzleGroupDetailInfo(data);
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    isLogin(){
        return localStorage.getItem("token") !== null;
    }
}

class PuzzleGroupDetailInfo{
    puzzle_group_info: PuzzleGroup = new PuzzleGroup();
    puzzle_list: Puzzle[] = []
    constructor(obj?: any){
        if(obj && obj["puzzle_group_info"]){
            this.puzzle_group_info = new PuzzleGroup(obj["puzzle_group_info"]);
        }

        let puzzlelist = [];
        if(obj && obj.puzzle_list){
            for(let puzzle of obj.puzzle_list){
                puzzlelist.push(new Puzzle(puzzle));
            }
        }
        this.puzzle_list = puzzlelist;
    }
}

class Puzzle{
    pid: number = 0;
    title: string = "";
    answer_type: number = 0;
    isFinish: boolean = false;
    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
        if(obj && obj["is_finish"] && obj["is_finish"] == 1) this.isFinish = true;
        else this.isFinish = false;
    }
    get statusClass(){
        if(this.isFinish) return "puzzle-finished";
        else return "puzzle-open";
    }
}

class PuzzleGroup{
    pgid: number = 0;
    pg_name: string = "";
    pg_desc: string = "";
    isHide: boolean = false;
    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
        if(obj && obj["is_hide"] && obj["is_hide"] == 1) this.isHide = true;
        else this.isHide = false;
    }
    get renderHtml(){
        return marked(this.pg_desc);
    }
}
</script>

<style lang="scss" scoped>
.game-list-main{
    text-align: center;
}
.puzzle-group-list{
    margin-top: 100px;
    margin-bottom: 100px;
}
.puzzle-group{
    margin-top: 20px;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 30px;
    transition: all .3s linear;
    border: 2px solid;
    border-radius: 25px;
    cursor: pointer;
}
.puzzle-group-open{
    border-color: #5ABDD0;
}
.puzzle-group-open:hover{
    background-color: #5ABDD0;
    color: black;
}
.puzzle-group-finished{
    border-color: #6DCC8E;
}
.puzzle-group-finished:hover{
    background-color: #6DCC8E;
    color: black;
}
.puzzle-group-locked{
    border-color: #afafaf;
}
.puzzle-group-locked:hover{
    background-color: #afafaf;
    color: black;
}

.puzzle-open{
    border-color: #2d5f69;
    background-color: #2d5f69;
}
.puzzle-open:hover{
    border-color: #5ABDD0;
    background-color: #5ABDD0;
    color: black;
}
.puzzle-finished{
    border-color: #3c704e;
    background-color: #3c704e;
}
.puzzle-finished:hover{
    border-color: #6DCC8E;
    background-color: #6DCC8E;
    color: black;
}
</style>