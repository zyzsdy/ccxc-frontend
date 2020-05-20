<template>
  <div class="home">
    <TopNavbar activeIndex="/repass"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :md="{span: 8, offset: 8}" :xs="24">
                    <h1 class="line-title">修改密码</h1>
                    <el-form :model="repassData" :rules="rules" ref="repassForm" label-width="100px" :hide-required-asterisk="true">
                        <el-form-item label="原密码" prop="oldPassword" required>
                            <el-input v-model="repassData.oldPassword" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="password" required>
                            <el-input v-model="repassData.password" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass" required>
                            <el-input v-model="repassData.checkPass" type="password" autocomplete="off" show-password></el-input>
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
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'

export class RePassData{
    oldPassword: string = "";
    password: string = "";
    checkPass: string = "";
}


@Component({
    components: {
        TopNavbar
    }
})
export default class RePassView extends Vue {
    repassData = new RePassData();
    rules = {
        oldPassword: [{required: true, message: "原密码不能为空", trigger: "blur"}],
        password: [{validator: (rule: any, value: string, callback: any) => {
            if(value === "") callback(new Error("请输入密码"));
            else{
                if(this.repassData.checkPass !== ''){
                    (this.$refs["repassForm"] as HTMLFormElement).validateField("checkPass");
                }
                callback();
            }
        }, trigger: "blur"}],
        checkPass: [{validator: (rule: any, value: string, callback: any) => {
            if(value === "") callback(new Error("请再次输入密码"));
            else if(value !== this.repassData.password) callback(new Error("两次密码不一致"));
            else callback();
        }, trigger: "blur"}],
    }
    submitForm(){
        (this.$refs["repassForm"] as HTMLFormElement).validate(async (valid: boolean) => {
            if (valid) {
                let old_pass = passHash(this.repassData.oldPassword);
                let pass = passHash(this.repassData.password);

                let api = this.$gConst.apiRoot + "/modify-password";
                let res = await fetchPostWithSign(api, {
                    old_pass,
                    pass
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
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
</style>