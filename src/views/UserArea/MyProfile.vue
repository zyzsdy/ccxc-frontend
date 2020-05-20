<template>
  <div class="home">
    <TopNavbar activeIndex="/myprofile"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :span="24">
                    <h1 class="line-title">个人中心</h1>
                </el-col>
            </el-row>
            <el-row>
                <el-col :md="8" :sm="24">
                    <el-form :model="profileInfo.user_info" ref="editUserForm" label-position="top" :hide-required-asterisk="true" class="user-small-edit">
                        <el-tooltip placement="bottom-start" :content="'UID: ' + profileInfo.user_info.uid">
                            <h2>
                                <span>{{profileInfo.user_info.username}}</span>
                                <RoleBadge :roleid="profileInfo.user_info.roleid"/>
                            </h2>
                        </el-tooltip>
                        <el-form-item label="E-mail" required>
                            <el-input v-model="profileInfo.user_info.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="profileInfo.user_info.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="个人简介">
                            <el-input type="textarea" v-model="profileInfo.user_info.profile" :autosize="{minRows: 5, maxRows: 20}"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editUserForm()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="16" :sm="24">
                    主界面
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

@Component({
    components: {
        TopNavbar,
        RoleBadge
    }
})
export default class MyProfileView extends Vue {
    profileInfo: MyProfileInfo = new MyProfileInfo({user_info: null, group_info: null});
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
}

export class UserInfo{
    uid: number = 0;
    username: string = "";
    email: string = "";
    phone: string = "";
    roleid: number = 0;
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

    constructor(obj: any){
        Object.assign(this, obj);
        let member_list = [];
        for(let member of obj.member_list){
            member_list.push(new UserInfo(member));
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
</style>