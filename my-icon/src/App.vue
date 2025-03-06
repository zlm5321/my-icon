<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide, reactive, onBeforeMount } from "vue";
import api from "./utils/api";

export default defineComponent({
  setup() {
    //全局变量
    const globalVars = reactive({
      // 参数
      dialogWidth: "50%",
      edit: false,
      // 数据
      folderData: [],
      iconData: [],
      filterData: [],
      // 搜索
      selectLabel: "全部",
      selectValue: "",
      searchValue: "",
      // 文件夹弹窗
      dialogFolder: false,
      dialogFolderData: {
        index: 0,
        name: "",
      },
      // 详情弹窗
      dialogInfo: false,
      // 图标弹窗
      dialogIcon: false,
      dialogIconData: {
        type: "add",
        name: "",
        path: "",
        sort: "",
      },
      // 版本弹窗
      dialogVersion: false,
      // 公众号弹窗
      dialogWechat: false,
      // 咖啡弹窗
      dialogCoffee: false,
      // 链接弹窗
      dialogLink: false,
      // 个性化弹窗
      dialogConfig: false,
      configData: {},
    }) as any;
    provide("globalVars", globalVars);

    //加载数据
    onBeforeMount(async () => {
      //设置通信地址
      await api.setUrl();
      //复制文件夹
      await api.copyFolder();
      // 读取配置文件
      globalVars.configData = await api.readFile("/configData/config.json");
      //读取文件夹
      globalVars.folderData = await api.readFolder();
      //读取文件夹图片
      globalVars.iconData = await api.readImage(globalVars.folderData);
      //设置显示数据
      globalVars.filterData = await handleFilter(globalVars.iconData);
      //控制弹窗宽度
      dialogWidth();
    });

    //控制弹窗宽度
    function dialogWidth() {
      let clientWidth = document.body.clientWidth;
      if (clientWidth > 960) {
        //PC
        globalVars.dialogWidth = "40%";
      } else if (clientWidth > 600) {
        //平板
        globalVars.dialogWidth = "75%";
      } else {
        //手机
        globalVars.dialogWidth = "80%";
      }
    }

    // 监听窗口大小
    window.addEventListener("resize", () => {
      dialogWidth();
    });

    //筛选数据
    function handleFilter(arr) {
      return new Promise((resolve, reject) => {
        //筛选 cover
        arr.filter((item) => item.name !== "Cover");
        //排序
        arr.sort((a, b) => a.name - b.name);
        resolve(arr);
      });
    }
  },
});
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  // 隐藏滑块
  // scrollbar-width: none; /* Firefox */
  // -ms-overflow-style: none; /* IE10+ */
  // &::-webkit-scrollbar {
  //   display: none; /* ChromeSafari */
  // }
}
</style>
