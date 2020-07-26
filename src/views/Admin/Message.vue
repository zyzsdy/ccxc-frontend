<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/message"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>站内信</h1>
        <div>
            <h3>发送邮件 给
                <el-select placeholder="请选择接收方队伍" v-model="sendGid" filterable>
                    <el-option
                        v-for="it in userGroupNameList"
                        :key="it.gid"
                        :label="it.groupname"
                        :value="it.gid">
                    </el-option>
                </el-select>
            </h3>
            <p>邮件内容：</p>
            <el-input
                type="textarea"
                placeholder="使用Markdown格式书写内容"
                v-model="sendContent"
                :autosize="{minRows: 8}">
            </el-input>
            <el-button type="primary" style="margin-top: 10px;" @click="sendMessage">发送</el-button>
        </div>
        <div>
            <h3>邮件记录</h3>
            <el-row>
                <el-col :span="2"><span>按组队筛选：</span></el-col>
                <el-col :span="4">
                    <el-select placeholder="请选择队伍" v-model="queryGid" filterable>
                        <el-option
                            v-for="it in userGroupNameList"
                            :key="it.gid"
                            :label="it.groupname"
                            :value="it.gid">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"><span>已读状态：</span></el-col>
                <el-col :span="4">
                    <el-select placeholder="选择已读状态" v-model="queryRead">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="已读" :value="1"></el-option>
                        <el-option label="未读" :value="2"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"><span>时间排序：</span></el-col>
                <el-col :span="4">
                    <el-select placeholder="选择排序" v-model="queryOrder">
                        <el-option label="最新在前" :value="0"></el-option>
                        <el-option label="最老在前" :value="1"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="2">
                    <el-button type="info" icon="el-icon-search" @click="loadMessage(1)">查询</el-button>
                </el-col>
            </el-row>
            <el-table :data="messageList" class="message-table" @row-dblclick="openPreview">
                <el-table-column label="发送状态" width="110px">
                    <template slot-scope="u">
                        <span v-if="u.row.direction == 0" class="message-receive"><i class="el-icon-bottom"></i> 接收</span>
                        <span v-else-if="u.row.direction == 1" class="message-send"><i class="el-icon-top"></i> 发送</span>
                        <span v-else>未知</span>
                        <span v-if="u.row.is_read == 0" class="message-notread">[未读]</span>
                        <span v-else class="message-read">[已读]</span>
                    </template>
                </el-table-column>
                <el-table-column prop="formatedDate" label="发送时间" width="160px"></el-table-column>
                <el-table-column label="组名">
                    <template slot-scope="u">
                        <el-button type="text" @click="setGroupQuery(u.row.gid)">{{ u.row.group_name }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="发送者">
                    <template slot-scope="u">
                        {{u.row.user_name}}<RoleBadge :roleid="u.row.roleid"></RoleBadge>
                    </template>
                </el-table-column>
                <el-table-column prop="preview" label="内容(双击展开详情)"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="u">
                        <el-button @click="setRead(u.row.mid)">已读</el-button>
                        <el-popconfirm title="是否确认删除" @onConfirm="deleteMessage(u.row.mid)">
                            <el-button slot="reference" style="margin-left: 10px;">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="message-pager">
                <el-pagination 
                    layout="prev, pager, next"
                    :total="totalCount"
                    :page-size.sync="pageSize"
                    @current-change="loadMessage">
                </el-pagination>
            </div>
            <el-drawer title="消息预览" :visible.sync="messagePreview" direction="rtl">
                <div class="message-side-preview">
                    <el-button type="success" @click="setReply">回复</el-button>
                    <el-button type="primary" @click="setPenalty">增加罚时</el-button>
                    <div v-html="messagePreviewHtml"></div>
                </div>
            </el-drawer>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import RoleBadge from '@/components/RoleBadge.vue'
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import { formatTimestamp } from '@/utils/formatDate';
import marked from "marked";

@Component({
  components: {
    AdminSidebar,
    RoleBadge
  }
})
export default class MessageAdminView extends Vue {
    sendGid: number = 0;
    sendContent: string = "";
    userGroupNameList: GroupName[] = [];
    queryGid: number = 0;
    queryRead: number = 0;
    queryOrder: number = 0;
    messageList: MessageItem[] = [];
    pageSize: number = 20;
    totalCount: number = 0;
    messagePreview: boolean = false;
    messagePreviewGid: number = 0;
    messagePreviewHtml: string = "";
    async mounted() {
        let grpapi = this.$gConst.apiRoot + "/admin/list-group-name";
        let grpres = await fetchPostWithSign(grpapi, {});
        let grpdata = await grpres.json();

        if (grpdata["status"] == 1) {
            if (grpdata["group_name_list"]) {
                let newPgList: GroupName[] = [];

                for (let pgItem of grpdata["group_name_list"]) {
                    newPgList.push(new GroupName(pgItem));
                }

                var allGroup = new GroupName();
                allGroup.gid = 0;
                allGroup.groupname = "全部";
                newPgList.push(allGroup);
                this.userGroupNameList = newPgList;
            }
        } else {
            defaultApiErrorAction(this, grpdata);
            this.$router.push("/");
        }

        this.loadMessage(1);
    }
    async sendMessage(){
        if(this.sendContent == ""){
            this.$message.error("发送内容不能为空");
            return;
        }

        if(this.sendGid <= 0){
            this.$message.error("发送目标不正确");
            return;
        }

        let api = this.$gConst.apiRoot + "/admin/add-message";
        let res = await fetchPostWithSign(api, {
            gid: this.sendGid,
            content: this.sendContent
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "发送成功"
            });
            this.$gConst.globalBus.$emit("reload");
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    async loadMessage(page: number = 1){
        let api = this.$gConst.apiRoot + "/admin/query-message";
        let res = await fetchPostWithSign(api, {
            gid: this.queryGid,
            read: this.queryRead,
            order: this.queryOrder,
            page: page
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.pageSize = data.page_size;
            this.totalCount = data.total_count;
            if (data.messages) {
                let newMessageItems: MessageItem[] = [];

                for(let mail of data.messages){
                    newMessageItems.push(new MessageItem(mail));
                }
                this.messageList = newMessageItems;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
    async setRead(mid: number){
        let api = this.$gConst.apiRoot + "/admin/set-read-message";
        let res = await fetchPostWithSign(api, {
            mid
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "标记已读成功"
            });
            this.$gConst.globalBus.$emit("reload");
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    async deleteMessage(mid: number){
        let api = this.$gConst.apiRoot + "/admin/delete-message";
        let res = await fetchPostWithSign(api, {
            mid
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
    async addPenalty(){
        if(this.messagePreviewGid <= 0){
            this.$message({
                type: "error",
                message: "未选定待操作的队伍。"
            });
            return;
        }

        let api = this.$gConst.apiRoot + "/admin/add-penalty";
        let res = await fetchPostWithSign(api, {
            gid: this.messagePreviewGid
        });
        let data = await res.json();

        if (data["status"] == 1) {
            this.$message({
                type: "success",
                message: "指定队伍增加罚时成功"
            });
            this.$gConst.globalBus.$emit("reload");
        } else {
            defaultApiErrorAction(this, data);
        }
    }
    async setPenalty(){
        let groupItem = this.userGroupNameList.find(it => it.gid == this.messagePreviewGid);
        if(!groupItem) {
            this.$message({
                type: "error",
                message: "无法确认待操作的队伍。"
            });
            return;
        }

        let api = this.$gConst.apiRoot + "/admin/get-penalty";
        let res = await fetchPostWithSign(api, {
            gid: this.messagePreviewGid
        });
        let data = await res.json();
        let messagePreviewPenalty = 0;

        if (data["status"] == 1) {
            messagePreviewPenalty = data.penalty;
        } else {
            defaultApiErrorAction(this, data);
        }

        try{
            await this.$confirm(`是否确认增加队伍 ${groupItem.groupname} (GID: ${groupItem.gid}) 的罚时？该队伍已有罚时： ${messagePreviewPenalty} 小时`, "罚时增加确认", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            });

            this.messagePreview = false;
            this.addPenalty();
        } catch (error) {

        }
            
    }
    setGroupQuery(gid: number){
        this.queryGid = gid;
        this.loadMessage(1);
    }
    openPreview(row: MessageItem, col: any, event:any){
        this.messagePreviewGid = row.gid;
        this.messagePreviewHtml = row.renderedHtml;
        this.messagePreview = true;
    }
    setReply(){
        this.sendGid = this.messagePreviewGid;
        this.messagePreview = false;
    }
}

class GroupName{
    gid: number = 0;
    groupname: string = "";

    constructor(obj?: any) {
        if (obj) Object.assign(this, obj);
    }
}

class MessageItem{
    mid: number = 0;
    create_time: number = 0;
    gid: number = 0;
    uid: number = 0;
    content: string = "";
    is_read: number = 0;
    direction: number = 0;
    user_name: string = "";
    group_name: string = "";
    roleid: number = 0;

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get formatedDate(){
        return formatTimestamp(this.create_time);
    }
    get renderedHtml(){
        return marked(this.content);
    }
    get preview(){
        return this.content.substring(0, 500);
    }
}
</script>

<style lang="scss" scoped>
.message-table{
    margin-top: 15px;
}
.message-side-preview{
    padding: 20px;
}
.message-pager{
    text-align: center;
    margin-top: 15px;
}
.message-send{
    color: #e69350;
}
.message-receive{
    color: #679bdf;
}
.message-read{
    color: #999999;
}
.message-notread{
    color: #df5959;
}
</style>