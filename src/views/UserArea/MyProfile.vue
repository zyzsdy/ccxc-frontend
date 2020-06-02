<template>
  <div class="home">
    <TopNavbar activeIndex="/myprofile"></TopNavbar>
    <el-container>
        <el-main>
            <el-row>
                <el-col :span="24">
                    <h1 class="line-title">个人中心</h1>
                </el-col>
            </el-row>
            <el-row>
                <el-col :sm="24" :md="8" :xl="6">
                    <el-form :model="profileInfo.user_info" :rules="userFormRules" ref="editUserForm" label-position="top" :hide-required-asterisk="true" class="user-small-edit">
                        <el-tooltip placement="bottom-start" :content="'UID: ' + profileInfo.user_info.uid">
                            <h2>
                                <span>{{profileInfo.user_info.username}}</span>
                                <RoleBadge :roleid="profileInfo.user_info.roleid"></RoleBadge>
                            </h2>
                        </el-tooltip>
                        <el-form-item label="用户名" prop="username" required>
                            <el-input v-model="profileInfo.user_info.username"></el-input>
                        </el-form-item>
                        <el-form-item label="E-mail" prop="email" required>
                            <el-input v-model="profileInfo.user_info.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="profileInfo.user_info.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="个人简介">
                            <el-input type="textarea" v-model="profileInfo.user_info.profile" :autosize="{minRows: 5, maxRows: 20}" maxlength="350" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editUserForm()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :sm="24" :md="16" :xl="18">
                    <div class="hidden-md-and-up line-title" style="margin-bottom: 20px;"></div>
                    <div v-if="profileInfo.group_info == null">
                        <el-alert title="请注意，您现在还未完成报名" description="建立组队或者接受邀请来完成报名。" type="info" :closable="false" show-icon></el-alert>

                        <div v-if="profileInfo.user_info.roleid == 1 && inviteInfoList.length > 0">
                            <h3>邀请信息</h3>
                            <el-alert type="info" title="以下为您收到的邀请" description="请注意邀请有效期至报名时间截止，在报名截止后所有邀请会被自动撤销。" :closable="false"></el-alert>
                            <el-table :data="inviteInfoList" class="group-info-member-table">
                                <el-table-column label="邀请时间" prop="formatedDate"></el-table-column>
                                <el-table-column label="队名" prop="from_groupname"></el-table-column>
                                <el-table-column label="操作" width="260px">
                                    <template slot-scope="u">
                                        <el-popconfirm title="确认拒绝该邀请？" @onConfirm="declineInvite(u.row.iid)">
                                            <el-button slot="reference" type="danger" size="small" plain>拒绝邀请</el-button>
                                        </el-popconfirm>
                                        <el-popconfirm title="确认接受该邀请？" @onConfirm="acceptInvite(u.row.iid)">
                                            <el-button slot="reference" type="success" size="small" style="margin-left: 5px">接受邀请</el-button>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>


                        <div class="no-group-box" @click="newGroupDialogVisible = true">
                            <span><i class="el-icon-circle-plus-outline"></i> 建立新队伍</span>
                        </div>
                        <el-dialog title="建立新队伍" :visible.sync="newGroupDialogVisible">
                            <el-form :model="createNewGroupInfo" :rules="createNewGroupRules" ref="createNewGroupForm" :hide-required-asterisk="true">
                                <el-form-item label="队名" prop="groupname" required>
                                    <el-input v-model="createNewGroupInfo.groupname"></el-input>
                                </el-form-item>
                                <el-form-item label="队伍简介">
                                    <el-input type="textarea" v-model="createNewGroupInfo.profile" :autosize="{minRows: 10, maxRows: 30}" maxlength="350" show-word-limit></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="createNewGroupFormReset()">取消</el-button>
                                <el-button type="primary" @click="createNewGroup()">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                    <div v-else>
                        <h3>队伍信息</h3>
                        <el-row>
                            <el-col :sm="24" :md="18" :xl="20">
                                <el-form :model="profileInfo.group_info" :rules="createNewGroupRules" ref="editGroupForm" :hide-required-asterisk="true" label-width="100px">
                                    <el-form-item label="队名" prop="groupname" required>
                                        <el-input v-model="profileInfo.group_info.groupname" :readonly="!isGroupLeader"></el-input>
                                    </el-form-item>
                                    <el-form-item label="队伍简介">
                                        <el-input type="textarea" v-model="profileInfo.group_info.profile" :autosize="{minRows: 5, maxRows: 30}" maxlength="350" show-word-limit :readonly="!isGroupLeader"></el-input>
                                    </el-form-item>
                                    <el-form-item label="队伍人数">
                                        <span>{{profileInfo.group_info.member_list.length}}</span>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :sm="24" :md="6" :xl="4" class="group-info-general-operations-box" v-if="isGroupLeader">
                                <el-popover ref="sendInviteDialog" trigger="click">
                                    <el-form ref="sendInviteForm" @submit.native.prevent>
                                        <el-form-item label="选择接收邀请的用户">
                                            <el-autocomplete v-model="searchUserKeyword" placeholder="键入用户名以开始搜索" :fetch-suggestions="searchNoGroupUser" value-key="username" :trigger-on-focus="true"></el-autocomplete>
                                        </el-form-item>
                                        <el-form-item style="text-align: right; margin: 0">
                                            <el-button type="primary" size="mini" @click="sendInvite()">发送邀请</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-popover>
                                <el-button v-popover:sendInviteDialog type="warning" icon="el-icon-circle-plus">邀请队员</el-button>
                                <el-button type="info" icon="el-icon-edit" @click="editGroupInfo()">保存编辑</el-button>
                                <el-button type="danger" icon="el-icon-error" @click="deleteGroup()">解散组队</el-button>
                            </el-col>
                            <el-col :sm="24" :md="6" :xl="4" class="group-info-general-operations-box" v-else>
                                <el-button type="danger" icon="el-icon-error" @click="exitGroup()">退出组队</el-button>
                            </el-col>
                        </el-row>
                        <el-table :data="profileInfo.group_info.member_list" class="group-info-member-table">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column label="用户名">
                                <template slot-scope="u">
                                    <span>{{u.row.username}}</span>
                                    <RoleBadge :roleid="u.row.roleid"></RoleBadge>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" v-if="isGroupLeader" width="130px">
                                <template slot-scope="u">
                                    <el-popconfirm title="确认将该用户从当前队伍中移除吗？" @onConfirm="deleteGroupUser(u.row.uid)">
                                        <el-button slot="reference" type="danger">移除用户</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-if="profileInfo.user_info.roleid == 3 && inviteInfoList.length > 0">
                            <h3>邀请信息</h3>
                            <el-alert type="info" title="已向下列用户发出了邀请但是对方仍未接受，队长可在此查看或撤销邀请。" description="请注意邀请有效期至报名时间截止，在报名截止后所有邀请会被自动撤销。" :closable="false"></el-alert>
                            <el-table :data="inviteInfoList" class="group-info-member-table">
                                <el-table-column type="index" label="序号"></el-table-column>
                                <el-table-column label="邀请时间" prop="formatedDate"></el-table-column>
                                <el-table-column label="用户名" prop="to_username"></el-table-column>
                                <el-table-column label="操作" width="130px">
                                    <template slot-scope="u">
                                        <el-popconfirm title="确认撤销该邀请？" @onConfirm="deleteInvite(u.row.iid)">
                                            <el-button slot="reference" type="danger" size="small">撤销邀请</el-button>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                            </el-table>
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
import TopNavbar from '@/components/TopNavbar.vue'
import RoleBadge from '@/components/RoleBadge.vue'
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import { formatTimestamp } from '@/utils/formatDate'
import 'element-ui/lib/theme-chalk/display.css';

@Component({
    components: {
        TopNavbar,
        RoleBadge
    }
})
export default class MyProfileView extends Vue {
    profileInfo: MyProfileInfo = new MyProfileInfo({user_info: null, group_info: null});
    createNewGroupInfo: GroupInfo = new GroupInfo();
    searchUserKeyword: string = "";
    inviteInfoList: InviteInfo[] = [];
    userFormRules = {
        username: [{required: true, message: "用户名不能为空", trigger: "blur"}, {min: 2, max: 25, message: "用户名长度必须在2-25个字符之间。", trigger: "blur"}],
        email: [{required: true, message: "E-mail不能为空", trigger: "blur"}]
    }
    createNewGroupRules = {
        groupname: [{required: true, message: "队名不能为空", trigger: "blur"}]
    }
    newGroupDialogVisible = false;
    async mounted(){
        let api = this.$gConst.apiRoot + "/get-profileInfo";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if(data['status'] == 1){
            this.profileInfo = new MyProfileInfo(data);

            let inviteApi = "";
            if(this.profileInfo.user_info.roleid == 1){
                inviteApi = this.$gConst.apiRoot + "/list-my-invite";
            }
            else if(this.profileInfo.user_info.roleid == 3){
                inviteApi = this.$gConst.apiRoot + "/list-sent-invites";
            }

            if(inviteApi !== ""){
                let inviteRes = await fetchPostWithSign(inviteApi, {});
                let inviteData = await inviteRes.json();

                if(inviteData['status'] == 1){
                    if(inviteData['result'] != null){
                        for(let inviteItem of inviteData['result']){
                            let inviteInfoObj = new InviteInfo(inviteItem);
                            this.inviteInfoList.push(inviteInfoObj);
                        }
                    }
                }
                else{
                    defaultApiErrorAction(this, inviteData);
                }
            }

        }else{
            defaultApiErrorAction(this, data);
            this.$router.push('/');
        }
    }
    get isGroupLeader(){
        return this.profileInfo.user_info.roleid == 3;
    }
    editUserForm(){
        (this.$refs["editUserForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let username = this.profileInfo.user_info.username;
                let email = this.profileInfo.user_info.email;
                let phone = this.profileInfo.user_info.phone;
                let profile = this.profileInfo.user_info.profile;

                let api = this.$gConst.apiRoot + "/edit-user";
                let res = await fetchPostWithSign(api, {
                    username,
                    email,
                    phone,
                    profile
                });

                let data = await res.json();

                if(data['status'] == 1){
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    });
                    this.$gConst.globalBus.$emit("reload");
                }else{
                    defaultApiErrorAction(this, data);
                }
            }else{
                return false;
            }
        })
    }
    createNewGroup(){
        (this.$refs["createNewGroupForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let groupname = this.createNewGroupInfo.groupname;
                let profile = this.createNewGroupInfo.profile;

                let api = this.$gConst.apiRoot + "/create-group";
                let res = await fetchPostWithSign(api, {
                    groupname,
                    profile
                });

                let data = await res.json();

                if(data['status'] == 1){
                    this.$gConst.globalBus.$emit("log-out", {
                        message: "您的组队已建立成功，请重新登录以验证您的队长身份。",
                        type: "success"
                    });
                }else{
                    defaultApiErrorAction(this, data);
                }
            }else{
                return false;
            }
        });
    }
    editGroupInfo(){
        if(!this.isGroupLeader){
            this.$message({
                type: "error",
                message: "只有队长才能操作"
            })
            return false;
        }

        (this.$refs["editGroupForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let groupname = (this.profileInfo.group_info as GroupInfo).groupname;
                let profile = (this.profileInfo.group_info as GroupInfo).profile;

                let api = this.$gConst.apiRoot + "/edit-group";
                let res = await fetchPostWithSign(api, {
                    groupname,
                    profile
                });

                let data = await res.json();

                if(data['status'] == 1){
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.$gConst.globalBus.$emit("reload");
                }else{
                    defaultApiErrorAction(this, data);
                }
            }else{
                return false;
            }
        });
    }
    createNewGroupFormReset(){
        (this.$refs["createNewGroupForm"] as HTMLFormElement).resetFields();
        this.newGroupDialogVisible = false;
    }
    async searchNoGroupUser(kw: string, cb: Function){
        let api = this.$gConst.apiRoot + "/search-no-group-user";

        let res = await fetchPostWithSign(api, {
            kw_uname: kw
        });

        let data = await res.json();

        if(data['status'] == 1){
            cb(data.result);
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    async deleteGroupUser(uid: number){
        if(!this.isGroupLeader){
            this.$message({
                type: "error",
                message: "只有队长才能操作"
            })
            return false;
        }

        if(uid == this.profileInfo.user_info.uid){
            this.$message({
                type: "error",
                message: "不能删除自己"
            })
            return false;
        }

        let api = this.$gConst.apiRoot + "/remove-group-member";
        let res = await fetchPostWithSign(api, {
            uid
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$message({
                message: "删除成功",
                type: "success"
            });
            this.$gConst.globalBus.$emit("reload");
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    async exitGroup(){
        try {
            await this.$confirm("您将退出组队，恢复未报名用户身份。此操作不能撤销，是否继续？", "操作确认", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            });

            let api = this.$gConst.apiRoot + "/exit-group";
            let res = await fetchPostWithSign(api, {});
            let data = await res.json();

            if(data['status'] == 1){
                this.$gConst.globalBus.$emit("log-out", {
                    message: "您已退出组队，恢复未报名状态，请重新登录。",
                    type: "success"
                });
            }else{
                defaultApiErrorAction(this, data);
            }
        } catch (error) {
            
        }
    }
    async deleteGroup(){
        if(!this.isGroupLeader){
            this.$message({
                type: "error",
                message: "只有队长才能操作"
            })
            return false;
        }

        try {
            await this.$confirm("解散组队后，当前组队中所有成员都将恢复为未报名状态。此操作不能撤销，是否继续？", "操作确认", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            });

            let api = this.$gConst.apiRoot + "/delete-group";
            let res = await fetchPostWithSign(api, {});
            let data = await res.json();

            if(data['status'] == 1){
                this.$gConst.globalBus.$emit("log-out", {
                    message: "组队已删除，您和所有组队中的成员都已恢复未报名状态，请重新登录。",
                    type: "success"
                });
            }else{
                defaultApiErrorAction(this, data);
            }
        } catch (error) {
            
        }
    }
    async sendInvite(){
        if(!this.isGroupLeader){
            this.$message({
                type: "error",
                message: "只有队长才能操作"
            })
            return false;
        }

        let api = this.$gConst.apiRoot + "/send-invite";
        let res = await fetchPostWithSign(api, {
            username: this.searchUserKeyword
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$message({
                message: "发送邀请成功",
                type: "success"
            });
            this.$gConst.globalBus.$emit("reload");
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    async deleteInvite(iid: number){
        if(!this.isGroupLeader){
            this.$message({
                type: "error",
                message: "只有队长才能操作"
            })
            return false;
        }

        let api = this.$gConst.apiRoot + "/invalidate-invite";
        let res = await fetchPostWithSign(api, {
            iid
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$message({
                message: "撤销邀请成功",
                type: "success"
            });
            this.$gConst.globalBus.$emit("reload");
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    async declineInvite(iid: number){
        let api = this.$gConst.apiRoot + "/decline-invite";
        let res = await fetchPostWithSign(api, {
            iid
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$message({
                message: "邀请已拒绝",
                type: "success"
            });
            this.$gConst.globalBus.$emit("reload");
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    async acceptInvite(iid: number){
        let api = this.$gConst.apiRoot + "/accept-invite";
        let res = await fetchPostWithSign(api, {
            iid
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$gConst.globalBus.$emit("log-out", {
                message: "您以成功加入组队，请重新登录以验证您的组队身份。",
                type: "success"
            });
        }else{
            defaultApiErrorAction(this, data);
        }
    }
}

export class InviteInfo{
    iid: number = 0;
    create_time: number = 0;
    from_uid: number = 0;
    to_gid: number = 0;
    valid: number = 0;
    to_username: string = "";
    from_groupname: string = "";

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get formatedDate(){
        return formatTimestamp(this.create_time);
    }
}

export class UserInfo{
    uid: number = 0;
    username: string = "";
    email: string = "";
    phone: string = "";
    roleid: number = -1;
    create_time: number = 0;
    update_time: number = 0;
    profile: string = "";

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
}

export class GroupInfo{
    gid: number = 0;
    groupname: string = "";
    create_time: number = 0;
    update_time: number = 0;
    profile: string = "";
    member_list: UserInfo[] = [];

    constructor(obj?: any){
        Object.assign(this, obj);
        let member_list = [];
        if(obj && obj.member_list){
            for(let member of obj.member_list){
                member_list.push(new UserInfo(member));
            }
        }
        this.member_list = member_list;
    }
}

export class MyProfileInfo{
    user_info: UserInfo = new UserInfo();
    group_info: GroupInfo | null = null;

    constructor(obj: any){
        this.user_info = new UserInfo(obj.user_info);
        if(obj.group_info){
            this.group_info = new GroupInfo(obj.group_info);
        }
        
    }
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
.user-small-edit{
    padding-right: 40px;
}
.no-group-box{
    height: 200px;
    margin-top: 20px;
    border: 2px dashed #999999;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s linear;
    cursor: pointer;
    span {
        color :#999999;
        letter-spacing: 15px;
        font-size: 20px;
    }
}
.no-group-box:hover{
    background-color: #313131;
}
.group-info-general-operations-box{
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    flex-direction: column;
    .el-button + .el-button{
        margin-left: 0;
        margin-top: 10px;
    }
}
.group-info-member-table{
    width: 100%;
    margin-top: 20px;
}
</style>