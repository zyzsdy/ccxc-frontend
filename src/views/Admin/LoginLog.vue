<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/loginlog"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>登录记录</h1>
        <el-row>
            <el-col :span="2">用户：</el-col>
            <el-col :span="4">
                <el-select v-model="queryLoginLog.uid" multiple filterable placeholder="全部用户">
                    <el-option
                        v-for="u in userList.uid_item"
                        :key="u.uid"
                        :label="u.displayName"
                        :value="u.uid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">登录状态：</el-col>
            <el-col :span="4">
                <el-select v-model="queryLoginLog.status" multiple placeholder="全部">
                    <el-option
                        v-for="s in userList.status_item"
                        :key="s.status"
                        :label="s.label"
                        :value="s.status">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">登录E-mail：</el-col>
            <el-col :span="4">
                <el-input v-model="queryLoginLog.email"></el-input>
            </el-col>
            <el-col :span="2">登录IP：</el-col>
            <el-col :span="4">
                <el-input v-model="queryLoginLog.ip"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">USERID：</el-col>
            <el-col :span="6">
                <el-input v-model="queryLoginLog.userid"></el-input>
            </el-col>
            <el-col :span="2"><span>时间排序：</span></el-col>
            <el-col :span="4">
                <el-select placeholder="选择排序" v-model="queryLoginLog.order">
                    <el-option label="最新在前" :value="0"></el-option>
                    <el-option label="最老在前" :value="1"></el-option>
                </el-select>
            </el-col>
            <el-col :span="2" :offset="2">
                <el-button type="info" icon="el-icon-search" @click="loadLoginLog(1)">查询</el-button>
            </el-col>
        </el-row>
        <el-table :data="loginLog" class="answer-log-table">
            <el-table-column label="ID" prop="id" width="100px"></el-table-column>
            <el-table-column label="登录时间" prop="formatedDate"></el-table-column>
            <el-table-column label="E-mail" prop="email"></el-table-column>
            <el-table-column label="用户">
                <template slot-scope="u">
                    <el-tooltip placement="bottom" effect="dark">
                        <div slot="content">
                            附加信息<br>
                            PROXY_IP: {{u.row.proxy_ip}}<br>
                            UA: {{u.row.useragent}}
                        </div>
                        <el-button type="text" @click="setUser(u.row.uid)">{{ u.row.username }}</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="IP" prop="ip"></el-table-column>
            <el-table-column label="USERID" prop="userid"></el-table-column>
            <el-table-column label="状态">
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
                @current-change="loadLoginLog">
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
export default class LoginLogView extends Vue {
    userList: UserList = new UserList();
    queryLoginLog: QueryLoginLog = new QueryLoginLog();
    loginLog: LoginLog[] = [];
    pageSize: number = 20;
    totalCount: number = 0;
    async mounted(){
        let grpapi = this.$gConst.apiRoot + "/admin/get-l-user-list";
        let grpres = await fetchPostWithSign(grpapi, {});
        let grpdata = await grpres.json();

        if (grpdata["status"] == 1) {
            this.userList = new UserList(grpdata);
        } else {
            defaultApiErrorAction(this, grpdata);
            this.$router.push("/");
        }

        this.loadLoginLog(1);
    }
    async loadLoginLog(page: number = 1){
        let api = this.$gConst.apiRoot + "/admin/query-login-log";
        this.queryLoginLog.page = page;
        let res = await fetchPostWithSign(api, this.queryLoginLog);
        let data = await res.json();

        if (data["status"] == 1) {
            this.pageSize = data.page_size;
            this.totalCount = data.total_count;
            if (data.login_log) {
                let loginList: LoginLog[] = [];

                for(let loginItem of data.login_log){
                    loginList.push(new LoginLog(loginItem));
                }
                this.loginLog = loginList;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
    setUser(uid: number){
        this.queryLoginLog.uid = [uid];
    }
    getUserName(uid: number){
        let u = this.userList.uid_item.find(it => it.uid == uid);
        if(u) return u.user_name;
        else return uid;
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
            case 4: return "#206af3";
            case 5: return "#f5a52e";
            case 6: return "#3af73a";
            case 7: return "#f73939";
            case 8: return "#206af3";
            default: return "#cccccc";
        }
    }
}

class QueryLoginLog{
    uid: number[] = [];
    status: number[] = [];
    email: string = "";
    ip: string = "";
    userid: string = "";
    order: number = 0;
    page: number = 1;
}

class LoginLog{
    id: number = 0;
    create_time: number = 0;
    email: string = "";
    username: string = "";
    uid: number = 0;
    status: number = 0;
    ip: string = "";
    proxy_ip: string = "";
    useragent: string = "";
    userid: number = 0;

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
            label: "登录成功"
        },
        {
            status: 2,
            label: "请求无效"
        },
        {
            status: 3,
            label: "用户名错误"
        },
        {
            status: 4,
            label: "密码错误"
        },
        {
            status: 5,
            label: "无权限"
        },
        {
            status: 6,
            label: "二次验证成功"
        },
        {
            status: 7,
            label: "二次验证无Ticket"
        },
        {
            status: 8,
            label: "二次验证失败"
        },
        {
            status: 9,
            label: "发送重置密码邮件"
        },
        {
            status: 10,
            label: "重置密码"
        }
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