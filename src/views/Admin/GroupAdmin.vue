<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/group"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>组队信息</h1>
        <el-row>
            <el-col :span="12">
              <el-radio-group v-model="queryOrder" @change="loadGroup">
                <el-radio :label="0">默认排序（GID）</el-radio>
                <el-radio :label="1">得分倒序</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="12">
              <el-button type="info" icon="el-icon-search" @click="loadGroup">查询</el-button>
            </el-col>
        </el-row>
        <el-table :data="groupList" @row-dblclick="openDetail">
          <el-table-column label="GID" prop="gid" width="100px"></el-table-column>
          <el-table-column label="队名">
              <template slot-scope="u">
                <el-tooltip effect="dark" placement="bottom">
                    <div slot="content">
                      创建时间: {{u.row.formatedCreateTime}}
                    </div>
                    <div>
                      <div class="group-title">{{u.row.groupname}}</div>
                      <div class="group-profile">{{u.row.profile}}</div>
                    </div>
                </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column label="完成题目数量" prop="finished_puzzle_count"></el-table-column>
          <el-table-column label="得分" prop="score" :formatter="digits2"></el-table-column>
          <el-table-column label="是否完赛">
            <template slot-scope="u">
              <el-tooltip effect="dark" placement="bottom" v-if="u.row.is_finish == 1">
                <div slot="content">
                  完赛时间：{{u.row.formatedFinishTime}}
                </div>
                <span style="color: #a6e041;">已完赛</span>
              </el-tooltip>
              <span v-else style="color: #999999;">未完赛</span>
            </template>
          </el-table-column>
          <el-table-column label="已使用提示币总数" prop="penalty" :formatter="digits2"></el-table-column> 
          <el-table-column label="总用时" prop="total_time" :formatter="digits2"></el-table-column> 
        </el-table>
        <el-drawer title="队伍详情" :visible.sync="groupDetailViewer" direction="rtl">
            <div class="message-side-preview">
              <h1>{{groupDetail.groupOverview.groupname}}</h1>
              <h3>题目完成情况</h3>
              <div :key="groupDetail.groupOverview.gid">
                <div v-for="puzzlegroup in puzzleMatrix.puzzleGroups" :key="puzzlegroup.pgid+'A'+groupDetail.groupOverview.gid" class="puzzle-status-graph-line">
                  <span class="small-box" :class="getGroupStatus(puzzlegroup.pgid)">{{puzzlegroup.pgid}}</span>
                  <span class="divider"></span>
                  <el-tooltip effect="dark" placement="bottom" v-for="puzzle in puzzlegroup.puzzles" :key="puzzle.pid" :content="getOpenTips(puzzle.pid, groupDetail.progress.data.OpenedHints)">
                    <span class="small-box" :class="getPuzzleStatus(puzzle.pid)" >{{puzzle.tName}}</span>
                  </el-tooltip>
                </div>
                <p v-if="groupDetail.progress.data.IsOpenNextGroup">可以解锁下个分区</p>
                <p v-else>不能解锁下个分区</p>
              </div>
              <h3>队员列表</h3>
              <el-table :data="groupDetail.users">
                <el-table-column label="UID" prop="uid" width="80px"></el-table-column>
                <el-table-column label="用户名">
                  <template slot-scope="u">
                    {{u.row.username}}
                    <RoleBadge :roleid="u.row.roleid" class="badge-p"></RoleBadge>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </el-drawer>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import RoleBadge from "@/components/RoleBadge.vue";
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import { formatTimestamp } from '@/utils/formatDate';

@Component({
  components: {
    AdminSidebar,
    RoleBadge
  }
})
export default class GroupAdminView extends Vue {
  queryOrder = 1;
  groupList: GroupOverview[] = [];
  groupDetailViewer: boolean = false;
  groupDetail: GroupDetail = new GroupDetail();
  puzzleMatrix: PuzzleMatrix = new PuzzleMatrix();
  async mounted(){
    let grpapi = this.$gConst.apiRoot + "/admin/get-p-user-list";
    let grpres = await fetchPostWithSign(grpapi, {});
    let grpdata = await grpres.json();

    if (grpdata["status"] == 1) {
        let userList = new UserList(grpdata);
        if(userList.pid_item){
          let pm: {
            [pid: number]: PidItem[];
          } = {};

          for(let pidItem of userList.pid_item){
            let pgid = pidItem.pgid;

            if(!pm[pgid]){
              pm[pgid] = [];
            }

            pm[pgid].push(pidItem);
          }

          this.puzzleMatrix.puzzleGroups = [];
          for(let pindex in pm){
            let puzzleList = pm[pindex];
            let puzzleGroup = new PuzzleGroup();
            puzzleGroup.pgid = parseInt(pindex);
            puzzleGroup.puzzles = puzzleList;
            this.puzzleMatrix.puzzleGroups.push(puzzleGroup);
          }
        }
    } else {
        defaultApiErrorAction(this, grpdata);
        this.$router.push("/");
    }

    this.loadGroup();
  }
  async loadGroup(){
    let api = this.$gConst.apiRoot + "/admin/get-group-overview";
    let res = await fetchPostWithSign(api, {
      order: this.queryOrder
    });
    let data = await res.json();

    if (data["status"] == 1) {
        if (data.groups) {
            let groupTempList: GroupOverview[] = [];

            for(let g of data.groups){
                groupTempList.push(new GroupOverview(g));
            }
            this.groupList = groupTempList;
        }
    } else {
        defaultApiErrorAction(this, data);
        this.$router.push("/");
    }
  }
  digits2(_1: any, _2: any, value: number, _4: any){
    return value.toFixed(2);
  }
  async openDetail(row: GroupOverview, col: any, event: any){
    let gid = row.gid;

    let api = this.$gConst.apiRoot + "/admin/get-group-detail";
    let res = await fetchPostWithSign(api, {
      gid
    });
    let data = await res.json();

    if (data["status"] == 1) {
        this.groupDetail = new GroupDetail(data);
        this.groupDetail.groupOverview = row;

        this.groupDetailViewer = true;
    } else {
        defaultApiErrorAction(this, data);
        this.$router.push("/");
    }
  }
  getGroupStatus(pgid: number){
    let result = "default-box";

    if (pgid == 4 && this.groupDetail.progress.data.IsOpenPreFinal){
      result = "open-box";
    }
    if (pgid == 5 && this.groupDetail.progress.data.IsOpenFinalStage){
      result = "open-box";
    }
    if(this.groupDetail.progress.data.FinishedGroups.indexOf(pgid) != -1){
      result = "finish-box";
    }

    return result;
  }
  getPuzzleStatus(pid: number){
    let result = "default-box";
    if(this.groupDetail.progress.data.OpenedHidePuzzles.indexOf(pid) != -1){
      result = "open-box";
    }
    if(this.groupDetail.progress.data.FinishedPuzzles.indexOf(pid) != -1){
      result = "finish-box";
    }

    return result;
  }
  getOpenTips(pid: number, openedTips: {[pid: number]: number[]}){
    if(openedTips[pid]){
      var f = openedTips[pid].join(",");
      return `已开放提示：${f}`;
    }

    return "-";
  }
}

class GroupOverview{
  gid: number = 0;
  groupname: string = "";
  create_time: number = 0;
  profile: string = "";
  finished_puzzle_count: number = 0;
  score: number = 0;
  is_finish: number = 0;
  finish_time: number = 0;
  penalty: number = 0;
  total_time: number = 0;

  constructor(obj?: any){
    if(obj) Object.assign(this, obj);
  }
  get formatedCreateTime(){
    return formatTimestamp(this.create_time);
  }
  get formatedFinishTime(){
    return formatTimestamp(this.finish_time);
  }
}

class GroupDetail{
  groupOverview: GroupOverview = new GroupOverview();
  users: UserNameInfoItem[] = [];
  progress: Progress = new Progress()

  constructor(obj?: any){
    if(obj && obj.users){
      let ulist: UserNameInfoItem[] = [];
      for(let u of obj.users){
        ulist.push(new UserNameInfoItem(u));
      }
      this.users = ulist;
    }

    if(obj && obj.progress){
      this.progress = new Progress(obj.progress);
    }
  }
}

class UserNameInfoItem{
  uid: number = 0;
  username: string = "";
  roleid: number = 0;

  constructor(obj?: any){
    if(obj) Object.assign(this, obj);
  }
}

class Progress{
  gid: number = 0;
  data: SaveData = new SaveData();
  score: number = 0;
  is_finish: number = 0;
  finish_time: number = 0;
  penalty: number = 0;

  constructor(obj?: any){
    if(obj) Object.assign(this, obj);

    if(obj && obj.data){
      this.data = new SaveData(obj.data);
    }
  }
  get formatedFinishTime(){
    return formatTimestamp(this.finish_time);
  }
}

class SaveData{
  FinishedPuzzles: number[] = [];
  OpenedHidePuzzles: number[] = [];
  IsOpenPreFinal: boolean = false;
  IsOpenFinalStage: boolean = false;
  FinishedGroups: number[] = [];
  OpenedHints: {[pid: number]: number[]} = {}

  constructor(obj?: any){
    if(obj) Object.assign(this, obj);
  }
}

class UserList{
    pid_item: PidItem[] = [];
    constructor(obj?: any){
        if(obj && obj["pid_item"]){
            let pidList: PidItem[] = [];
            for(let p of obj["pid_item"]){
                pidList.push(new PidItem(p));
            }
            this.pid_item = pidList;
        }
    }
}

class PidItem{
    pid: number = 0;
    pgid: number = 0;
    title: string = "";

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get tName(){
      if (this.pid == 31) return "M1"
      if (this.pid == 32) return "M2"
      if (this.pid == 33) return "M3"
      if (this.pid == 34) return "MM"
      if (this.pid == 35) return "M4"
      if (this.pid == 36) return "M5"
      if (this.pid == 37) return "M6"
      if (this.pid == 38) return "M7"
      if (this.pid == 39) return "M8"
      if (this.pid == 40) return "FM"

      return this.pid;
    }
}

class PuzzleMatrix{
  puzzleGroups: PuzzleGroup[] = [];
}
class PuzzleGroup{
  pgid: number = 0;
  puzzles: PidItem[] = [];
}
</script>

<style lang="scss" scoped>
.group-title{
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.group-profile{
    color: #999999;
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.message-side-preview{
    padding: 20px;
}
.small-box{
  height: 24px;
  width: 24px;
  display: inline-block;
  background-color: #999999;
  line-height: 24px;
  text-align: center;
  margin: 5px;
}
.default-box{
  background-color: #999999;
}
.open-box{
  background-color: #45acd4;
}
.finish-box{
  background-color: #4fda4a;
}
.divider{
  margin-left: 30px;
}
</style>

<style lang="scss">
.el-drawer__body{
  overflow: auto;
}
</style>