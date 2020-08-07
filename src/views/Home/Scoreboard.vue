<template>
  <div class="home">
    <TopNavbar activeIndex="/scoreboard"></TopNavbar>
    <el-row>
      <el-col :sm="24" :md="{span: 12, offset: 6}">
        <h1>排行榜</h1>
        <p>注：排行榜中得分仅供参考，排名规则不是按照得分排序的，详情请参考<router-link to="/about">关于CCBC X</router-link>中的说明。</p>

        <div v-if="finishGroups.length > 0">
            <h3>完赛队伍</h3>
            <p>恭喜以下这些队伍完成了CCBC X的全部赛程。请注意：由于罚时的存在，排名可能还会变化。</p>
            <el-table :data="finishGroups">
                <el-table-column type="index" label="排名"></el-table-column>
                <el-table-column label="队伍">
                    <template slot-scope="u">
                        <div class="group-title">{{u.row.group_name}}</div>
                        <div class="group-profile">{{u.row.group_profile}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="得分" :formatter="toFixed2" width="100px"></el-table-column>
                <el-table-column prop="finished_puzzle_count" label="解答题目数" width="100px"></el-table-column>
                <el-table-column prop="total_time" label="总用时(小时)" :formatter="toFixed2" width="110px"></el-table-column>
            </el-table>
        </div>
        <div>
            <h3>队伍列表</h3>
            <el-table :data="groups">
                <el-table-column label="队伍">
                    <template slot-scope="u">
                        <div class="group-title">{{u.row.group_name}}</div>
                        <div class="group-profile">{{u.row.group_profile}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="得分" :formatter="toFixed2" width="100px"></el-table-column>
                <el-table-column prop="finished_puzzle_count" label="解答题目数" width="100px"></el-table-column>
            </el-table>
        </div>
        <div>
            <p>得分说明</p>
            <ul>
                <li>成功解出题目会获得得分，请注意得分并非最终排名依据，仅供显示实时排行榜。</li>
                <li>更快解答出题目会获得更高得分，此外，Meta题目的得分比普通题目更多。</li>
                <li>如果你的队伍已经完赛，你仍然可以继续解题并获得得分，但是新增的分数会减半。</li>
            </ul>
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
export default class ScoreBoardView extends Vue {
    finishGroups: ScoreBoardItem[] = [];
    groups: ScoreBoardItem[] = [];
    async mounted() {
        let api = this.$gConst.apiRoot + "/get-scoreboard-info";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if (data["status"] == 1) {
            if (data["finished_groups"]) {
                let newFGList: ScoreBoardItem[] = [];

                for (let item of data["finished_groups"]) {
                    newFGList.push(new ScoreBoardItem(item));
                }
                this.finishGroups = newFGList;
            }
            if (data["groups"]) {
                let newGList: ScoreBoardItem[] = [];

                for (let item of data["groups"]) {
                    newGList.push(new ScoreBoardItem(item));
                }
                this.groups = newGList;
            }
        } else {
            defaultApiErrorAction(this, data);
            this.$router.push("/");
        }
    }
    toFixed2(_a: any, _b: any, value: number, _d: any){
        return value.toFixed(2);
    }
}

class ScoreBoardItem {
  gid: number = 0;
  group_name: number = 0;
  group_profile: string = "";
  total_time: number = 0;
  score: number = 0;
  finished_puzzle_count: number = 0;
  is_finish: number = 0;

  constructor(obj?: any) {
    if (obj) Object.assign(this, obj);
  }
}
</script>

<style lang="scss" scoped>
.group-title{
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.group-profile{
    color: #999999;
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>