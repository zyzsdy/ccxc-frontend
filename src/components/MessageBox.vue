<template>
    <div>
        <div>
            <el-input
                type="textarea"
                placeholder="使用Markdown格式书写内容"
                v-model="newMail"
                :autosize="{minRows: 8}"
            ></el-input>
        </div>
        <div style="margin-top: 10px">
            <el-button type="primary" @click="sendMail">发送</el-button>
        </div>
        <el-divider></el-divider>
        <h3>消息记录</h3>
        <a href="javascript:;" @click="reload">[刷新]</a>
        <div>
            <div class="mail-tips" v-if="mailList.length == 0">
                没有消息
            </div>
            <ul class="mail-history-list">
                <li v-for="mail in mailList" :key="mail.mid">
                    <div class="mail-card">
                        <div class="mail-header">
                            <span>From: {{mail.user_name}}<RoleBadge :roleid="mail.roleid"></RoleBadge></span>
                            <span class="mail-time">{{mail.formatedDate}}</span>
                            <span class="mail-read-marker" v-if="mail.is_read == 0">[未读]</span>
                        </div>
                        <div class="mail-content" v-html="mail.renderedHtml"></div>
                    </div>
                </li>
            </ul>
            <div class="mail-tips load-next-button" v-if="!noMore && mailList.length > 0" @click="loadMail">点击继续加载</div>
            <div class="mail-tips" v-if="isLoading">加载中...</div>
            <div class="mail-tips" v-if="noMore && mailList.length > 0">没有更多消息了</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import RoleBadge from '@/components/RoleBadge.vue'
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import { formatTimestamp } from '@/utils/formatDate';
import marked from "marked";

@Component({
    components: {
        RoleBadge
    }
})
export default class MessageBox extends Vue{
    newMail: string = "";
    nowPage: number = 0;
    totalCount: number = 0;
    isLoading: boolean = false;
    noMore: boolean = false;
    mailList: MailItem[] = [];
    mounted(){
        this.reload();
    }
    reload(){
        this.nowPage = 0;
        this.totalCount = 0;
        this.isLoading = false;
        this.noMore = false;
        this.mailList = [];
        this.loadMail();
    }
    async sendMail(){
        let api = this.$gConst.apiRoot + "/send-mail";
        let res = await fetchPostWithSign(api, {
            content: this.newMail
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.$message({
                type: "success",
                message: "成功发送"
            });
            this.reload();
        }else{
            defaultApiErrorAction(this, data);
        }
    }
    async loadMail(){
        this.isLoading = true;
        this.nowPage += 1;
        let api = this.$gConst.apiRoot + "/get-mail";
        let res = await fetchPostWithSign(api, {
            page: this.nowPage
        });
        let data = await res.json();

        if(data['status'] == 1){
            this.totalCount = data.total_count;
            if(data.messages){
                for(let mail of data.messages){
                    this.mailList.push(new MailItem(mail));
                }
            }

            if(this.mailList.length >= this.totalCount){
                this.noMore = true;
            }
        }else{
            defaultApiErrorAction(this, data);
        }
        this.isLoading = false;
    }
    get stoploading(){
        return this.isLoading || this.noMore;
    }
}

class MailItem{
    mid: number = 0;
    create_time: number = 0;
    gid: number = 0;
    uid: number = 0;
    content: string = "";
    is_read: number = 0;
    direction: number = 0;
    user_name: string = "";
    roleid: number = 0;

    constructor(obj?: any){
        if(obj) Object.assign(this, obj);
    }
    get formatedDate(){
        return formatTimestamp(this.create_time);
    }
    get renderedHtml(){
        return marked(this.content);
    }
}
</script>

<style lang="scss" scoped>
.mail-history-list{
    overflow: auto;
    padding-left: 0;
    li {
        list-style: none;
    }
}
.mail-card{
    margin-top: 50px;
    background-color: #4b4b4b;
    border-radius: 20px;
    .mail-header{
        border-bottom: 1px solid #999999;
        padding: 10px;
        font-size: 18px;
        .mail-time{
            float: right;
            font-size: 15px;
            line-height: 18px;
            color: #999999;
        }
        .mail-read-marker{
            float: right;
            font-size: 15px;
            line-height: 18px;
            color: #f15252;
        }
    }
    .mail-content{
        padding: 10px;
    }
}
.mail-tips{
    text-align: center;
    padding: 5px;
    background-color: #4b4b4b;
    border-radius: 10px;
}
.load-next-button{
    transition: all .2s linear;
    cursor: pointer;
}
.load-next-button:hover{
    background-color: #3a3a3a;
}
</style>