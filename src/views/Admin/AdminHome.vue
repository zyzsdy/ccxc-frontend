<template>
  <div class="admin-home">
    <el-container>
      <el-aside width="200px">
        <AdminSidebar activeIndex="/userbackend"></AdminSidebar>
      </el-aside>
      <el-main>
        Main
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AdminSidebar from "@/components/AdminSidebar.vue";
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost'

@Component({
  components: {
    AdminSidebar
  }
})
export default class AdminHomeView extends Vue {}
</script>