<template>
  <el-dialog v-model="globalVars.dialogInfo" :width="globalVars.dialogWidth">
    <div class="dialogInfo_content">
      <div class="dialogInfo_main">
        <div class="dialogInfo_title">关于 My Icon</div>
        <div class="dialogInfo_title2">💻 项目初衷：</div>
        <div>为 Unraid 系统提供好看的图标</div>
        <div class="dialogInfo_title2">📑 关于开发：</div>
        <div>
          采用 Vue3 前端界面 + Express
          应用框架。本项目完全开源，在对其进行二次开发并封装时，必须明确标注原始项目的开源地址，同时开发所产生的代码也应当遵循开源原则。
        </div>
        <div class="dialogInfo_title2">🗃️ 项目地址（heizicao）：</div>
        <div
          class="dialogInfo_url"
          @click="openUrl('https://gitee.com/heizicao/my-icon')"
        >
          https://gitee.com/heizicao/my-icon
        </div>
        <div class="dialogInfo_title2">🔗 图标库（xushier）：</div>
        <div
          class="dialogInfo_url"
          @click="openUrl('https://github.com/xushier/HD-Icons')"
        >
          https://github.com/xushier/HD-Icons
        </div>
        <div class="dialogInfo_title2">🔗 图标库（iconfont）：</div>
        <div
          class="dialogInfo_url"
          @click="openUrl('https://www.iconfont.cn/')"
        >
          https://www.iconfont.cn
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

    //打开url
    function openUrl(url) {
      window.open(url);
    }

    return {
      globalVars,
      openUrl,
    };
  },
});
</script>

<style lang="scss">
.dialogInfo_content {
  display: flex;
  margin-top: -16px;
  padding-bottom: 10px;
}

.dialogInfo_main {
  width: 100%;
}
.dialogInfo_title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.dialogInfo_title2 {
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: bold;
}
.dialogInfo_url {
  color: #409eff;
  cursor: pointer;
}
</style>
