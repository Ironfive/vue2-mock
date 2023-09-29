<template>
  <div>
    <!--    <quill-editor-->
    <!--        v-model="content"-->
    <!--        ref="myQuillEditor"-->
    <!--        :options="editorOption"-->
    <!--        @blur="onEditorBlur($event)"-->
    <!--        @focus="onEditorFocus($event)"-->
    <!--        @change="onEditorChange($event)"-->
    <!--        @ready="onEditorReady($event)"></quill-editor>-->
    <!--    <el-upload-->
    <!--        class="upload-demo"-->
    <!--        :action="uploadurl"-->
    <!--        :on-success="handleSuccess"-->
    <!--        :before-upload="beforeUpload"-->
    <!--        :file-list="fileList"-->
    <!--    >-->
    <!--      <el-button size="small" type="primary">点击上传视频</el-button>-->
    <!--    </el-upload>-->
    <!--    <el-input v-model="value" @input="getData"></el-input>-->
    <!--    <org-select-list v-model="value" clearable filterable></org-select-list>-->
    <!--    <el-table-list></el-table-list>-->
    <virutal-table :data="historyDataTables">
      <el-table-column label="序号" align="center" type="index" show-overflow-tooltip width="100">
        <template slot-scope="scope"><span>{{ scope.row.keyIndex }}</span></template>
      </el-table-column>
      <el-table-column prop="sampleTime" width="170" label="时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="level" label="水质" align="center" show-overflow-tooltip></el-table-column>
    </virutal-table>
  </div>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import OrgSelectList from "@/components/OrgSelectList";
import axios from "axios";
import ElTableList from "@/components/ElTableList";
import VirutalTable from "@/components/Table/VirutalTable";
import moment from "moment";

export default {
  name: "root",
  components: {
    quillEditor,
    OrgSelectList,
    ElTableList,
    VirutalTable
  },
  data() {
    return {
      value: 1111,
      uploadurl: 'http://localhost:3000/upload',
      content: '',
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{header: 1}, {header: 2}], // 1、2 级标题
            [{list: 'ordered'}, {list: 'bullet'}], // 有序、无序列表
            [{script: 'sub'}, {script: 'super'}], // 上标/下标
            [{indent: '-1'}, {indent: '+1'}], // 缩进
            [{direction: 'rtl'}], // 文本方向
            [{size: ['12', '14', '16', '18', '20', '22', '24', '28', '32', '36']}], // 字体大小
            [{header: [1, 2, 3, 4, 5, 6]}], // 标题
            [{color: []}, {background: []}], // 字体颜色、字体背景颜色
            // [{ font: ['songti'] }], // 字体种类
            [{align: []}], // 对齐方式
            ['clean'], // 清除文本格式
            ['image', 'video'] // 链接、图片、视频
          ]
        },
        placeholder: '请输入正文'
      },
      fileList: [], // 存储已上传的文件
      control: null,
      historyDataTables: []
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async getData() {
      this.control && this.control.abort()
      this.control = new AbortController();
      try {
        let res = await axios.get('/mockTest/getData', {
          signal: this.control.signal
        })
      } catch {
        console.log('abort')
      }

    },
    // 失去焦点事件
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
// 获得焦点事件
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
// 准备富文本编辑器
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
// 内容改变事件
    onEditorChange({quill, html, text}) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
    beforeUpload(file) {
      // 在上传之前可以做一些验证，例如文件类型、大小等
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        this.$message.error('只能上传视频文件');
        return false;
      }
      // 可以添加其他验证逻辑，比如文件大小限制等
      return true;
    },
    handleSuccess(response, file, fileList) {
      // 上传成功后的处理
      this.$message.success('上传成功');
      // 在 fileList 中添加上传成功的文件
      this.fileList.push(file);
    },
    async getTableList() {
      await axios.get("https://www.fastmock.site/mock/2a8d1bce05f2ad2b9345ae1928e40a9a/api/getTableData").then((res) => {
        if (res.data.code == 200) {
          this.historyDataTables = res.data.rows;
          this.historyDataTables.forEach((item, index) => {
            this.$set(item, 'keyIndex', index + 1)
          })
        }
      });
    },
  }
}
</script>

<style scoped>

</style>