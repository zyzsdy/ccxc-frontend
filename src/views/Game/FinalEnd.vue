<template>
  <div class="home">
    <el-container>
        <el-main>
            <el-row>
                <el-col :sm="24" :md="{span: 12, offset: 6}" class="game-list-main">
                    <div>CCBC X</div>
                    <div>
                        <h1>THE END</h1>
                        <div v-html="renderHtml"></div>
                    </div>
                    <div class="back">
                        <el-button @click="backHome">返回主页</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import marked from "marked";

@Component
export default class FinalEndView extends Vue {
    finalDesc: string = "";
    async mounted(){
        if(!this.isLogin()){
            this.$router.push('/login')
            return;
        }

        let api = this.$gConst.apiRoot + "/play/get-final-info";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if(data['status'] == 1){
            this.finalDesc = data.desc;
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    isLogin(){
        return localStorage.getItem("token") !== null;
    }
    get renderHtml(){
        return marked(this.finalDesc);
    }
    backHome(){
        this.$router.push('/');
    }
}
</script>

<style lang="scss" scoped>
.game-list-main{
    text-align: center;
}
.back{
    margin-top: 200px;
    margin-bottom: 200px;
}
</style>