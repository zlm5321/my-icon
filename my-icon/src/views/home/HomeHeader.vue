<template>
  <div class="homeheader">
    <!-- 背景 -->
    <iframe
      v-if="globalVars.configData.bgType == 'iframe'"
      class="homeheader_bg"
      src="/crowd/index.html"
    />
    <el-image
      v-if="globalVars.configData.bgType == 'localImg'"
      class="homeheader_bg"
      :src="globalVars.configData.bgImgPath"
      fit="cover"
      :style="{
        opacity: globalVars.configData.bgOpacity,
        filter: 'blur(' + globalVars.configData.bgBlur + 'px)',
      }"
    />
    <el-image
      v-if="globalVars.configData.bgType == 'networkImg'"
      class="homeheader_bg"
      :src="globalVars.configData.bgImgUrl"
      fit="cover"
      :style="{
        opacity: globalVars.configData.bgOpacity,
        filter: 'blur(' + globalVars.configData.bgBlur + 'px)',
      }"
    />
    <!-- 其他 -->
    <div class="homeheader_header">
      <!-- 左侧标题 -->
      <div class="homeheader_title">{{ globalVars.configData.webTitle }}</div>
      <!-- 右侧设置 -->
      <div class="homeheader_config">
        <!-- 深色模式 -->
        <el-switch
          v-if="0"
          v-model="globalVars.configData.colorMode"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
          active-value="light"
          inactive-value="dark"
        />
        <!-- 编辑模式 -->
        <img
          class="homeheader_img"
          :src="
            globalVars.edit
              ? require('../../assets/edit2.png')
              : require('../../assets/edit.png')
          "
          @click="handleEdit()"
        />
        <!-- 个性化弹窗 -->
        <img
          v-if="1"
          class="homeheader_img"
          :src="require('../../assets/config.png')"
          @click="handleConfig()"
        />
        <!-- 信息弹窗 -->
        <el-image
          class="homeheader_img"
          :src="require('../../assets/info.png')"
          @click="handleInfo()"
        />
      </div>
    </div>
    <div class="homeheader_txt">
      {{ globalVars.configData.webDesc1 }}
    </div>
    <div class="homeheader_txt">{{ globalVars.configData.webDesc2 }}</div>
    <!-- 文件夹 -->
    <el-space wrap class="homeheader_folder">
      <div
        class="item"
        v-for="(item, index) in globalVars.folderData"
        :key="index"
      >
        <el-image
          class="img"
          fit="cover"
          :src="item.path + '/Cover.png' + '?' + Date.now()"
        >
          <template #error>
            <el-image
              class="img_error"
              :src="require('../../assets/default.png')"
            />
          </template>
        </el-image>
        <div class="txt">{{ item.name }}</div>
        <el-icon
          v-if="globalVars.edit"
          class="icon"
          @click.stop="handleDialog('edit', index)"
        >
          <Edit />
        </el-icon>
        <el-divider
          direction="vertical"
          v-if="
            !(globalVars.folderData.length == index + 1 && !globalVars.edit)
          "
        />
      </div>
      <!-- 添加文件夹 -->
      <div
        class="item2"
        v-if="globalVars.edit"
        @click.stop="handleDialog('add', -1)"
      >
        <el-image class="img2" :src="require('../../assets/folder.png')" />
        <div class="txt">添加文件夹</div>
      </div>
    </el-space>
    <!-- 搜索框 -->
    <div class="homeheader_search">
      <el-input
        v-model="globalVars.searchValue"
        @input="handleSearch"
        placeholder="搜索图标"
        class="input"
        size="large"
        @keyup.enter="handleSearch"
      >
        <template #prepend>
          <el-select
            class="select"
            @change="handleSelect"
            v-model="globalVars.selectValue"
            placeholder="全部"
            size="large"
            clearable
          >
            <!-- 选项 -->
            <el-option
              v-for="(item, index) in globalVars.folderData"
              :key="item.index"
              :label="item.name"
              :value="index"
            />
          </el-select>
        </template>
      </el-input>
      <el-button
        class="button"
        :icon="Search"
        @click="handleSearch"
        size="large"
        color="#dcab78"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { Search, Edit, Plus, Moon, Sunny } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  components: {
    Edit,
    Plus,
  },
  setup() {
    const globalVars = inject("globalVars") as any;

    //编辑
    function handleEdit() {
      if (globalVars.edit) {
        ElMessage({
          message: "退出编辑模式",
          type: "success",
        });
      } else {
        ElMessage({
          message: "进入编辑模式",
          type: "warning",
        });
      }
      globalVars.edit = !globalVars.edit;
    }

    //更多信息
    function handleInfo() {
      globalVars.dialogInfo = true;
    }

    //设置弹窗
    function handleConfig() {
      globalVars.dialogConfig = true;
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

    //搜索
    function handleSearch() {
      globalVars.selectLabel = "全部";
      globalVars.selectValue = "";
      let keyword = globalVars.searchValue;
      let iconData = globalVars.iconData;
      let searchData = [] as any;
      for (var i = 0; i < iconData.length; i++) {
        if (
          iconData[i].name.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
        ) {
          searchData.push(iconData[i]);
        }
      }
      globalVars.filterData = searchData;
    }

    //文件夹弹窗
    function handleDialog(type, index) {
      if (type == "edit") {
        globalVars.dialogFolderData.index = index;
        globalVars.dialogFolderData.name = globalVars.folderData[index].name;
        globalVars.dialogFolder = true;
      }
      if (type == "add") {
        globalVars.dialogFolderData.index = index;
        globalVars.dialogFolderData.name = "";
        globalVars.dialogFolder = true;
      }
    }

    return {
      globalVars,
      handleEdit,
      handleInfo,
      handleConfig,
      handleSearch,
      handleSelect,
      handleDialog,
      //图标
      Search,
      Moon,
      Sunny,
    };
  },
});
</script>

<style lang="scss">
.homeheader {
  position: relative;
  user-select: none;
  width: 100%;
  // background-color: rgb(247 248 250);
  //background-color: #f5f7fc;
  // background-color: rgb(6, 15, 51);
  background-color: #181c18;
}
.homeheader_bg {
  position: absolute;
  z-index: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border: 0px;
  margin: 0;
}

.homeheader_header {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  padding-top: 3%;
  margin-left: 3%;
  margin-right: 3%;
  margin-bottom: 20px;
}

/* 文字 */
.homeheader_title {
  font-size: 40px;
  font-weight: bold;
  color: #fff;
}

.homeheader_config {
  display: flex;
  align-items: center;
  position: absolute;
  height: 40px;
  right: 0px;
  .homeheader_img {
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }
  .el-switch {
    --el-switch-on-color: #181c18;
    --el-switch-border-color: #909399;
  }
}

.homeheader_txt {
  position: relative;
  z-index: 1;
  font-size: 16px;
  // color: #5d667a;
  color: #fff;
  font-weight: 400;
  margin-top: 15px;
  margin-left: 3%;
}
/* 文件夹 */
.homeheader_folder {
  position: relative;
  z-index: 1;
  margin-top: 20px;
  margin-left: 3%;
  color: #fff;
  .item {
    display: flex;
    align-items: center;
  }
  .item2 {
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 8px;
    background-color: #ffffffc7;
    color: #303133;
  }
  .img {
    width: 30px;
    height: 30px;
    padding: 5px;
    border-radius: 8px;
    background-color: #ffffffc7;
  }
  .img2 {
    width: 30px;
    height: 30px;
    padding: 5px;
  }
  .img_error {
    width: 30px;
    height: 30px;
  }
  .txt {
    font-size: 16px;
    margin-left: 10px;
    margin-right: 15px;
  }
  .icon {
    cursor: pointer;
    border-radius: 5px;
    background-color: #e6a23c;
    color: #fff;
    padding: 4px;
    margin-right: 15px;
  }

  .el-divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}

/* 搜索框 */
.homeheader_search {
  position: relative;
  z-index: 1;
  display: flex;
  margin-left: 3%;
  padding-top: 4%;
  padding-bottom: 4%;
  .input {
    width: 30%;
    height: 48px;
    min-width: 270px;
    .el-input__wrapper {
      border-radius: 0 50px 50px 0 !important;
    }
    .el-input-group__prepend {
      border-radius: 50px 0 0 50px !important;
    }
    .select {
      width: 110px;
      .el-input__wrapper {
        height: 46px;
        border-radius: 50px 0 0 50px !important;
      }
      .el-select__wrapper {
        box-shadow: none;
      }
    }
  }
  .button {
    height: 48px;
    width: 53px;
    border-radius: 40px;
    margin-left: 10px;
    color: #ffffff;
  }
  .bt_search:hover {
    color: #ffffff;
  }
}
</style>
