<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend/user"></AdminSidebar>
      </el-aside>
      <el-main>
        <h1>用户管理</h1>
        <el-table :data="userList">
          <el-table-column label="UID" prop="uid" width="50px"></el-table-column>
          <el-table-column label="用户名">
              <template slot-scope="u">
                  <el-tooltip effect="dark" placement="bottom">
                      <div slot="content">Email: {{ u.row.email }}<br>手机: {{ u.row.phone ? u.row.phone : "[未设置]"}}<br>注册时间: {{ u.row.regTime }}</div>
                      <span>{{ u.row.username }}</span>
                  </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column label="用户身份">
            <template slot-scope="u">
              <RoleBadge :roleid="u.row.roleid" class="badge-p"></RoleBadge>
            </template>
          </el-table-column>
          <el-table-column label="测试用户" prop="info_key">
            <template slot-scope="u">
              <span v-if="u.row.is_beta_user == 1"><i class="el-icon-success" style="color: rgb(109, 204, 142)"></i></span>
              <span v-else><i class="el-icon-error" style="color: rgb(255, 113, 113)"></i></span>
              <el-button style="margin-left: 10px" type="success" size="small" @click="setBetaUser(u.row.uid)">设置</el-button>
              <el-button type="danger" size="small" @click="removeBetaUser(u.row.uid)">取消</el-button>
            </template>
          </el-table-column>
          <el-table-column label="在线状态" prop="last_action_time">
            <template slot-scope="u">
              <span v-if="isOnline(u.row.last_action_time)"><i class="el-icon-success" style="color: rgb(109, 204, 142)"></i> 在线</span>
              <span v-else><i class="el-icon-error" style="color: rgb(255, 113, 113)"></i> 离线</span>
              <div v-if="u.row.last_action_time > 0" class="last-action-time">上次活动时间: {{u.row.lastActionTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260px">
            <template slot-scope="u">
              <el-button type="danger" size="small" @click="setBanUser(u.row.uid)">封禁</el-button>
              <el-button size="small" @click="removeBanUser(u.row.uid)">取消封禁</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import RoleBadge from "@/components/RoleBadge.vue";
import { fetchPostWithSign, defaultApiErrorAction } from "@/utils/fetchPost";
import { formatTimestamp } from "@/utils/formatDate";

@Component({
  components: {
    AdminSidebar,
    RoleBadge
  }
})
export default class UserAdminView extends Vue {
  userList: UserInfo[] = [];
  async mounted() {
    let api = this.$gConst.apiRoot + "/admin/get-user";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data["status"] == 1) {
      if (data["users"]) {
        let newUserList: UserInfo[] = [];

        for (let userItem of data["users"]) {
          newUserList.push(new UserInfo(userItem));
        }
        this.userList = newUserList;
      }
    } else {
      defaultApiErrorAction(this, data);
      this.$router.push("/");
    }
  }
  isOnline(time: number){
    var now = new Date().getTime();
    return Math.abs(now - time) <= 300000; //5 min
  }
  async setBetaUser(uid: number){
    let api = this.$gConst.apiRoot + "/admin/set-beta-user";
    let res = await fetchPostWithSign(api, {
        uid
    });
    let data = await res.json();

    if(data['status'] == 1){
        this.$message({
            message: "设置成功",
            type: "success"
        });
        this.$gConst.globalBus.$emit("reload");
    }else{
        defaultApiErrorAction(this, data);
    }
  }
  async removeBetaUser(uid: number){
    let api = this.$gConst.apiRoot + "/admin/remove-beta-user";
    let res = await fetchPostWithSign(api, {
        uid
    });
    let data = await res.json();

    if(data['status'] == 1){
        this.$message({
            message: "取消成功",
            type: "success"
        });
        this.$gConst.globalBus.$emit("reload");
    }else{
        defaultApiErrorAction(this, data);
    }
  }
  async setBanUser(uid: number){
    let api = this.$gConst.apiRoot + "/admin/set-ban-user";
    let res = await fetchPostWithSign(api, {
        uid
    });
    let data = await res.json();

    if(data['status'] == 1){
        this.$message({
            message: "封禁成功",
            type: "success"
        });
        this.$gConst.globalBus.$emit("reload");
    }else{
        defaultApiErrorAction(this, data);
    }
  }
  async removeBanUser(uid: number){
    let api = this.$gConst.apiRoot + "/admin/remove-ban-user";
    let res = await fetchPostWithSign(api, {
        uid
    });
    let data = await res.json();

    if(data['status'] == 1){
        this.$message({
            message: "取消封禁成功",
            type: "success"
        });
        this.$gConst.globalBus.$emit("reload");
    }else{
        defaultApiErrorAction(this, data);
    }
  }
}

class UserInfo {
  uid: number = 0;
  username: string = "";
  email: string = "";
  phone: string = "";
  roleid: number = -1;
  create_time: number = 0;
  update_time: number = 0;
  profile: string = "";
  info_key: string = "";
  last_action_time: number = 0;
  is_beta_user: number = 0;

  constructor(obj?: any) {
    if (obj) Object.assign(this, obj);
  }

  get regTime() {
      return formatTimestamp(this.create_time);
  }
  get lastActionTime() {
      return formatTimestamp(this.last_action_time);
  }
}
</script>

<style lang="scss" scoped>
.badge-p{
  position: absolute;
  top: 18px;
}
.last-action-time{
  font-size: 12px;
  color: #999999;
}
</style>