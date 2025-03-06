<template>
  <el-dialog
    v-model="globalVars.dialogConfig"
    :width="globalVars.dialogWidth"
    :show-close="false"
  >
    <div class="dialogConfig_content">
      <div class="dialogConfig_main">
        <el-tabs type="border-card" v-model="data.tabsIndex">
          <el-tab-pane label="壁纸" name="0">
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">背景类型：</div>
              <el-select
                v-model="globalVars.configData.bgType"
                placeholder="Select"
              >
                <el-option
                  v-for="item in data.bgType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">本地图片：</div>
              <el-upload
                :on-change="handleBgImg"
                :auto-upload="false"
                :show-file-list="false"
              >
                <el-image
                  v-if="!data.fileUrl"
                  class="dialogConfig_img"
                  fit="cover"
                  :src="globalVars.configData.bgImgPath"
                >
                </el-image>
                <el-image
                  v-else
                  class="dialogConfig_img"
                  fit="cover"
                  :src="data.fileUrl"
                >
                </el-image>
              </el-upload>
            </div>
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">网络图片：</div>
              <el-input
                v-model="globalVars.configData.bgImgUrl"
                placeholder="输入本地路径或者网络链接"
              />
            </div>
            <div class="dialogConfig_item2">
              <div style="width: 48%">
                <div class="dialogConfig_item1_title">背景模糊值：</div>
                <el-slider
                  v-model="globalVars.configData.bgBlur"
                  :min="0"
                  :max="1"
                  :step="0.1"
                />
              </div>
              <div style="width: 48%">
                <div class="dialogConfig_item1_title">遮罩透明度：</div>
                <el-slider
                  v-model="globalVars.configData.bgOpacity"
                  :min="0"
                  :max="1"
                  :step="0.1"
                />
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="图标" name="1">
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">图标大小：</div>
              <el-slider
                v-model="globalVars.configData.bgBlur"
                :min="0"
                :max="50"
              />
            </div>
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">图标底色：</div>
              <el-slider
                v-model="globalVars.configData.bgBlur"
                :min="0"
                :max="50"
              />
            </div>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="全局" name="2">
           <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">背景颜色：</div>
              <el-checkbox size="large">
                <el-color-picker
                  v-model="globalVars.configData.colorArr[0][0]"
                  show-alpha
                />
              </el-checkbox>
              <el-checkbox size="large">
                <el-color-picker
                  v-model="globalVars.configData.colorArr[0][1]"
                  show-alpha
                />
              </el-checkbox>
              <el-checkbox size="large">
                <el-color-picker
                  v-model="globalVars.configData.colorArr[0][2]"
                  show-alpha
                />
              </el-checkbox>
              <el-checkbox size="large">
                <el-color-picker
                  v-model="globalVars.configData.colorArr[0][3]"
                  show-alpha
                />
              </el-checkbox>
              <el-checkbox size="large">
                <el-color-picker
                  v-model="globalVars.configData.colorArr[0][4]"
                  show-alpha
                />
              </el-checkbox>
            </div> 
          </el-tab-pane>-->
          <el-tab-pane label="文本" name="3">
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">网站名称：</div>
              <el-input
                v-model="globalVars.configData.webTitle"
                placeholder="输入网站名称"
              />
            </div>
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">网站描述 1：</div>
              <el-input
                v-model="globalVars.configData.webDesc1"
                placeholder="输入网站描述 1"
              />
            </div>
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">网站描述 2：</div>
              <el-input
                v-model="globalVars.configData.webDesc2"
                placeholder="输入网站描述 2"
              />
            </div>
            <div class="dialogConfig_item1">
              <div class="dialogConfig_item1_title">网站创建人：</div>
              <el-input
                v-model="globalVars.configData.creator"
                placeholder="输入网站创建人"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="下载图标" name="4" v-if="0"> </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" round @click="handleCancel"> 取消 </el-button>
        <el-button type="primary" size="large" round @click="handleSubmit">
          确认修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, inject } from "vue";
import { ElMessage } from "element-plus";
import api from "../../utils/api";

export default defineComponent({
  setup() {
    const globalVars = inject("globalVars") as any;
    const data = reactive({
      configData: {},
      tabsIndex: "0",
      bgType: [
        {
          value: "iframe",
          label: "默认动图",
        },
        {
          value: "localImg",
          label: "本地图片",
        },
        {
          value: "networkImg",
          label: "网络图片",
        },
        {
          value: "color",
          label: "背景颜色",
        },
      ],
      file: "",
      fileUrl: "",
    });

    //复制数据
    onBeforeMount(() => {
      data.configData = JSON.parse(JSON.stringify(globalVars.configData));
    });

    //上传背景图片
    async function handleBgImg(file) {
      let base64 = await api.base64(file);
      if (base64) {
        data.file = base64;
        data.fileUrl = URL.createObjectURL(file.raw);
      }
    }

    //关闭弹窗
    function handleCancel() {
      globalVars.configData = data.configData;
      globalVars.dialogConfig = false;
    }

    //提交
    async function handleSubmit() {
      globalVars.dialogConfig = false;
      //写入配置
      api.writeFile(
        "/configData/config.json",
        JSON.stringify(globalVars.configData)
      );
      //上传图片
      if (data.file) {
        let name = "background-image.jpg";
        let path = "/configData";
        let base64 = data.file;
        await api.uploadImage(name, path, base64).then(async function (res) {
          if (res.code == 200) {
            ElMessage({
              message: "修改成功",
              type: "success",
            });
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
          }
        });
      } else {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
      }
    }

    return {
      data,
      globalVars,
      handleBgImg,
      handleCancel,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss">
.dialogConfig_content {
  display: flex;
  flex-direction: column;
  margin-top: -16px;
  padding-bottom: 10px;
}

.dialogConfig_main {
  display: flex;
  width: 100%;
  background-color: aquamarine;
}

.el-tabs {
  width: 100%;
}

.dialogConfig_item1 {
  margin-bottom: 15px;
}
.dialogConfig_item1_title {
  margin-bottom: 5px;
}
.dialogConfig_item1 .el-upload {
  width: 100%;
}
.dialogConfig_img {
  height: 150px;
  width: 100%;
  border-radius: 8px;
}

.dialogConfig_item2 {
  display: flex;
  margin-bottom: 15px;
  justify-content: space-between;
}
// .el-color-picker {
//   margin-right: 5px;
// }
</style>
