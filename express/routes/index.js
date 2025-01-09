var express = require("express");
var router = express.Router();
var fs = require("fs");

//操作目录
let configPath = "./public";

//复制图标文件夹
router.post("/copy", (req, res) => {
  let targetPath = "./public/icon";
  let sourcePath = "./public/backups";
  //创建文件夹
  fs.mkdir(targetPath, { recursive: true }, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "创建出现问题",
      });
    } else {
      //判断是否为空
      fs.readdir(targetPath, (err, files) => {
        if (err) {
          res.send({
            code: 500,
            msg: "不能读取文件夹",
          });
        } else {
          if (files.length === 0) {
            //复制图标
            fs.cp(sourcePath, targetPath, { recursive: true }, (err) => {
              if (err) {
                res.send({
                  code: 500,
                  msg: "出现问题:" + err,
                });
              } else {
                res.send({
                  code: 200,
                  msg: "文件复制成功",
                });
              }
            });
          } else {
            res.send({
              code: 200,
              msg: "已有文件",
            });
          }
        }
      });
    }
  });
});

//判断目录、文件是否存在
router.post("/access", (req, res) => {
  let path = req.body.path;
  fs.access(configPath + path, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "目录/文件不存在",
      });
    } else {
      res.send({
        code: 200,
        msg: "目录/文件存在",
      });
    }
  });
});

//创建文件夹
router.post("/mkdir", (req, res) => {
  let path = req.body.path;
  fs.mkdir(configPath + path, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "创建失败",
      });
    } else {
      res.send({
        code: 200,
        msg: "创建成功",
      });
    }
  });
});

//修改名称
router.post("/rename", (req, res) => {
  let oldPath = configPath + req.body.oldPath;
  let newPath = configPath + req.body.newPath;
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "修改失败",
      });
    } else {
      res.send({
        code: 200,
        msg: "修改成功",
      });
    }
  });
});

//删除文件夹
router.post("/rmdir", (req, res) => {
  let message = "";
  let path = req.body.path;
  fs.readdir(configPath + path, (err, files) => {
    if (err) {
      message = err.message;
      return;
    }
    // 2.删除目录中的内容  删除b1.txt
    // unlink 不能用于删除文件夹，rm 可以删除文件和文件夹
    // 当删除文件、目录时，rm 和 unlink 是完全一样的。
    files.forEach((file) => {
      fs.unlink(configPath + path + "/" + file, (err) => {
        if (err) {
          message = err.message;
          return;
        }
        //console.log(file + "已被删除");
      });
    });
    // 3.删除目录  删除b文件
    fs.rmdir(configPath + path, (err) => {
      if (err) {
        message = err.message;
        return;
      }
      //console.log(path + "目录已被删除");
    });
    if (message == "") {
      res.send({
        code: 200,
        message: "删除成功",
      });
    } else {
      res.send({
        code: 500,
        message: message,
      });
    }
  });
});

//删除文件
router.post("/unlink", (req, res) => {
  let path = req.body.icon;
  fs.unlink(configPath + path, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "不能读取文件",
      });
    } else {
      res.send({
        code: 200,
        msg: "删除文件成功",
      });
    }
  });
});

//读取文件
router.post("/readdir", (req, res) => {
  let path = req.body.path;
  fs.readdir(configPath + path, (err, files) => {
    if (err) {
      res.send({
        code: 500,
        msg: "不能读取文件",
      });
    } else {
      res.send({
        code: 200,
        msg: "读取成功",
        data: files,
      });
    }
  });
});

//上传图片
router.post("/upload", (req, res) => {
  let filePath = configPath + req.body.path + "/" + req.body.name;
  let dataBuffer = Buffer.from(req.body.base64Data, "base64");
  fs.writeFileSync(filePath, dataBuffer);
  res.send({
    code: 200,
    msg: "文件创建并写入成功",
  });
});

module.exports = router;
