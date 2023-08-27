//模拟附件上传服务器
const express = require("express");
const multer = require("multer");
const path = require("path");
var fs = require("fs");
var os = require("os");
const readline = require("readline");
const vueDir = "./src/views/";
const app = express();
const port = 3000;
// 配置 multer 来处理文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // 存储上传的文件的目录（在项目根目录下创建 'uploads' 文件夹）
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});
const upload = multer({ storage });
// 设置 Express.js 中间件
app.use(express.static("public")); // 静态文件服务（用于访问上传的文件）
app.use(express.json());
// 启用 CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // 允许来自 localhost:8080 的请求
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// 处理文件上传的路由
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send("File uploaded!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
