<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/answerlog"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>答案记录</h1>
        <el-row>
            <el-col :span="2">队伍：</el-col>
            <el-col :span="4">
                <el-select v-model="queryAnswerLog.gid" multiple placeholder="全部队伍">
                    <el-option
                        v-for="g in userList.gid_item"
                        :key="g.gid"
                        :label="g.groupDisplayName"
                        :value="g.gid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">用户：</el-col>
            <el-col :span="4">
                <el-select v-model="queryAnswerLog.uid" multiple placeholder="全部用户">
                    <el-option
                        v-for="u in userList.uid_item"
                        :key="u.uid"
                        :label="u.displayName"
                        :value="u.uid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">题目：</el-col>
            <el-col :span="4">
                <el-select v-model="queryAnswerLog.pid" multiple placeholder="任意题目">
                    <el-option
                        v-for="p in userList.pid_item"
                        :key="p.pid"
                        :label="p.puzzle_name"
                        :value="p.pid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">答案状态：</el-col>
            <el-col :span="4">
                <el-select v-model="queryAnswerLog.status" multiple placeholder="全部">
                    <el-option
                        v-for="s in userList.status_item"
                        :key="s.status"
                        :label="s.label"
                        :value="s.status">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">答案匹配：</el-col>
            <el-col :span="6">
                <el-input v-model="queryAnswerLog.answer"></el-input>
            </el-col>
            <el-col :span="2"><span>时间排序：</span></el-col>
            <el-col :span="4">
                <el-select placeholder="选择排序" v-model="queryAnswerLog.order">
                    <el-option label="最新在前" :value="0"></el-option>
                    <el-option label="最老在前" :value="1"></el-option>
                </el-select>
            </el-col>
            <el-col :span="2" :offset="2">
                <el-button type="info" icon="el-icon-search" @click="loadAnswerLog(1)">查询</el-button>
            </el-col>
        </el-row>
        <el-table :data="answerLog" class="answer-log-table">
            <el-table-column label="ID" prop="id" width="100px"></el-table-column>
            <el-table-column label="回答时间" prop="formatedDate"></el-table-column>
            <el-table-column label="组队">
                <template slot-scope="u">
                    <el-button type="text" @click="setGroup(u.row.gid)">{{getGroupName(u.row.gid)}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="用户">
                <template slot-scope="u">
                    <el-button type="text" @click="setUser(u.row.uid)">{{getUserName(u.row.uid)}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="题目">
                <template slot-scope="u">
                    <el-button type="text" @click="setPuzzle(u.row.pid)">{{getPuzzleName(u.row.pid)}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="答案" prop="answer"></el-table-column>
            <el-table-column label="判断状态">
                <template slot-scope="u">
                    <span :style="'color:' + getStatusClass(u.row.status)">{{getStatusName(u.row.status)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="answerlog-pager">
            <el-pagination 
                layout="prev, pager, next"
                :total="totalCount"
                :page-size.sync="pageSize"
                @current-change="loadAnswerLog">
            </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import { formatTimestamp } from '@/utils/formatDate';

@Component({
  components: {
    AdminSidebar
  }
})
export default class AnswerLogView extends Vue {
    userList: UserList = new UserList();
    queryAnswerLog: QueryAnswerLog = new QueryAnswerLog();
    answerLog: AnswerLog[] = [];
    pageSize: number = 20;
    totalCount: number = 0;
    async mounted(){
        let grpapi = this.$gConst.apiRoot + "/admin/get-user-list";
        let grpres = await fetchPostWithSign(grpapi, {});
        let grpdata = await grpres.json();

        if (grpdata["status"] == 1) {
            this.userList = new UserList(grpdata);
        } else {
            defaultApiErrorAction(this, grpdata);
            this.$router.push("/");
        }

        this.loadAnswerLog(1);
    }
    async loadAnswerLog(page: number = 1){
        let api = this.$gConst.apiRoot + "/admin/query-answer-log";
        this.queryAnswerLog.page = page;
        let res = await fetchPostWithSign(api, this.queryAnswerLog);
        let data = await res.json();

        if (data["status"] == 1) {
            this.pageSize = data.page_size;
            this.totalCount = data.total_count;
            if (data.answer_log) {
                let answerList: AnswerLog[] = [];

                for(let answer of data.answer_log){
                    answerList.push(new AnswerLog(answer));
                }
                this.answerLog = answerList;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
    setGroup(gid: number){
        this.queryAnswerLog.gid = [gid];
    }
    setUser(uid: number){
        this.queryAnswerLog.uid = [uid];
    }
    setPuzzle(pid: number){
        this.queryAnswerLog.pid = [pid];
    }
    getUserName(uid: number){
        let u = this.userList.uid_item.find(it => it.uid == uid);
        if(u) return u.user_name;
        else return uid;
    }
    getGroupName(gid: number){
        let g = this.userList.gid_item.find(it => it.gid == gid);
        if(g) return g.group_name;
        else return gid;
    }
    getPuzzleName(pid: number){
        let p = this.userList.pid_item.find(it => it.pid == pid);
        if(p) return p.puzzle_name;
        else return pid;
    }
    getStatusName(status: number){
        let s = this.userList.status_item.find(it => it.status == status);
        if(s) return s.label;
        else return "--";
    }
    getStatusClass(status: number){
        switch(status){
            case 1: return "#3af73a";
            case 2: return "#f73939";
            case 3: return "#206af3";
            case 6: return "#f5a52e";
            default: return "#cccccc";
        }
    }
}

class QueryAnswerLog{
    uid: number[] = [];
    gid: number[] = [];
    pid: number[] = [];
    status: number[] = [];
    answer: string = "";
    order: number = 0;
    page: number = 1;
}

class AnswerLog{
    id: number = 0;
    create_time: number = 0;
    uid: number = 0;
    gid: number = 0;
    pid: number = 0;
    answer: string = "";
    status: number = 0;

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get formatedDate(){
        return formatTimestamp(this.create_time);
    }
}

class UserList{
    uid_item: UidItem[] = [];
    gid_item: GidItem[] = [];
    pid_item: PidItem[] = [];
    status_item: {status: number, label: string}[] = [
        {
            status: 1,
            label: "OK"
        },
        {
            status: 2,
            label: "WA"
        },
        {
            status: 3,
            label: "CLD"
        },
        {
            status: 4,
            label: "HIDE"
        },
        {
            status: 5,
            label: "ERR"
        },
        {
            status: 6,
            label: "JUMP"
        },
    ];

    constructor(obj?: any){
        if(obj && obj["uid_item"]){
            let uidList: UidItem[] = [];
            for(let u of obj["uid_item"]){
                uidList.push(new UidItem(u));
            }
            this.uid_item = uidList;
        }

        if(obj && obj["gid_item"]){
            let gidList: GidItem[] = [];
            for(let g of obj["gid_item"]){
                gidList.push(new GidItem(g));
            }
            this.gid_item = gidList;
        }

        if(obj && obj["pid_item"]){
            let pidList: PidItem[] = [];
            for(let p of obj["pid_item"]){
                pidList.push(new PidItem(p));
            }
            this.pid_item = pidList;
        }
    }
}

class UidItem{
    uid: number = 0;
    user_name: string = "";

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get displayName(){
        return `${this.uid}: ${this.user_name}`;
    }
}

class GidItem{
    gid: number = 0;
    group_name: string = "";

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get groupDisplayName(){
        return `${this.gid}: ${this.group_name}`;
    }
}

class PidItem{
    pid: number = 0;
    pgid: number = 0;
    title: string = "";

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get puzzle_name(){
        return `[${this.pgid}-${this.pid}]${this.title}`;
    }
}
</script>

<style lang="scss" scoped>
.answer-log-table{
    margin-top: 20px;
}
.answerlog-pager{
    text-align: center;
    margin-top: 15px;
}
.el-button--text{
    color: #ffffff;
}
.ssssssssssssssssss{
    color: #3af73a;
    color: #f73939;
    color: #206af3;
    color: #f5a52e;
    color: #cccccc;
}
</style>