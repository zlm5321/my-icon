<template>
  <el-dialog v-model="globalVars.dialogLink" :width="globalVars.dialogWidth">
    <div class="dialogLink_content">
      <el-image
        class="dialogLink_logo"
        :src="require('../../assets/link.png')"
        fit="cover"
      />
      <div class="dialogLink_main">
        <div class="dialogLink_title">友情链接</div>
        <el-scrollbar height="400px">
          <div class="dialogLink_list" v-for="(item, index) in data.list">
            <el-image class="dialogLink_logo2" :src="item.icon" fit="cover" />
            <div>
              <div>{{ item.name }}</div>
              <div class="dialogLink_link" @click="openUrl(item.link)">
                {{ item.link }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, onBeforeMount } from "vue";
import api from "../../utils/api";

export default defineComponent({
  setup() {
    const globalVars = inject("globalVars") as any;
    const data = reactive({
      list: [] as any,
    });

    onBeforeMount(async () => {
      data.list = await api.readFile("/configData/link.json");
    });

    //打开url
    function openUrl(url) {
      window.open(url);
    }

    return {
      globalVars,
      data,
      openUrl,
    };
  },
});
</script>

<style lang="scss">
.dialogLink_content {
  display: flex;
  margin-top: -16px;
}
.dialogLink_logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
.dialogLink_main {
  width: calc(100% - 70px);
}
.dialogLink_title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
}
.dialogLink_list {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  height: 35px;
}
.dialogLink_logo2 {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}
.dialogLink_info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.dialogLink_link {
  color: #409eff;
  cursor: pointer;
}
</style>
