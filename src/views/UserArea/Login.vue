<template>
  <div class="home">
    <TopNavbar activeIndex="/login"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :md="{span: 8, offset: 8}" :xs="24">
                    <h1 class="line-title">登录</h1>
                    <el-form :model="user" :rules="rules" ref="loginForm" label-width="100px" :hide-required-asterisk="true"> 
                        <el-form-item label="E-mail" prop="email">
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="user.password" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()" :loading="loginloading">登录</el-button>
                            <el-button type="text" @click="goForgetPass()">重置密码</el-button>
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
import { GetUserId } from '@/utils/client'

@Component({
    components: {
        TopNavbar
    }
})
export default class LoginView extends Vue {
    user = new LoginUser();
    loginloading = false;
    rules = {
        email: [{required: true, message: "E-mail不能为空", trigger: "blur"}],
        password: [{required: true, message: "密码不能为空", trigger: "blur"}]
    }
    submitForm(){
        (this.$refs["loginForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                this.loginloading = true;
                let userid = await GetUserId();
                let email = this.user.email;
                let pass = passHash(this.user.password);

                let api = this.$gConst.apiRoot + "/user-login";
                let res = await fetchPost(api, {
                    email,
                    pass,
                    userid
                });
                let data = await res.json();

                if(data['status'] == 1){
                    this.loginloading = false;
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
                    localStorage.setItem("etc", data["user_login_info"]["etc"]);
                }else{
                    this.loginloading = false;
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
    goForgetPass(){
        this.$router.push("/forgetpass");
    }
}

export class LoginUser{
    email: string = "";
    password: string = "";
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
</style>