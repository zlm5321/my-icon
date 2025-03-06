<template>
  <div class="homemain">
    <div class="homemain_head">
      <div class="homemain_title">{{ globalVars.selectLabel }}</div>
      <div class="homemain_sum">{{ globalVars.filterData.length }}</div>
    </div>
    <!-- 图标 -->
    <el-space wrap :size="0">
      <!-- 添加 -->
      <div
        v-if="globalVars.edit"
        class="card"
        :style="{
          width: globalVars.cardWidth + 'px',
          backgroundColor: '#2c2c2c',
        }"
        @click.stop="handleIcon('', 'add')"
      >
        <el-icon color="#fff">
          <Plus />
        </el-icon>
      </div>
      <!-- 循环 -->
      <div v-for="(item, index) in globalVars.filterData" :key="index">
        <div
          class="card"
          :style="{ margin: data.cardMargin + 'px' }"
          @mouseenter="handleMouse(index)"
          @mouseleave="handleMouse(-1)"
        >
          <!-- 图标图片 -->
          <el-image
            class="card_img"
            :class="index == data.activeIndex ? 'card_img_opacity' : ''"
            :src="item.path"
            fit="cover"
            lazy
          >
            <template #placeholder>
              <el-image
                class="card_img"
                :src="require('../../assets/placeholder.png')"
              />
            </template>
            <template #error>
              <el-image
                class="card_img"
                :src="require('../../assets/loss.png')"
              />
            </template>
          </el-image>
          <!-- 悬浮按钮 -->
          <div
            class="card_hover"
            v-if="!globalVars.edit && index == data.activeIndex"
          >
            <text class="card_txt">{{ item.name }}</text>
            <el-button
              class="card_btn"
              type="success"
              plain
              @click="handleCopy(item.path)"
              >复制</el-button
            >
          </div>
          <div
            class="card_hover"
            v-if="globalVars.edit && index == data.activeIndex"
          >
            <el-button
              class="card_btn"
              type="warning"
              plain
              @click.stop="handleIcon(item, 'edit')"
              >编辑</el-button
            >
            <el-button
              class="card_btn"
              type="danger"
              plain
              @click.stop="handleIcon(item, 'delete')"
              >删除</el-button
            >
          </div>
        </div>
      </div>
    </el-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, inject, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import clipboard3 from "vue-clipboard3";
import api from "../../utils/api";

export default defineComponent({
  components: {
    //图标
    Plus,
  },
  setup() {
    const { toClipboard } = clipboard3();
    const globalVars = inject("globalVars") as any;

    const data = reactive({
      //鼠标状态
      activeIndex: -1,
      //卡片间隔
      cardMargin: 10,
    });

    onBeforeMount(() => {
      //动态调整图标宽
      cardMargin();
    });

    //动态调整图标间隔
    function cardMargin() {
      //卡片大小
      let card = 80;
      // margin
      let margin = 10 * 2;
      //屏幕宽度(+15.2滑块宽度)
      let clientWidth = document.body.clientWidth - 15;
      //盒子padding
      let content = clientWidth * 0.06;
      //一排最多个数
      let num = Math.floor((clientWidth - content) / (card + margin));
      //计算 margin
      let width = Math.floor(
        (clientWidth - content - (card + margin) * num) / num / 2 + margin / 2
      );
      data.cardMargin = width;
    }

    // 监听窗口大小
    window.addEventListener("resize", () => {
      cardMargin();
    });

    //图标操作
    function handleIcon(item, type) {
      //添加图标
      if (type == "add") {
        let sort = globalVars.selectLabel;
        if (sort == "全部") {
          sort = "";
        }
        globalVars.dialogIcon = true;
        globalVars.dialogIconData = {
          type: type,
          name: "",
          path: "",
          sort: sort,
        };
      }
      //编辑图标
      if (type == "edit") {
        globalVars.dialogIcon = true;
        globalVars.dialogIconData = {
          type: type,
          name: item.name,
          path: item.path,
          sort: item.sort,
        };
      }
      //删除图标
      if (type == "delete") {
        api.deleteImage(item.path).then(async function (res) {
          if (res.code == 200) {
            //获取索引&删除
            let index = globalVars.filterData.findIndex(
              (item2) => item2.path === item.path
            );
            if (index !== -1) {
              globalVars.filterData.splice(index, 1);
            }
            let index2 = globalVars.iconData.findIndex(
              (item2) => item2.path === item.path
            );
            if (index !== -1) {
              globalVars.iconData.splice(index2, 1);
            }
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
          }
        });
      }
    }

    //复制
    async function handleCopy(icon) {
      //获取图片url
      let currenturl = window.location.href;
      let fullurl = currenturl.substr(0, currenturl.length - 3) + icon;
      await toClipboard(fullurl);
      ElMessage({
        message: "图标链接复制成功~",
        type: "success",
      });
    }

    //鼠标进出卡片触发
    function handleMouse(index) {
      data.activeIndex = index;
    }

    return {
      data,
      globalVars,
      handleIcon,
      handleCopy,
      handleMouse,
    };
  },
});
</script>

<style lang="scss">
.homemain {
  padding: 3%;
  min-height: 300px;
  background-color: rgb(247 248 250);
}
.homemain_head {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.homemain_title {
  font-weight: 600;
  font-size: 18px;
  color: #1a2947;
}
.homemain_sum {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 14px;
  margin-left: 8px;
  color: rgb(177.3, 179.4, 183.6);
  background-color: #f5f7fc;
}
.card {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 80px;
  border-radius: 10px;
  margin: 10px;
  background-color: #fff;
}

.card_img {
  width: 60px;
  height: 60px;
}

.card_img_opacity {
  opacity: 0.4;
}

.card_hover {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // animation: show 5s;
}
// @keyframes show {
//   0% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// }

// @keyframes hid {
//   0% {
//     opacity: 0;
//   }
//   100% {
//     opacity: 1;
//   }
// }

.card_txt {
  margin-top: 2px;
  margin-bottom: -2px;
  width: 65px;
  text-align: center;
  justify-content: center;
  line-height: 34px;
  // color: #afb7c7;
  font-size: 13px;
  background-color: #ffffff;
  border-radius: 4px;
  // 省略号
  overflow: hidden; /* 隐藏超出容器的文本 */
  text-overflow: ellipsis; /* 使用省略号表示超出部分 */
  white-space: nowrap; /* 文本不换行 */
}

.card_btn {
  width: 68px;
  margin-left: 0px !important;
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
