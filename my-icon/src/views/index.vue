<template>
  <div class="index">
    <!-- 头部信息 -->
    <div class="head">
      <div class="head_title">My Icon</div>
      <div class="head_txt">
        提供在线图标链接，用于个人 NAS 设备显示使用，禁止用于商业用途
      </div>
      <div class="head_txt">Vue3 前端界面 + Express 应用框架</div>
      <el-space wrap class="folder">
        <div
          class="folder_item"
          v-for="(item, index) in data.folderData"
          :key="index"
        >
          <el-image
            class="folder_img"
            :src="item.path + '/Cover.png' + '?' + Date.now()"
          >
            <template #error>
              <el-image
                class="folder_img"
                :src="require('../assets/default.png')"
              />
            </template>
          </el-image>
          <div class="folder_txt">{{ item.name }}</div>
          <el-icon
            v-if="data.edit"
            class="folder_icon"
            @click.stop="handleFolderDialog('edit', index)"
          >
            <Edit />
          </el-icon>
          <el-divider
            direction="vertical"
            v-if="!(data.folderData.length == index + 1 && !data.edit)"
          />
        </div>
        <!-- 添加文件夹 -->
        <div class="folder_item" v-if="data.edit">
          <el-image class="folder_img" :src="require('../assets/folder.png')" />
          <div class="folder_txt">添加文件夹</div>
          <el-icon
            class="folder_icon"
            @click.stop="handleFolderDialog('add', -1)"
          >
            <Plus />
          </el-icon>
        </div>
      </el-space>

      <!-- 搜索框 -->
      <div class="searchBox">
        <el-input
          v-model="data.search"
          placeholder="搜索图标"
          class="search"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #prepend>
            <el-select
              class="select"
              @change="handleSelect"
              v-model="data.selectValue"
              placeholder="全部"
              size="large"
              clearable
            >
              <!-- 选项 -->
              <el-option
                v-for="(item, index) in data.folderData"
                :key="item.index"
                :label="item.name"
                :value="index"
              />
            </el-select>
          </template>
        </el-input>
        <el-button
          class="bt_search"
          :icon="Search"
          @click="handleSearch"
          round
          size="large"
          color="#dcab78"
        />
      </div>
    </div>

    <!-- 图标展示 -->
    <div class="content">
      <div class="content_head">
        <div class="content_title">{{ data.selectLabel }}</div>
        <div class="content_sum">{{ data.filterData.length }}</div>
      </div>
      <el-space wrap :size="0">
        <!-- 循环 -->
        <div v-for="(item, index) in data.filterData" :key="index">
          <div
            class="card"
            :style="{ width: data.cardWidth + 'px' }"
            @click="handleCopy(item.icon)"
            v-if="item.name != 'Cover'"
          >
            <el-icon
              class="card_icon"
              :size="14"
              v-if="data.edit"
              @click.stop="handleIcon(item.icon)"
            >
              <Close />
            </el-icon>
            <el-image lazy class="card_img" :src="item.icon">
              <template #error>
                <el-image
                  class="card_img"
                  :src="require('../assets/loss.png')"
                />
              </template>
            </el-image>
            <div class="card_txt">
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 添加 -->
        <el-upload
          v-if="data.edit && data.selectLabel != '全部'"
          :on-change="handleUploadIcon"
          :auto-upload="false"
          :show-file-list="false"
        >
          <div
            class="card"
            :style="{
              width: data.cardWidth + 'px',
              backgroundColor: '#2c2c2c',
            }"
          >
            <el-icon color="#fff">
              <Plus />
            </el-icon>
          </div>
        </el-upload>
      </el-space>
    </div>

    <!-- 底部 -->
    <div class="foot">
      <div class="foot_txt">© By David | 2025.01.08</div>
      <div class="foot_url">
        <el-image
          v-if="data.edit"
          class="foot_img"
          :src="require('../assets/edit2.png')"
          @click="handleEdit()"
        />
        <el-image
          v-else
          class="foot_img"
          :src="require('../assets/edit.png')"
          @click="handleEdit()"
        />
        <el-image
          class="foot_img"
          :src="require('../assets/info.png')"
          @click="handleInfo()"
        />
        <el-popover placement="top" :width="150">
          <template #reference>
            <el-image class="foot_img" :src="require('../assets/wechat.png')" />
          </template>
          <el-image class="qrcode_img" :src="require('../assets/qrcode.jpg')" />
        </el-popover>
        <el-popover placement="top" :width="150">
          <template #reference>
            <el-image class="foot_img" :src="require('../assets/coffee.png')" />
          </template>
          <el-image
            class="qrcode_img"
            :src="require('../assets/qrcode2.jpg')"
          />
        </el-popover>
      </div>
    </div>

    <!-- 信息弹窗 -->
    <el-dialog
      v-model="infoDialog"
      title="关于 My Icon"
      :width="data.dialogWidth"
    >
      <div class="infoDialog_content">
        <div class="infoDialog_title">💻 项目初衷：</div>
        <div>为 Unraid 系统提供好看的图标</div>
        <div class="infoDialog_title">👀 微信公众号：</div>
        <div>关注“NASBox”，分享 NAS 相关资讯和简单入门教程。</div>
        <div class="infoDialog_title">📑 关于开发：</div>
        <div>
          采用 Vue3 前端界面 + Express
          应用框架。本项目完全开源，在对其进行二次开发并封装时，必须明确标注原始项目的开源地址，同时开发所产生的代码也应当遵循开源原则。
        </div>
        <div class="infoDialog_title">🗃️ 项目地址（david）：</div>
        <div
          class="infoDialog_url"
          @click="openUrl('https://gitee.com/heizicao/my-icon')"
        >
          https://gitee.com/heizicao/my-icon
        </div>
        <div class="infoDialog_title">🔗 图标库（xushier）：</div>
        <div
          class="infoDialog_url"
          @click="openUrl('https://github.com/xushier/HD-Icons')"
        >
          https://github.com/xushier/HD-Icons
        </div>
        <div class="infoDialog_title">🔗 图标库（iconfont）：</div>
        <div
          class="infoDialog_url"
          @click="openUrl('https://www.iconfont.cn/')"
        >
          https://www.iconfont.cn
        </div>
      </div>
    </el-dialog>

    <!-- 文件夹弹窗 -->
    <el-dialog
      v-if="folderDialog"
      v-model="folderDialog"
      :title="data.folderTitle"
      :width="data.dialogWidth"
    >
      <div class="folderDialog_content">
        <el-upload
          :on-change="handleCover"
          :auto-upload="false"
          :show-file-list="false"
        >
          <div class="folderDialog_img">
            <!-- 添加文件夹 -->
            <el-image
              v-if="data.folderIndex == -1"
              class="folderDialog_img2"
              fit="cover"
              :src="data.folderTemp"
            >
              <template #error>
                <el-icon class="folderDialog_img2">
                  <Plus />
                </el-icon>
              </template>
            </el-image>
            <!-- 编辑文件夹 -->
            <el-image
              v-if="data.folderIndex != -1 && !data.folderTemp"
              class="folderDialog_img2"
              fit="cover"
              :src="data.folderData[data.folderIndex].path + '/Cover.png'"
            >
              <template #error>
                <el-icon class="folderDialog_img2" v-if="!data.folderTemp">
                  <Plus />
                </el-icon>
                <el-image
                  v-else
                  fit="cover"
                  class="folderDialog_img2"
                  :src="data.folderTemp"
                ></el-image>
              </template>
            </el-image>
            <el-image
              v-if="data.folderIndex != -1 && data.folderTemp"
              class="folderDialog_img2"
              fit="cover"
              :src="data.folderTemp"
            >
            </el-image>
          </div>
        </el-upload>
        <div class="folderDialog_name">
          <div>文件夹名称：</div>
          <el-input
            v-model="data.folderName"
            placeholder="填写文件夹名称"
            size="large"
          ></el-input>
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
            v-if="data.folderIndex != -1"
          />
          <el-button
            type="primary"
            @click="handleFolder('edit')"
            size="large"
            round
            v-if="data.folderIndex != -1"
          >
            确认修改
          </el-button>
          <el-button
            type="primary"
            @click="handleFolder('add')"
            size="large"
            round
            v-if="data.folderIndex == -1"
          >
            确认添加
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
import { Search, Delete, Plus, Close, Edit } from "@element-plus/icons-vue";
import clipboard3 from "vue-clipboard3";
import { ElMessage } from "element-plus";
import axios from "axios";

export default defineComponent({
  components: {
    Delete,
    Plus,
    Close,
    Edit,
  },
  setup() {
    const { toClipboard } = clipboard3();
    const infoDialog = ref(false);
    const folderDialog = ref(false);
    const data = reactive({
      publicPath: process.env.BASE_URL,
      // 数据
      folderData: [] as any,
      iconData: [] as any,
      filterData: [] as any,
      // 搜索
      selectLabel: "全部",
      selectValue: "",
      search: "",
      // 文件夹弹窗
      folderTitle: "",
      folderIndex: 0,
      folderName: "",
      folderFile: "",
      folderTemp: "",
      // 参数
      cardWidth: 90,
      dialogWidth: "50%",
      edit: false,
      expressUrl: "",
    });

    onBeforeMount(async () => {
      //express地址
      data.expressUrl = expressUrl();
      //动态调整图标宽
      cardWidth();
      //控制弹窗宽度
      dialogWidth();
      //读取文件夹
      data.folderData = await readFolder();
      //读取文件夹图片
      data.iconData = await readImage();
      data.filterData = data.iconData;
    });

    //express地址
    function expressUrl() {
      let href = window.location.href;
      let url = href.slice(0, -3);
      //let url = "http://localhost:4000";
      return url;
    }

    //控制弹窗宽度
    function dialogWidth() {
      let clientWidth = document.body.clientWidth;
      if (clientWidth > 960) {
        //PC
        data.dialogWidth = "50%";
      } else if (clientWidth > 600) {
        //平板
        data.dialogWidth = "75%";
      } else {
        //手机
        data.dialogWidth = "80%";
      }
    }

    //读取文件夹
    async function readFolder() {
      //express通信
      let response = await axios.post(data.expressUrl + "/readdir", {
        path: "/icon",
      });
      let arr = response.data.data;
      return new Promise((resolve, reject) => {
        //生成数组
        arr.forEach((item, index) => {
          let parts = item.split("_");
          arr[index] = {
            index: Number(parts[0]),
            name: parts[1],
            path: data.publicPath + "/icon/" + item,
          };
        });
        //排序
        arr.sort((a, b) => a.index - b.index);
        resolve(arr);
      });
    }

    //读取所有文件夹图片
    async function readImage() {
      let folderData = data.folderData;
      let iconData = [] as any;
      //循环文件夹
      for (let i = 0; i < folderData.length; i++) {
        //express通信
        let response = await axios.post(data.expressUrl + "/readdir", {
          path: folderData[i].path,
        });
        let arr = response.data.data;
        //循环内部图片
        for (let j = 0; j < arr.length; j++) {
          let str = arr[j];
          let index = str.lastIndexOf(".");
          let name = str.substring(0, index);
          let obj = {
            name: name,
            sort: folderData[i].name,
            icon: folderData[i].path + "/" + arr[j],
          };
          iconData.push(obj);
        }
      }
      return iconData;
    }

    //筛选分类数据
    function handleSelect(index) {
      return new Promise((resolve, reject) => {
        if (typeof index == "number") {
          data.selectLabel = data.folderData[index].name;
          data.filterData = data.iconData.filter(
            (item) => item.sort == data.selectLabel
          );
          resolve(1);
        } else {
          data.selectLabel = "全部";
          data.filterData = data.iconData;
          resolve(1);
        }
      });
    }

    //搜索
    function handleSearch() {
      return new Promise((resolve, reject) => {
        data.selectLabel = "全部";
        data.selectValue = "";
        let keyword = data.search;
        let iconData = data.iconData;
        let searchData = [] as any;
        for (var i = 0; i < iconData.length; i++) {
          if (
            iconData[i].name.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
          ) {
            searchData.push(iconData[i]);
          }
        }
        data.filterData = searchData;
        resolve(1);
      });
    }

    //复制
    async function handleCopy(icon) {
      //获取图片url
      let currenturl = window.location.href;
      let iconurl = data.publicPath + icon;
      let fullurl = currenturl.substr(0, currenturl.length - 2) + iconurl;
      await toClipboard(fullurl);
      ElMessage({
        message: "图标链接复制成功~",
        type: "success",
      });
    }

    //打开url
    function openUrl(url) {
      window.open(url, "_blank");
    }

    //编辑
    function handleEdit() {
      if (data.edit) {
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
      data.edit = !data.edit;
    }

    //文件夹弹窗
    function handleFolderDialog(type, index) {
      if (type == "edit") {
        data.folderTitle = "编辑文件夹";
        data.folderIndex = index;
        data.folderName = data.folderData[index].name;
        folderDialog.value = true;
      }
      if (type == "add") {
        data.folderTitle = "添加文件夹";
        data.folderIndex = index;
        data.folderName = "";
        data.folderFile = "";
        data.folderTemp = "";
        folderDialog.value = true;
      }
    }

    //文件夹操作
    async function handleFolder(type) {
      if (type == "edit") {
        //编辑文件夹
        let oldPath = data.folderData[data.folderIndex].path;
        let parts = oldPath.split("_");
        console.log(parts);
        let newPath = parts[0] + "_" + data.folderName;
        axios
          .post(data.expressUrl + "/rename", {
            oldPath: oldPath,
            newPath: newPath,
          })
          .then(async function (response) {
            if (response.data.code == 200) {
              folderDialog.value = false;
              ElMessage({
                message: "修改成功",
                type: "success",
              });
              //上传封面图
              if (data.folderFile) {
                let file = data.folderFile;
                handleUpload(file, newPath, "Cover.png");
              } else {
                //刷新文件夹
                data.folderData = await readFolder();
              }
            } else {
              ElMessage({
                message: response.data.msg,
                type: "error",
              });
            }
          });
      }
      if (type == "add") {
        //添加文件夹
        folderDialog.value = false;
        let index = data.folderData[data.folderData.length - 1].index + 1;
        let name = data.folderName;
        if (name == "") {
          name = "未命名文件夹";
        }
        let path = "/icon/" + index + "_" + name;
        axios
          .post(data.expressUrl + "/mkdir", {
            path: path,
          })
          .then(async function (response) {
            if (response.data.code == 200) {
              ElMessage({
                message: "创建成功",
                type: "success",
              });

              //上传封面图
              if (data.folderFile) {
                let file = data.folderFile;
                handleUpload(file, path, "Cover.png");
              } else {
                //刷新文件夹
                data.folderData = await readFolder();
              }
            } else {
              ElMessage({
                message: response.data.msg,
                type: "error",
              });
            }
          });
      }
      if (type == "delete") {
        //删除文件夹
        folderDialog.value = false;
        let path = data.folderData[data.folderIndex].path;
        data.folderData.splice(data.folderIndex, 1);
        axios
          .post(data.expressUrl + "/rmdir", {
            path: path,
          })
          .then(async function (response) {
            if (response.data.code == 200) {
              ElMessage({
                message: "删除成功",
                type: "success",
              });
              //刷新图标
              data.iconData = await readImage();
              data.filterData = data.iconData;
            } else {
              ElMessage({
                message: response.data.message,
                type: "error",
              });
            }
          });
      }
    }

    //删除图标
    function handleIcon(icon) {
      //express通信
      axios
        .post(data.expressUrl + "/unlink", {
          icon: icon,
        })
        .then(async function (response) {
          //获取索引&删除
          let index = data.filterData.findIndex((item) => item.icon === icon);
          if (index !== -1) {
            data.filterData.splice(index, 1);
          }
          let index2 = data.iconData.findIndex((item) => item.icon === icon);
          if (index !== -1) {
            data.iconData.splice(index2, 1);
          }
          ElMessage({
            message: "删除成功",
            type: "success",
          });
        })
        .catch(function (error) {
          ElMessage({
            message: error,
            type: "error",
          });
        });
    }

    //动态调整图标宽
    function cardWidth() {
      //屏幕宽度(+15.2滑块宽度)
      let clientWidth = document.body.clientWidth - 15.2;
      //盒子padding
      let content = clientWidth * 0.08;
      //一排最多个数
      let num = Math.floor((clientWidth - content) / 101.6);
      //计算间隔
      let width = Math.floor((clientWidth - content - 101.6 * num) / num + 90);
      data.cardWidth = width;
    }

    //更多信息
    function handleInfo() {
      infoDialog.value = true;
    }

    //上传图标
    function handleUploadIcon(file) {
      let path = data.folderData[data.selectValue].path;
      let name = file.name;
      handleUpload(file, path, name);
    }

    //上传图片
    async function handleUpload(file, path, name) {
      //判断目录、文件是否存在
      let response = await axios.post(data.expressUrl + "/access", {
        path: path + "/" + name,
      });
      if (response.data.code == 200 && name != "Cover.png") {
        ElMessage({
          message: "文件已存在，请重命名",
          type: "warning",
        });
      } else {
        let imgData = (await uploadImage(file)) as any;
        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        axios
          .post(data.expressUrl + "/upload", {
            name: name,
            path: path,
            base64Data: base64Data,
          })
          .then(async function (response) {
            //刷新文件夹
            data.folderData = await readFolder();
            //读取文件夹图片
            data.iconData = await readImage();
            //筛选分类数据
            await handleSelect(data.selectValue);
            ElMessage({
              message: "上传成功",
              type: "success",
            });
          })
          .catch(function (error) {
            ElMessage({
              message: error,
              type: "error",
            });
          });
      }
    }

    //设置上传封面数据
    function handleCover(file) {
      data.folderFile = file;
      data.folderTemp = URL.createObjectURL(file.raw);
    }

    //上传处理
    function uploadImage(file) {
      return new Promise((resolve, reject) => {
        let fileRaw = file.raw;
        if (file.size > 16777216) {
          //限制文件的大小
          ElMessage({
            message: file.name + "大小超过16M!",
            type: "error",
          });
        } else {
          //读取文件的字符流
          const reader = new FileReader();
          //将文件读取为 DataURL 以data:开头的字符串
          reader.readAsDataURL(fileRaw);
          reader.onload = (e: any) => {
            // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
            const code = e.target.result;
            resolve(code);
          };
        }
      });
    }

    // 监听窗口大小
    window.addEventListener("resize", () => {
      cardWidth();
      dialogWidth();
    });

    return {
      data,
      infoDialog,
      folderDialog,
      handleCopy,
      handleInfo,
      dialogWidth,
      handleSearch,
      handleSelect,
      openUrl,
      handleEdit,
      handleFolder,
      handleUploadIcon,
      handleCover,
      handleIcon,
      handleFolderDialog,
      //图标
      Search,
      Delete,
    };
  },
});
</script>
<style lang="scss">
.index {
  height: 100%;
}
// 头部信息
.head {
  display: flex;
  flex-direction: column;
  padding: 4%;
  background-color: #f5f7fc;
}

.head_title {
  font-size: 35px;
  // font-weight: bold;
  margin-bottom: 25px;
}
.head_txt {
  font-size: 16px;
  color: #5d667a;
  font-weight: 400;
  margin-top: 15px;
}
.folder {
  margin-top: 20px;
}
.folder_item {
  display: flex;
  align-items: center;
}
.folder_img {
  width: 30px;
  height: 30px;
}
.folder_txt {
  font-size: 16px;
  margin-left: 10px;
  margin-right: 15px;
}
.folder_icon {
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
// 搜索框
.searchBox {
  display: flex;
}
.search {
  margin-top: 50px;
  width: 40%;
  min-width: 270px;
}

.search .el-input__wrapper {
  border-radius: 0 50px 50px 0 !important;
}

.select {
  width: 110px;
}
.select .el-input__wrapper {
  border-radius: 50px 0 0 50px !important;
}

.el-input-group__prepend {
  box-shadow: none;
}
.bt_search {
  width: 53px;
  margin-top: 50px;
  margin-left: 10px;
  color: #ffffff;
}
.bt_search:hover {
  color: #ffffff;
}

//图标展示
.content {
  padding: 4%;
  min-height: 300px;
}
.content_head {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.content_title {
  font-weight: 600;
  font-size: 18px;
  color: #1a2947;
}
.content_sum {
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
  height: 90px;
  border-radius: 10px;
  border: 1px solid #f5f7fc;
  margin: 5px;
}
.card:hover {
  background-color: #f5f7fc;
  box-shadow: 0 8px 24px #1a29470a, 0 2px 8px #1a294714;
}
.card_icon {
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 50px;
  background-color: #f56c6c;
  color: #fff;
  padding: 2px;
}
.card_img {
  width: 45px;
  height: 45px;
}
.card_txt {
  text-align: center;
  color: #afb7c7;
  margin-top: 5px;
  font-size: 13px;
  //省略号
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

//底部
.foot {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  font-size: 13px;
  height: 18px;
  color: #5d667a;
}
.foot_txt {
  margin-right: 80px;
  font-weight: lighter;
}
.foot_url {
  position: absolute;
  display: flex;
  align-items: center;
  right: 3%;
}
.qrcode_img {
  width: 125px;
  height: 125px;
}
.foot_img {
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin: 0 8px;
}

//信息弹窗
.index .el-dialog {
  border-radius: 10px;
  cursor: default;
}
.infoDialog_content {
  margin-top: -20px;
  margin-bottom: -10px;
}
.infoDialog_title {
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: bold;
}
.infoDialog_url {
  color: #409eff;
  cursor: pointer;
}

//文件夹弹窗
.folderDialog_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.folderDialog_img {
  position: relative;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin-bottom: 40px;
  border-radius: 8px;
  background-color: #f5f7fc;
}

.folderDialog_img2 {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}
.folderDialog_clear {
  position: absolute;
  left: 0;
  bottom: 0;
}

.folderDialog_name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 16px;
}
.folderDialog_content .el-input {
  margin-left: 10px;
  width: 40%;
}
</style>
