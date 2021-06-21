<template>
    <div class="nav-footer">
        Powered by CCXC Engine &nbsp;&nbsp;<a href="http://beian.miit.gov.cn" target="_blank">京ICP备2021017804号-1</a>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TopNavbar extends Vue {
}
</script>

<style lang="scss" scoped>
.nav-footer {
    margin-top: 200px;
    padding-top: 5px;
    padding-left: 100px;
    font-size: 10px;
    color: #999999;
    background-color: #2f2f2f;
    min-height: 50px;
}
</style>