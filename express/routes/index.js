var express = require("express");
var fs = require("fs");
var router = express.Router();
module.exports = router;

//操作目录
let configPath = "./public";

//复制文件夹
router.post("/copy", (req, res) => {
  let targetPath = configPath + req.body.targetPath;
  let sourcePath = configPath + req.body.sourcePath;
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

//读取文件
router.post("/readFile", (req, res) => {
  let path = req.body.path;
  fs.readFile(configPath + path, "utf8", (err, data) => {
    if (err) {
      res.send({
        code: 500,
        msg: "错误：" + err,
      });
    } else {
      res.send({
        code: 200,
        data: JSON.parse(data),
        msg: "读取成功",
      });
    }
  });
});

//修改文件
router.post("/writeFile", (req, res) => {
  let path = req.body.path;
  let str = req.body.str;
  fs.writeFile(configPath + path, str, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "写入失败：" + err,
      });
    } else {
      res.send({
        code: 200,
        msg: "写入成功",
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
router.post("/rmdir", async (req, res) => {
  let path = configPath + req.body.path;
  try {
    deleteFolder(path);
    res.send({
      code: 200,
      message: "删除成功",
    });
  } catch (err) {
    res.send({
      code: 500,
      message: err.message,
    });
  }
});

function deleteFolder(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        // 删除文件夹
        deleteFolder(curPath);
      } else {
        // 删除文件
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

router.post("/rmdir2", async (req, res) => {
  let path = configPath + req.body.path;
  fs.rmdir(path, { recursive: true }, (err) => {
    if (err) {
      res.send({
        code: 500,
        message: err.message,
      });
    } else {
      res.send({
        code: 200,
        message: "删除成功",
      });
    }
  });
});

//删除文件
router.post("/unlink", (req, res) => {
  let path = req.body.path;
  fs.unlink(configPath + path, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "删除失败",
      });
    } else {
      res.send({
        code: 200,
        msg: "删除文件成功",
      });
    }
  });
});

//读取文件夹
router.post("/readdir", (req, res) => {
  let path = req.body.path;
  fs.readdir(configPath + path, (err, files) => {
    if (err) {
      res.send({
        code: 500,
        msg: "不能读取文件夹",
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
  let dataBuffer = Buffer.from(req.body.str, "base64");
  fs.writeFile(filePath, dataBuffer, (err) => {
    if (err) {
      res.send({
        code: 500,
        msg: "上传失败：" + err,
      });
    } else {
      res.send({
        code: 200,
        msg: "文件创建并写入成功",
      });
    }
  });
});
