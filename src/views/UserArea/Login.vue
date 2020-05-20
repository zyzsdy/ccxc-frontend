<template>
  <div class="home">
    <TopNavbar activeIndex="/login"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :md="{span: 8, offset: 8}" :xs="24">
                    <h1 class="line-title">登录</h1>
                    <el-form :model="user" :rules="rules" ref="loginForm" label-width="100px" :hide-required-asterisk="true">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="user.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="user.password" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TopNavbar from '@/components/TopNavbar.vue'
import { passHash } from '@/utils/crypt'
import { fetchPost, defaultApiErrorAction } from '@/utils/fetchPost'

@Component({
    components: {
        TopNavbar
    }
})
export default class LoginView extends Vue {
    user = new LoginUser();
    rules = {
        username: [{required: true, message: "用户名不能为空", trigger: "blur"}],
        password: [{required: true, message: "密码不能为空", trigger: "blur"}]
    }
    submitForm(){
        (this.$refs["loginForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let username = this.user.username;
                let pass = passHash(this.user.password);

                let api = this.$gConst.apiRoot + "/user-login";
                let res = await fetchPost(api, {
                    username,
                    pass
                });
                let data = await res.json();

                if(data['status'] == 1){
                    this.$message({
                        message: "登录成功",
                        type: "success"
                    });
                    this.$router.push('/');

                    localStorage.setItem("uid", data["user_login_info"]["uid"]);
                    localStorage.setItem("username", data["user_login_info"]["username"]);
                    localStorage.setItem("roleid", data["user_login_info"]["roleid"]);
                    localStorage.setItem("token", data["user_login_info"]["token"]);
                    localStorage.setItem("sk", data["user_login_info"]["sk"]);
                }else{
                    defaultApiErrorAction(this, data);
                }
            }else{
                return false;
            }
        })
    }
    mounted(){
        if(localStorage.getItem("token") != null){
            this.$gConst.globalBus.$emit("show-error", "您已登录。");
            this.$router.push("/");
        }
    }
}

export class LoginUser{
    username: string = "";
    password: string = "";
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
</style>