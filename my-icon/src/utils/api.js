import axios from "axios";
import { ElMessage } from "element-plus";

let expressUrl;
export default {
  //设置通信地址
  setUrl() {
    let href = window.location.href;
    let url = href.slice(0, -3);
    // let url = "http://localhost:4000";
    expressUrl = url;
  },

  //复制文件
  copyFolder() {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/copy", {
          targetPath: "/configData",
          sourcePath: "/initData",
        })
        .then(function (response) {
          resolve(1);
        });
    });
  },

  //读取文件
  readFile(path) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/readFile", {
          path: path,
        })
        .then(function (response) {
          resolve(response.data.data);
        });
    });
  },

  //修改文件
  writeFile(path, str) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/writeFile", {
          path: path,
          str: str,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },

  //判断目录、文件是否存在
  isExist(path) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/access", {
          path: path,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },

  //创建文件夹
  createFolder(path) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/mkdir", {
          path: path,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },

  //重命名文件夹
  renameFolder(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/rename", {
          oldPath: oldPath,
          newPath: newPath,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },

  //读取文件夹
  async readFolder() {
    //express通信
    let response = await axios.post(expressUrl + "/readdir", {
      path: "/configData/icon",
    });
    let arr = response.data.data;
    return new Promise((resolve, reject) => {
      //生成数组
      arr.forEach((item, index) => {
        let parts = item.split("_");
        arr[index] = {
          index: Number(parts[0]),
          name: parts[1],
          path: "/configData/icon/" + item,
        };
      });
      resolve(arr);
    });
  },

  //读取所有文件夹文件
  async readImage(folderData) {
    let iconData = [];
    //循环文件夹
    for (let i = 0; i < folderData.length; i++) {
      //express通信
      let response = await axios.post(expressUrl + "/readdir", {
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
          path: folderData[i].path + "/" + arr[j],
        };
        iconData.push(obj);
      }
    }
    return iconData;
  },

  //删除文件夹
  deleteFolder(path) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/rmdir", {
          path: path,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },

  //file to base64编码
  base64(file) {
    return new Promise((resolve, reject) => {
      let fileRaw = file.raw;
      if (file.size > 1048576) {
        //限制文件的大小
        ElMessage({
          message: file.name + " 大小超过 1 M!",
          type: "error",
        });
        reject;
      } else {
        //读取文件的字符流
        const reader = new FileReader();
        //将文件读取为 DataURL 以data:开头的字符串
        reader.readAsDataURL(fileRaw);
        reader.onload = (e) => {
          // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
          const code = e.target.result;
          resolve(code);
        };
      }
    });
  },

  //上传图片
  async uploadImage(name, path, base64) {
    let str = base64.replace(/^data:image\/\w+;base64,/, "");
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/upload", {
          name: name,
          path: path,
          str: str,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },

  //删除图片
  deleteImage(path) {
    return new Promise((resolve, reject) => {
      axios
        .post(expressUrl + "/unlink", {
          path: path,
        })
        .then(function (response) {
          resolve(response.data);
        });
    });
  },
};
