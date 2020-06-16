<template>
  <div class="home">
    <TopNavbar activeIndex="/announcement"></TopNavbar>
    <el-row>
      <el-col :sm="24" :md="{span: 12, offset: 6}">
        <h1>公告</h1>
        <div class="anno-card" v-for="anno in annoList" :key="anno.aid">
            <div class="anno-card-time">{{ anno.formatedDate }} 发布</div>
            <div v-html="anno.renderHtml"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TopNavbar from '@/components/TopNavbar.vue'
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'
import { formatTimestamp } from "@/utils/formatDate";
import marked from "marked";

@Component({
  components: {
    TopNavbar
  }
})
export default class AboutView extends Vue {
    annoList: AnnouncementInfo[] = [];
    async mounted() {
        let api = this.$gConst.apiRoot + "/get-announcement";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if (data["status"] == 1) {
            if (data["announcements"]) {
                let newAnnoList: AnnouncementInfo[] = [];

                for (let annoItem of data["announcements"]) {
                    newAnnoList.push(new AnnouncementInfo(annoItem));
                }
                this.annoList = newAnnoList;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
}

class AnnouncementInfo {
  aid: number = 0;
  update_time: number = 0;
  create_time: number = 0;
  content: string = "";

  constructor(obj?: any) {
    if (obj) Object.assign(this, obj);
  }
  get formatedDate() {
    return formatTimestamp(this.create_time);
  }
  get formatedUpdateDate() {
    return formatTimestamp(this.update_time);
  }
  get firstLine() {
    return this.content.split("\n")[0];
  }
  get renderHtml(){
    return marked(this.content);
  }
}
</script>

<style lang="scss" scoped>
.anno-card {
    margin-top: 20px;
    padding: 10px;
    border-radius: 10px;
    min-height: 200px;
    background-color: #555555;
}
.anno-card-time {
    color: #8a8a8a;
    text-align: right;
}
</style>