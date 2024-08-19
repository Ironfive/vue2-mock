<template>
  <div>
    <!--点击button即可实现页面的截图-->
    <el-button size="mini" type="primary" plain @click="download">导出图片</el-button>
    <div ref="content" style="width: 400px;height: 400px">
      <div class="content">
        <ring  />
      </div>

    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import ring from '@/pages/home/components/echartsComponents/ring.vue'
export default {
  components: {
    ring
  },
  data() {
    return {}
  },
  methods: {
    // 第二种方式直接下载图片
    download() {
      const ref = this.$refs.content // 截图区域
      html2canvas(ref, {
        devicePixelRatio:1.4,
        useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      }).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png')
        const creatDom = document.createElement('a')
        document.body.appendChild(creatDom)
        creatDom.href = dataURL
        creatDom.download = '图片'
        creatDom.click()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .content{
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/images/02.jpeg");
    background-repeat:no-repeat;
    background-size: 100% 100%;
  }
</style>