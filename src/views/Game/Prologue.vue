<template>
  <div class="home">
    <BottomNavbar activeIndex="/prologue"></BottomNavbar>
    <el-container>
        <el-main>
            <el-row>
                <el-col :sm="24" :md="{span: 12, offset: 6}" class="game-list-main">
                    <div>CCBC X</div>
                    <div><h1>序章</h1></div>
                    <div v-html="prologueHtml"></div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BottomNavbar from '@/components/BottomNavbar.vue'
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import marked from "marked";
import { setIcon } from '@/utils/asyncUtils'

@Component({
    components: {
        BottomNavbar
    }
})
export default class PrologueView extends Vue {
    prologueHtml: string = "";
    async mounted(){
        if(!this.isLogin()){
            this.$router.push('/login')
            return;
        }

        let api = this.$gConst.apiRoot + "/play/get-prologue";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if(data['status'] == 1){
            this.prologueHtml = marked(data.message);
            localStorage.setItem("prologue", "o");
        }else{
            defaultApiErrorAction(this, data);
        }

        setIcon();
    }
    isLogin(){
        return localStorage.getItem("token") !== null;
    }
}
</script>