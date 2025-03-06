<template>
  <el-dialog v-model="globalVars.dialogWechat" :width="globalVars.dialogWidth">
    <div class="dialogWechat_content">
      <el-image
        class="dialogWechat_logo"
        :src="require('../../assets/wechat.png')"
        fit="cover"
      />
      <div class="dialogWechat_main">
        <div class="dialogWechat_title">微信公众号</div>
        <div class="dialogWechat_text">
          Hello 大家好，我是 David ，一名普通的 NAS 用户。2021年，首次接触到 NAS
          ，那时候 NAS
          远不像现在这般多人使用，各类相关教程也很少。从那时起，我便致力于分享各类的保姆教程。
        </div>
        <div class="dialogWechat_text">
          关注微信公众号“NASBox”，分享 NAS 相关资讯和简单入门教程
        </div>
        <div class="dialogWechat_qrcode">
          <el-image :src="require('../../assets/qrcode.jpg')" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  setup() {
    const globalVars = inject("globalVars") as any;

    return {
      globalVars,
    };
  },
});
</script>

<style lang="scss">
.dialogWechat_content {
  display: flex;
  margin-top: -16px;
  padding-bottom: 10px;
}
.dialogWechat_logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
.dialogWechat_main {
  width: calc(100% - 70px);
}
.dialogWechat_title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
}
.dialogWechat_text {
  margin-bottom: 10px;
}
.dialogWechat_qrcode {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-left: -70px;
}
.dialogWechat_qrcode .el-image {
  width: 120px;
  height: 120px;
  margin: 0 20px;
}
</style>
