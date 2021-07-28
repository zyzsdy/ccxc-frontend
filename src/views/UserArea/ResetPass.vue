<template>
  <div class="home">
    <TopNavbar activeIndex="/repass"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :md="{span: 8, offset: 8}" :xs="24">
                    <h1 class="line-title">重置密码</h1>
                    <el-form :model="resetPassData" :rules="rules" ref="repassForm" label-width="100px" :hide-required-asterisk="true">
                        <el-form-item>
                            <span v-if="resetPassData.email != ''">验证通过，您正在为用户 {{resetPassData.email}} 重置密码。</span>
                            <span v-else>E-mail正在验证...</span>
                        </el-form-item>
                        <el-form-item label="新密码" prop="password" required>
                            <el-input v-model="resetPassData.password" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass" required>
                            <el-input v-model="resetPassData.checkPass" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">提交</el-button>
                            <el-button @click="resetForm()">重置</el-button>
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

class ResetPassData{
    email: string = "";
    password: string = "";
    checkPass: string = "";
    token: string = "";
}


@Component({
    components: {
        TopNavbar
    }
})
export default class ResetPassView extends Vue {
    resetPassData = new ResetPassData();
    rules = {
        password: [{validator: (rule: any, value: string, callback: any) => {
            if(value === "") callback(new Error("请输入密码"));
            else{
                if(this.resetPassData.checkPass !== ''){
                    (this.$refs["repassForm"] as HTMLFormElement).validateField("checkPass");
                }
                callback();
            }
        }, trigger: "blur"}],
        checkPass: [{validator: (rule: any, value: string, callback: any) => {
            if(value === "") callback(new Error("请再次输入密码"));
            else if(value !== this.resetPassData.password) callback(new Error("两次密码不一致"));
            else callback();
        }, trigger: "blur"}],
    }
    submitForm(){
        (this.$refs["repassForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let pass = passHash(this.resetPassData.password);

                let api = this.$gConst.apiRoot + "/reset-password";
                let res = await fetchPost(api, {
                    pass,
                    token: this.resetPassData.token
                });

                let data = await res.json();

                if(data['status'] == 1){
                    this.$gConst.globalBus.$emit("log-out", {
                        type: "success",
                        message: "密码修改成功，请重新登录。"
                    });
                }else{
                    defaultApiErrorAction(this, data);
                }
            }else{
                return false;
            }
        })
    }
    resetForm(){
        (this.$refs["repassForm"] as HTMLFormElement).resetFields();
    }
    mounted(){
        if (typeof this.$route.query.token == "string") {
            this.resetPassData.token = this.$route.query.token || "";
        }
        
        this.checkToken();
    }
    async checkToken(){
        let api = this.$gConst.apiRoot + "/reset-pass-check-token";
        let res = await fetchPost(api, {
            token: this.resetPassData.token
        });

        let data = await res.json();

        if (data['status'] == 1){
            this.resetPassData.email = data["email"];
        }else{
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
</style>