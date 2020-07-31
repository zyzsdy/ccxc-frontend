<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/group"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>组队信息</h1>
        <el-row>
            <el-col :span="12">
              <el-radio-group v-model="queryOrder" @change="loadGroup">
                <el-radio :label="0">默认排序（GID）</el-radio>
                <el-radio :label="1">得分倒序</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="12">
              <el-button type="info" icon="el-icon-search" @click="loadGroup">查询</el-button>
            </el-col>
        </el-row>
        <el-table :data="groupList">
          <el-table-column label="GID" prop="gid" width="100px"></el-table-column>
          <el-table-column label="队名">
              <template slot-scope="u">
                <el-tooltip effect="dark" placement="bottom">
                    <div slot="content">
                      创建时间: {{u.row.formatedCreateTime}}
                    </div>
                    <div>
                      <div>{{u.row.groupname}}</div>
                      <div class="group-profile">{{u.row.profile}}</div>
                    </div>
                </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column label="开放分区" prop="opened_puzzle_groups"></el-table-column>
          <el-table-column label="完成题目数量" prop="finished_puzzle_count"></el-table-column>
          <el-table-column label="得分" prop="score" :formatter="digits2"></el-table-column>
          <el-table-column label="是否完赛">
            <template slot-scope="u">
              <el-tooltip effect="dark" placement="bottom" v-if="u.row.is_finish == 1">
                <div slot="content">
                  完赛时间：{{u.row.formatedFinishTime}}
                </div>
                <span style="color: #a6e041;">已完赛</span>
              </el-tooltip>
              <span v-else style="color: #999999;">未完赛</span>
            </template>
          </el-table-column>
          <el-table-column label="罚时" prop="penalty" :formatter="digits2"></el-table-column> 
          <el-table-column label="总用时" prop="total_time" :formatter="digits2"></el-table-column> 
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import { formatTimestamp } from '@/utils/formatDate';

@Component({
  components: {
    AdminSidebar
  }
})
export default class GroupAdminView extends Vue {
  queryOrder = 1;
  groupList: GroupOverview[] = [];
  mounted(){
    this.loadGroup();
  }
  async loadGroup(){
    let api = this.$gConst.apiRoot + "/admin/get-group-overview";
    let res = await fetchPostWithSign(api, {
      order: this.queryOrder
    });
    let data = await res.json();

    if (data["status"] == 1) {
        if (data.groups) {
            let groupTempList: GroupOverview[] = [];

            for(let g of data.groups){
                groupTempList.push(new GroupOverview(g));
            }
            this.groupList = groupTempList;
        }
    } else {
        defaultApiErrorAction(this, data);
        this.$router.push("/");
    }
  }
  digits2(_1: any, _2: any, value: number, _4: any){
    return value.toFixed(2);
  }
}

class GroupOverview{
  gid: number = 0;
  groupname: string = "";
  create_time: number = 0;
  profile: string = "";
  finished_puzzle_count: number = 0;
  opened_puzzle_groups: string = "";
  score: number = 0;
  is_finish: number = 0;
  finish_time: number = 0;
  penalty: number = 0;
  total_time: number = 0;

  constructor(obj?: any){
    if(obj) Object.assign(this, obj);
  }
  get formatedCreateTime(){
    return formatTimestamp(this.create_time);
  }
  get formatedFinishTime(){
    return formatTimestamp(this.finish_time);
  }
}
</script>

<style lang="scss" scoped>
.group-profile{
    color: #999999;
}
</style>