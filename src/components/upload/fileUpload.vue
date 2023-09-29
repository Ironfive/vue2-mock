<template>
  <div>
    <el-upload
        class="upload-demo"
        drag
        :action="uploadurl"
        multiple
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        :on-progress="handleProgress">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

    <div v-if="showProgress">
      <p>上传进度: {{ uploadProgress }}%</p>
      <el-progress :percentage="uploadProgress"></el-progress>
    </div>
    <el-table class="table-box" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
              height="680">
      <el-table-column prop="fileName" label="文件名" width="260">
      </el-table-column>
      <el-table-column prop="path" label="地址" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="size" label="文件大小(kb)" width="200">
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="danger" @click="del(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      showProgress: false, // 控制是否显示上传进度
      uploadProgress: 0, // 存储上传进度
    };
  },
  props: {
    uploadurl: {
      type: String,
      default: '',
      required: true,
    }
  },
  methods: {
    beforeUpload(file) {
      // 在上传之前的逻辑，可以用于验证文件类型、大小等
      return true; // 返回 true 允许上传，返回 false 取消上传
    },
    handleSuccess(response, file) {
      // 处理上传成功的响应
      console.log(response);
    },
    del(row, index) {
      this.tableData.splice(index, 1)
    },
    handleProgress(event, file, fileList) {
      de
      // 处理上传进度
      if (event.percent) {
        this.uploadProgress = Math.floor(event.percent); // 更新上传进度
        this.showProgress = true; // 显示上传进度条
      }
    },
  },
};
</script>
