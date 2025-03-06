<template>
  <div class="index">
    <!-- 头部 -->
    <HomeHeader></HomeHeader>
    <!-- 图标展示 -->
    <HomeMain></HomeMain>
    <!-- 底部 -->
    <HomeFooter></HomeFooter>
    <!-- 信息弹窗 -->
    <DialogInfo v-if="globalVars.dialogInfo" />
    <!-- 文件夹弹窗 -->
    <DialogFolder v-if="globalVars.dialogFolder" />
    <!-- 图标弹窗 -->
    <DialogIcon v-if="globalVars.dialogIcon" />
    <!-- 版本弹窗 -->
    <DialogVersion v-if="globalVars.dialogVersion" />
    <!-- 咖啡弹窗 -->
    <DialogCoffee v-if="globalVars.dialogCoffee" />
    <!-- 公众号弹窗 -->
    <DialogWechat v-if="globalVars.dialogWechat" />
    <!-- 个性化弹窗 -->
    <DialogConfig v-if="globalVars.dialogConfig" />
    <!-- 链接弹窗 -->
    <DialogLink v-if="globalVars.dialogLink" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import HomeHeader from "./home/HomeHeader.vue";
import HomeMain from "./home/HomeMain.vue";
import HomeFooter from "./home/HomeFooter.vue";
import DialogInfo from "./dialog/DialogInfo.vue";
import DialogFolder from "./dialog/DialogFolder.vue";
import DialogIcon from "./dialog/DialogIcon.vue";
import DialogVersion from "./dialog/DialogVersion.vue";
import DialogCoffee from "./dialog/DialogCoffee.vue";
import DialogWechat from "./dialog/DialogWechat.vue";
import DialogConfig from "./dialog/DialogConfig.vue";
import DialogLink from "./dialog/DialogLink.vue";

export default defineComponent({
  components: {
    //页面
    HomeHeader,
    HomeMain,
    HomeFooter,
    DialogInfo,
    DialogFolder,
    DialogIcon,
    DialogVersion,
    DialogCoffee,
    DialogWechat,
    DialogConfig,
    DialogLink,
  },
  setup() {
    const globalVars = inject("globalVars") as any;
    return { globalVars };
  },
});
</script>
<style lang="scss">
.index {
  height: 100%;
}
.index .el-dialog {
  border-radius: 10px;
  cursor: default;
}
</style>
