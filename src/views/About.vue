<template>
  <div class="home">
    <TopNavbar activeIndex="/about"></TopNavbar>
    <el-row>
      <el-col :sm="24" :md="{span: 12, offset: 6}">
        <h1>CCBC 11 比赛简介</h1>
        <p>CCBC为古典密码为主的解谜（Puzzle）类比赛。</p>
        <p>参赛方式为组队参赛。每队最少1人，最多5人。共同完成题目。</p>
        <p>本赛采用FinalMeta完赛制。即在所有题目中，存在一道极其特殊的“FinalMeta”，是综合所有题目的结果才能解出的“题中之题”。
          正确解答出FinalMeta后即视为完赛。
        </p>
        <p>以完赛时间作为排名依据，时间越短排名越高。若时间相同，则按解出的题目数量排名。</p>
        <p>开赛时间：2021年8月6日 20:00</p>
        <hr>
        <p>注意事项：</p>
        <ul>
          <li>比赛过程中严禁不同组队选手之间交流答案；</li>
          <li>严禁在公开场合透露题目答案和提示；</li>
          <li>严禁同一选手同时在多个队伍中报名；</li>
        </ul>
        <p>以上情况一经发现将立即取消比赛成绩并禁赛。</p>
        <p>报名方式：</p>
        <p>注册本站后您将成为本站的未报名用户。请注意未报名用户无法参与比赛。您需要创建队伍或者加入其他人创建的队伍。
          当您的“个人中心”中，用户名旁的标签为“队长”或是“队员”时，即为报名成功。
          在报名截止日期前，您可以自由编辑您的组队信息、增删队员或是退出组队。但是您不能放弃您注册的账号并注册新账号，
          这将被视为同时在多个队伍中报名而取消您的成绩。
        </p>
        <p>报名截止时间：2021年8月6日 19:00（比赛正式开始前一小时停止报名）</p>
        <p>CCBC 11出题组保留对未尽事宜的最终解释权。如有疑问请联系Email: info@cipherpuzzles.com</p>
        <p>请关注本网站公告或微信公众号【密码菌】（使用微信扫描下方二维码）随时获得最新消息。</p>
        <el-image :src="imgUrl" style="height:250px; width:250px;"></el-image>
      </el-col>
    </el-row>
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
export default class AboutView extends Vue {
  imgUrl = require('@/assets/qrcode_mimajun.png')
}
</script>