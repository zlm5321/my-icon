<template>
  <el-dialog v-model="globalVars.dialogIcon" :width="globalVars.dialogWidth">
    <div class="dialogIcon_content">
      <div class="dialogIcon_main">
        <!-- 上传图片 -->
        <div class="dialogIcon_upload">
          <el-upload
            :on-change="handleCover"
            :auto-upload="false"
            :show-file-list="false"
          >
            <div class="dialogIcon_img">
              <!-- 上传图片 -->
              <el-image
                v-if="data.fileUrl"
                class="dialogIcon_img2"
                fit="cover"
                :src="data.fileUrl"
              >
              </el-image>
              <!-- 添加图标 -->
              <el-icon
                v-if="globalVars.dialogIconData.type == 'add' && !data.fileUrl"
                class="dialogFolder_img2"
              >
                <Plus />
              </el-icon>
              <!-- 编辑图标 -->
              <el-image
                v-if="globalVars.dialogIconData.type == 'edit' && !data.fileUrl"
                class="dialogIcon_img2"
                fit="cover"
                :src="globalVars.dialogIconData.path"
              >
              </el-image>
            </div>
          </el-upload>
        </div>

        <!-- 相关信息 -->
        <div class="dialogIcon_name">
          <div class="dialogIcon_title2">图标名称：</div>
          <el-input
            v-model="globalVars.dialogIconData.name"
            placeholder="填写文件夹名称"
            size="large"
          ></el-input>
        </div>
        <div class="dialogIcon_sort">
          <div class="dialogIcon_title2">图标分类：</div>
          <el-select
            v-model="globalVars.dialogIconData.sort"
            placeholder="选择"
            size="large"
          >
            <el-option
              v-for="(item, index) in globalVars.folderData"
              :key="item.index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" size="large" round @click="handleCheck()">
          确认修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, inject, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import api from "../../utils/api";

export default defineComponent({
  components: {
    //图标
    Plus,
  },
  setup() {
    const globalVars = inject("globalVars") as any;
    const data = reactive({
      file: "",
      fileType: "",
      fileUrl: "",
    });

    //检测规范
    function handleCheck() {
      if (!(globalVars.dialogIconData.path || data.fileUrl)) {
        ElMessage({
          message: "请上传图片",
          type: "error",
        });
        return;
      } else if (!globalVars.dialogIconData.name) {
        ElMessage({
          message: "请填写名称",
          type: "error",
        });
        return;
      } else if (!globalVars.dialogIconData.sort) {
        ElMessage({
          message: "请选择分类",
          type: "error",
        });
        return;
      }
      //图标操作
      handleIcon();
    }

    //图标操作
    function handleIcon() {
      globalVars.dialogIcon = false;
      let type = globalVars.dialogIconData.type;
      //编辑图标
      if (type == "edit") {
        let oldPath = globalVars.dialogIconData.path;
        let oldParts = oldPath.split("/");
        let oldSort = oldParts[3].split("_")[1];
        let newSort = globalVars.dialogIconData.sort;
        let oldName = oldPath.slice(oldPath.lastIndexOf("/") + 1);
        if (!data.fileType) {
          data.fileType = oldName.slice(oldName.lastIndexOf("."));
        }
        let newName = globalVars.dialogIconData.name + data.fileType;
        //修改分类 && 修改名称
        if (oldSort != newSort || oldName != newName) {
          let index = globalVars.folderData.findIndex(
            (item) => item.name == newSort
          );
          let newFolderPath = globalVars.folderData[index].path;
          let newPath = newFolderPath + "/" + newName;
          api.renameFolder(oldPath, newPath).then(async function (res) {
            if (res.code == 200) {
              //上传图标
              let file = data.file;
              if (file) {
                handleUpload(file, newFolderPath, newName, type);
              } else {
                //刷新数据
                await handleUpdate();
                ElMessage({
                  message: "修改成功",
                  type: "success",
                });
              }
            } else {
              ElMessage({
                message: res.msg,
                type: "error",
              });
            }
          });
        }
      }
      //添加图标
      if (type == "add") {
        let file = data.file;
        let newSort = globalVars.dialogIconData.sort;
        let index = globalVars.folderData.findIndex(
          (item) => item.name == newSort
        );
        let newFolderPath = globalVars.folderData[index].path;
        let newName = globalVars.dialogIconData.name + data.fileType;
        handleUpload(file, newFolderPath, newName, type);
      }
    }

    //设置上传封面数据
    async function handleCover(file) {
      let base64 = await api.base64(file);
      if (base64) {
        let name = file.name.slice(0, file.name.lastIndexOf("."));
        globalVars.dialogIconData.name = name;
        data.file = base64;
        data.fileType = file.name.slice(file.name.lastIndexOf("."));
        data.fileUrl = URL.createObjectURL(file.raw);
      }
    }

    //上传图片
    async function handleUpload(base64, path, name, type) {
      // 上传图片
      await api.uploadImage(name, path, base64).then(async function (res) {
        if (res.code == 200) {
          //刷新数据
          await handleUpdate();
          if (type == "add") {
            ElMessage({
              message: "创建成功",
              type: "success",
            });
          } else if (type == "edit") {
            ElMessage({
              message: "修改成功",
              type: "success",
            });
          }
        } else {
          ElMessage({
            message: res.msg,
            type: "error",
          });
        }
      });
    }

    //刷新数据
    function handleUpdate() {
      return new Promise(async (resolve, reject) => {
        //刷新文件夹
        globalVars.folderData = await api.readFolder();
        //读取文件夹图片
        globalVars.iconData = await api.readImage(globalVars.folderData);
        //筛选分类数据
        handleSelect(globalVars.selectValue);
        resolve(1);
      });
    }

    //选择分类
    function handleSelect(index) {
      if (typeof index == "number") {
        globalVars.selectLabel = globalVars.folderData[index].name;
        globalVars.filterData = globalVars.iconData.filter(
          (item) => item.sort == globalVars.selectLabel
        );
      } else {
        globalVars.selectLabel = "全部";
        globalVars.filterData = globalVars.iconData;
      }
    }

    return {
      data,
      globalVars,
      handleCover,
      handleCheck,
    };
  },
});
</script>

<style lang="scss">
.dialogIcon_content {
  display: flex;
  margin-top: -16px;
  padding-bottom: 10px;
}

.dialogIcon_main {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.dialogIcon_title2 {
  margin-right: 10px;
}

.dialogIcon_upload {
  display: flex;
  margin-bottom: 15px;
}

.dialogIcon_img {
  width: 100px;
  height: 100px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f7fc;
}

.dialogIcon_img2 {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.dialogIcon_name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
}
.dialogIcon_name .el-input,
.dialogIcon_sort .el-select {
  width: 40%;
}

.dialogIcon_sort {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
}
</style>
