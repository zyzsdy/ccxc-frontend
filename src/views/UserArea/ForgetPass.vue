<template>
  <div class="home">
    <TopNavbar activeIndex="/login"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :md="{span: 8, offset: 8}" :xs="24">
                    <h1 class="line-title">重置密码</h1>
                    <el-form :model="forgetPass" :rules="rules" ref="forgetPassForm" label-width="100px" :hide-required-asterisk="true"> 
                        <el-form-item label="E-mail" prop="email">
                            <el-input v-model="forgetPass.email" autocomplete="off" placeholder="输入注册时使用的E-mail"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="code">
                            <el-input v-model="forgetPass.code" type="code" autocomplete="off" placeholder="图片为动图，看不清可以等待下一帧，点击刷新"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <a href="javascript:;" @click="reloadCaptcha()"><el-image class="captcha-image" :src="captchaUrl" fit="contain"></el-image></a>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()" :loading="loading">{{buttonName}}</el-button>
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
import { sleep } from '@/utils/asyncUtils'
import { fetchPost, defaultApiErrorAction } from '@/utils/fetchPost'
import { GetUserId } from '@/utils/client'

@Component({
    components: {
        TopNavbar
    }
})
export default class ForgetPassView extends Vue {
    forgetPass = new ForgetPassItem();
    loading = false;
    captchaUrl = "";
    rules = {
        email: [{required: true, message: "E-mail不能为空", trigger: "blur"}],
        code: [{required: true, message: "验证码不能为空", trigger: "blur"}]
    }
    buttonResetSecond = 0;
    get buttonName(){
        if (this.buttonResetSecond <= 0) return "发送重置邮件";
        else return `${this.buttonResetSecond}s 后可重试`;
    }
    submitForm(){
        (this.$refs["forgetPassForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                this.buttonResetSecond = 120;
                this.loading = true;

                this.resetButtonCounter(); //启动倒计时
                let userid = await GetUserId();
                let email = this.forgetPass.email;
                let code = this.forgetPass.code;
                let nonce = this.forgetPass.nonce;

                let api = this.$gConst.apiRoot + "/send-reset-pass-email";
                let res = await fetchPost(api, {
                    email,
                    code,
                    userid,
                    nonce
                });
                let data = await res.json();

                if(data['status'] == 1){
                    this.$alert("重置密码邮件已发送，请检查您的收件箱，并根据邮件指引完成后续操作。", "重置密码", {
                        type: "success"
                    });
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

        this.reloadCaptcha();
    }
    async resetButtonCounter(){

        while (this.buttonResetSecond > 0){
            await sleep(1000);
            this.buttonResetSecond--;
        }

        this.loading = false;
    }
    async reloadCaptcha(){
        let captchaUrl = this.$gConst.apiRoot + "/getcaptcha";
        let response = await fetch(captchaUrl, {
            method: "GET"
        });

        this.forgetPass.nonce = response.headers.get("X-Captcha-Nonce") || "";
        let imgContent = await response.blob();
        this.captchaUrl = URL.createObjectURL(imgContent);
    }
}

export class ForgetPassItem{
    email: string = "";
    code: string = "";
    nonce: string = "";
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
.captcha-image{
    width: 120px;
    height: 50px;
}
</style>