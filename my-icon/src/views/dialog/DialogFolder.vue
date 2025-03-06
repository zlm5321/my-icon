<template>
  <el-dialog v-model="globalVars.dialogFolder" :width="globalVars.dialogWidth">
    <div class="dialogFolder_content">
      <div class="dialogFolder_main">
        <!-- 上传图片 -->
        <el-upload
          :on-change="handleCover"
          :auto-upload="false"
          :show-file-list="false"
        >
          <div class="dialogFolder_img">
            <!-- 添加文件夹 -->
            <el-image
              v-if="globalVars.dialogFolderData.index == -1"
              class="dialogFolder_img2"
              fit="cover"
              :src="data.fileUrl"
            >
              <template #error>
                <el-icon class="dialogFolder_img2">
                  <Plus />
                </el-icon>
              </template>
            </el-image>
            <!-- 编辑文件夹 -->
            <el-image
              v-if="globalVars.dialogFolderData.index != -1 && !data.fileUrl"
              class="dialogFolder_img2"
              fit="cover"
              :src="
                globalVars.folderData[globalVars.dialogFolderData.index].path +
                '/Cover.png'
              "
            >
              <template #error>
                <el-icon class="dialogFolder_img2">
                  <Plus />
                </el-icon>
              </template>
            </el-image>
            <el-image
              v-if="globalVars.dialogFolderData.index != -1 && data.fileUrl"
              class="dialogFolder_img2"
              fit="cover"
              :src="data.fileUrl"
            >
            </el-image>
          </div>
        </el-upload>
        <!-- 相关信息 -->
        <div class="dialogFolder_name">
          <div>文件夹名称：</div>
          <el-input
            v-model="globalVars.dialogFolderData.name"
            placeholder="填写文件夹名称"
            size="large"
          ></el-input>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="danger"
          @click="handleFolder('delete')"
          :icon="Delete"
          circle
          size="large"
          v-if="globalVars.dialogFolderData.index != -1"
        />
        <el-button
          type="primary"
          @click="handleFolder('edit')"
          size="large"
          round
          v-if="globalVars.dialogFolderData.index != -1"
        >
          确认修改
        </el-button>
        <el-button
          type="primary"
          @click="handleFolder('add')"
          size="large"
          round
          v-if="globalVars.dialogFolderData.index == -1"
        >
          确认添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, inject, reactive } from "vue";
import { Delete, Plus } from "@element-plus/icons-vue";
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
      fileUrl: "",
    });

    //文件夹操作
    async function handleFolder(type) {
      let dialogFolderData = globalVars.dialogFolderData;
      globalVars.dialogFolder = false;
      //编辑文件夹
      if (type == "edit") {
        let oldPath = globalVars.folderData[dialogFolderData.index].path;
        let parts = oldPath.split("_");
        let newPath = parts[0] + "_" + dialogFolderData.name;
        api.renameFolder(oldPath, newPath).then(async function (res) {
          if (res.code == 200) {
            //上传封面图
            let file = data.file;
            if (file) {
              handleUpload(file, newPath, "Cover.png", type);
            } else {
              // 刷新数据
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
      //添加文件夹
      if (type == "add") {
        let index =
          globalVars.folderData[globalVars.folderData.length - 1].index + 1;
        let name = dialogFolderData.name;
        if (name == "") {
          name = "未命名文件夹";
        }
        let folderPath = "/configData/icon/" + index + "_" + name;
        api.createFolder(folderPath).then(async function (res) {
          if (res.code == 200) {
            //上传封面图
            let file = data.file;
            if (!file) {
              file = require("../../assets/folder.png");
            }
            handleUpload(file, folderPath, "Cover.png", type);
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
          }
        });
      }
      //删除文件夹
      if (type == "delete") {
        let path = globalVars.folderData[dialogFolderData.index].path;
        api.deleteFolder(path).then(async function (res) {
          if (res.code == 200) {
            //刷新数据
            await handleUpdate();
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          } else {
            ElMessage({
              message: res.message,
              type: "error",
            });
          }
        });
      }
    }

    //设置上传封面数据
    async function handleCover(file) {
      let base64 = await api.base64(file);
      if (base64) {
        data.file = base64;
        data.fileUrl = URL.createObjectURL(file.raw);
      }
    }

    //上传图片
    async function handleUpload(base64, path, name, type) {
      //判断目录、文件是否存在
      let res = await api.isExist(path + "/" + name);
      if (res.code == 200 && name != "Cover.png") {
        ElMessage({
          message: "文件已存在，请重命名",
          type: "warning",
        });
      } else {
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
      handleFolder,
      //图标
      Delete,
    };
  },
});
</script>

<style lang="scss">
.dialogFolder_content {
  display: flex;
  margin-top: -16px;
  padding-bottom: 10px;
}

.dialogFolder_main {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.dialogFolder_img {
  position: relative;
  width: 100px;
  height: 100px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f7fc;
}

.dialogFolder_img2 {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.dialogFolder_name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
}
.dialogFolder_name .el-input {
  margin-left: 10px;
  width: 40%;
}
</style>
