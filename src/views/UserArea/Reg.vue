<template>
  <div class="home">
    <TopNavbar activeIndex="/reg"/>
    <el-container>
        <el-main>
            <el-row>
                <el-col :span="8" :offset="8">
                    <h1 class="line-title">用户注册</h1>
                    <el-form :model="user" :rules="rules" ref="regForm" label-width="100px">
                        <el-form-item label="用户名" prop="username" required>
                            <el-input v-model="user.username"></el-input>
                        </el-form-item>
                        <el-form-item label="E-mail" prop="email" required>
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password" required>
                            <el-input v-model="user.password" type="password" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass" required>
                            <el-input v-model="user.checkPass" type="password" autocomplete="off" show-password></el-input>
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

@Component({
    components: {
        TopNavbar
    }
})
export default class RegView extends Vue {
    user = new RegUser();
    rules = {
        username: [{required: true, message: "用户名不能为空", trigger: "blur"}, {min: 2, max: 25, message: "用户名长度必须在2-25个字符之间。", trigger: "blur"}],
        email: [{required: true, message: "E-mail不能为空", trigger: "blur"}],
        password: [{validator: (rule: any, value: string, callback: any) => {
            if(value === "") callback(new Error("请输入密码"));
            else{
                if(this.user.checkPass !== ''){
                    (this.$refs["regForm"] as HTMLFormElement).validateField("checkPass");
                }
                callback();
            }
        }, trigger: "blur"}],
        checkPass: [{validator: (rule: any, value: string, callback: any) => {
            if(value === "") callback(new Error("请再次输入密码"));
            else if(value !== this.user.password) callback(new Error("两次密码不一致"));
            else callback();
        }, trigger: "blur"}],
    }
    submitForm(){
        (this.$refs["regForm"] as HTMLFormElement).validate((valid: boolean) => {
            if (valid) {

            }else{
                return false;
            }
        })
    }
    resetForm(){
        (this.$refs["regForm"] as HTMLFormElement).resetFields();
    }
}

export class RegUser{
    username: string = "";
    email: string = "";
    password: string = "";
    checkPass: string = "";
}
</script>

<style lang="scss" scoped>
.line-title{
    padding-bottom: 10px;
    border-bottom: 2px solid #F561A4;
}
</style>