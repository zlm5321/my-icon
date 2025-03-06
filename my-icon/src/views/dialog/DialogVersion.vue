<template>
  <el-dialog v-model="globalVars.dialogVersion" :width="globalVars.dialogWidth">
    <div class="dialogVersion_content">
      <el-image
        class="dialogVersion_logo"
        :src="require('../../assets/version.png')"
        fit="cover"
      />
      <div class="dialogVersion_main">
        <div class="dialogVersion_title">更新日志</div>
        <el-scrollbar height="400px">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in data.activities"
              :key="index"
              :timestamp="item.timestamp"
            >
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
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
      activities: [] as any,
    });

    onBeforeMount(async () => {
      data.activities = await api.readFile("/configData/version.json");
    });

    return {
      globalVars,
      data,
    };
  },
});
</script>

<style lang="scss">
.dialogVersion_content {
  display: flex;
  margin-top: -16px;
}
.dialogVersion_logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
.dialogVersion_main {
  width: calc(100% - 70px);
}
.dialogVersion_title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
}
</style>
