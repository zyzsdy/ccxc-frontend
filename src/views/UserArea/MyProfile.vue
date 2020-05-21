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
                        <el-alert title="建立组队或者接受邀请来完成报名。" type="info" :closable="false" show-icon></el-alert>
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
                        <div>队名 {{profileInfo.group_info.groupname}}</div>
                        <div>简介 {{profileInfo.group_info.profile}}</div>
                        <div>队伍人数 {{profileInfo.group_info.member_list.length}}</div>
                        编辑 解散队伍 退出队伍
                        <el-table :data="profileInfo.group_info.member_list" style="width: 100%">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column label="用户名">
                                <template slot-scope="u">
                                    <span>{{u.row.username}}</span>
                                    <RoleBadge :roleid="u.row.roleid"></RoleBadge>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template>
                                    移除
                                </template>
                            </el-table-column>
                        </el-table>
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
    userFormRules = {
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
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    editUserForm(){
        (this.$refs["editUserForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let email = this.profileInfo.user_info.email;
                let phone = this.profileInfo.user_info.phone;
                let profile = this.profileInfo.user_info.profile;

                let api = this.$gConst.apiRoot + "/edit-user";
                let res = await fetchPostWithSign(api, {
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
                    this.$message({
                        message: "建立成功",
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
</style>