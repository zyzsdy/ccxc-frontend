<template>
  <div class="home">
    <BottomNavbar activeIndex="/puzzlegrouplist"></BottomNavbar>
    <el-container>
        <el-main>
            <el-row>
                <el-col :sm="24" :md="{span: 12, offset: 6}" class="game-list-main">
                    <div>CCBC X</div>
                    <div><h1>选择区域</h1></div>
                    <div class="puzzle-group-list">
                        <div class="puzzle-group" :class="g.statusClass" v-for="g in puzzleGroupListInfo.puzzleGroups" :key="g.pgid" @click="showgroupdetail(g.pgid)">
                            {{ g.pg_name }}
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

@Component({
    components: {
        BottomNavbar
    }
})
export default class PuzzleGroupListView extends Vue {
    puzzleGroupListInfo: PuzzleGroupListInfo = new PuzzleGroupListInfo();
    async mounted(){
        if(!this.isLogin()){
            this.$router.push('/login')
            return;
        }

        let api = this.$gConst.apiRoot + "/play/get-puzzle-group";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if(data['status'] == 1){
            this.puzzleGroupListInfo = new PuzzleGroupListInfo(data);
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    isLogin(){
        return localStorage.getItem("token") !== null;
    }
    async showgroupdetail(pgid: number){
        let puzzleGroupItem = this.puzzleGroupListInfo.puzzleGroups.find(it => it.pgid == pgid);

        //若已打开则直接跳转
        if(puzzleGroupItem?.isOpen){
            this.$router.push(`/puzzlegroup/${pgid}`);
            return;
        }

        //若未打开，则判断是否可开放。
        if(!this.puzzleGroupListInfo.isOpenNextGroup){
            this.$message({
                message: "不能进入未开放的区域。",
                type: "error"
            });
            return;
        }

        try{
            await this.$confirm("您现在可以开放此区域，是否确认开放？", "开放区域", {
                type: "info"
            });
        }
        catch(e){
            return;
        }

        let api = this.$gConst.apiRoot + "/unlock-group";
        let res = await fetchPostWithSign(api, {
            unlock_puzzle_group_id: pgid
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$message({
                type: "success",
                message: "开放新区域成功！"
            });
            this.$gConst.globalBus.$emit("reload");
        }else{
            defaultApiErrorAction(this, data);
        }
    }
}

class PuzzleGroupListInfo{
    isOpenNextGroup: boolean = false;
    isOpenPreFinal: boolean = false;
    isOpenFinalMeta: boolean = false;
    puzzleGroups: PuzzleGroup[] = []
    constructor(obj?: any){
        if(obj && obj["is_open_next_group"] && obj["is_open_next_group"] == 1) this.isOpenNextGroup = true;
        else this.isOpenNextGroup = false;

        if(obj && obj["is_open_pre_final"] && obj["is_open_pre_final"] == 1) this.isOpenPreFinal = true;
        else this.isOpenPreFinal = false;

        if(obj && obj["is_open_final_meta"] && obj["is_open_final_meta"] == 1) this.isOpenFinalMeta = true;
        else this.isOpenFinalMeta = false;

        let pglist = [];
        if(obj && obj.puzzle_groups){
            for(let pg of obj.puzzle_groups){
                pglist.push(new PuzzleGroup(pg));
            }
        }
        this.puzzleGroups = pglist;
    }
}

class PuzzleGroup{
    pgid: number = 0;
    pg_name: string = "";
    isHide: boolean = false;
    isFinish: boolean = false;
    isOpen: boolean = false;
    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
        if(obj && obj["is_hide"] && obj["is_hide"] == 1) this.isHide = true;
        else this.isHide = false;

        if(obj && obj["is_finish"] && obj["is_finish"] == 1) this.isFinish = true;
        else this.isFinish = false;

        if(obj && obj["is_open"] && obj["is_open"] == 1) this.isOpen = true;
        else this.isOpen = false;
    }
    get statusClass(){
        if(this.isFinish) return "puzzle-group-finished";
        else if(this.isOpen) return "puzzle-group-open";
        else return "puzzle-group-locked";
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
</style>