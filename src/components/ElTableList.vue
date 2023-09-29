<template>
  <div class="dataAudit_div">
    <el-tabs v-model="activeName" type="card">
      <div class="parent" style="position: relative" ref="tableParentRef">
        <virtual-scroll ref="virtualScroll" :data="historyDataTables" :item-size="30" key-prop="id"
                        @change="onChange">
          <el-table
              border
              :lazy="true"
              v-loading="loading"
              @cell-click="cellClick"
              :cell-class-name="tableCellClassName"
              @row-contextmenu="rightClick"
              @row-click="clickTableRow"
              @mousedown.native="down($event)"
              @mousemove.native="move($event)"
              @mouseup.native="up($event)"
              :data="virtualList"
              :highlight-current-row="true"
              :stripe="true"
              :header-cell-style="{
                  background: '#cff7ff',
                  fontWeight: 'bold',
                  color: '#080809',
                }"
              :row-height="30"
              :total="totalCount"
              :cell-style="cellStyle"
              :max-height="maxHeight1"
              ref="multipleTable"
              :row-key="(row) => row.id"
              id="table"
          >
            <!-- <virtual-column
              type="index"
              width="40"
              align="center"
              fixed="left"
              label="序号"
            ></virtual-column> -->
            <el-table-column label="序号" align="center" type="index">
              <template slot-scope="{ row }">
                {{ row.id }}
              </template>
            </el-table-column>
            <el-table-column prop="sampleTime" width="170" :sortable="true" label="时间" align="center"
                             :min-width="timeSize"></el-table-column>
            <el-table-column prop="level" :label="'水质' + '\n' + this.stationInfo.stationLevelName" align="center"
                             show-overflow-tooltip></el-table-column>
            <template v-for="col in tableHeader">
              <el-table-column v-if="col.dataName == 'pH'" :key="col.dataItem" align="center" :label="col.dataName"
                               width="130" :prop="col.dataItem">
                <template slot="header">
                  <div class="paramCode">
                    {{ col.dataName + "\n" + col.standard + " (" + col.paramUnit + ")" }}
                  </div>
                </template>
                <template slot-scope="scope">
                  <span style="margin-right: 5px">{{ scope.row[col.dataItem] }}</span>
                  <el-tooltip placement="right"
                              v-if="scope.row[col.dataItem + '_tag'] == 'T' && scope.row[col.dataItem + '_mark']">
                    <i class="el-icon-question"></i>
                    <div slot="content">
                      {{ scope.row[col.dataItem + "_mark"] }}
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column v-if="col.dataName != '电量' && col.dataName != '操作' && col.dataName != 'pH'"
                               :key="col.dataItem" align="center" :prop="col.dataItem">
                <template slot="header">
                  <div class="paramCode">
                    {{ col.dataName + "\n" + col.standard + " (" + col.paramUnit + ")" }}
                  </div>
                </template>
                <template slot-scope="scope">
                  <span style="margin-right: 5px">{{ scope.row[col.dataItem] }}</span>
                  <el-tooltip placement="top-start"
                              v-if="scope.row[col.dataItem + '_tag'] == 'T' && scope.row[col.dataItem + '_mark']">
                    <i class="el-icon-question"></i>
                    <div slot="content">
                      {{ scope.row[col.dataItem + "_mark"] }}
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column v-if="col.dataName === '电量'" :key="col.dataItem" :prop="col.dataItem" align="center"
                               width="90">
                <template slot="header">
                  <div class="paramCode">
                    {{ "电量" + "\n" + "(%)" }}
                    <el-tooltip placement="top-start">
                      <i class="el-icon-question"></i>
                      <div style="width: 200px" slot="content">正常电量值为60%以上(含60%), 异常电量值为60%以下(不含60%)</div>
                    </el-tooltip>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div style="white-space: nowrap; display: inline-block">
                    {{ scope.row[col.dataItem] }}
                  </div>
                  <el-tooltip placement="top-start"
                              v-if="scope.row[col.dataItem + '_tag'] == 'T' && scope.row[col.dataItem + '_mark']">
                    <i class="el-icon-question"></i>
                    <div slot="content">
                      {{ scope.row[col.dataItem + "_mark"] }}
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
            </template>

            <div slot="append">
              <el-divider>到底了~</el-divider>
            </div>
          </el-table>
        </virtual-scroll>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import VirtualScroll from "el-table-virtual-scroll";
import {VirtualColumn} from "el-table-virtual-scroll";
import axios from "axios";

export default {
  name: "calendar",
  components: {
    VirtualScroll,
    VirtualColumn,
  },
  data() {
    return {
      active: "1",
      query: {},
      activeName: "first",

      month: "",
      //参数配置列表
      valueFormat: "yyyy-MM",
      popper: "",
      dataType: "分钟数据", //查看数据类型
      dataType1: "分钟数据",
      timeSize: "100px",
      // 遮罩层（加载中动画）
      loading: false,

      // 显示第一个
      activeTab: "dataTab",
      // 总页码
      totalNum: 0,
      // 页码
      pageSize: 720,
      // 当前页
      currentPage: 1,
      totalCount: 0, // 数据总数

      // 列表集合
      historyDataTables: [],
      virtualList: [], // 虚拟列表
      tableHeader: [],

      // 站点详细信息
      stationInfo: {
        // 站点编号
        stationCode: "",
        // 站点名
        stationName: "",
      },

      value_date_time: moment().format("yyyy-MM"),

      // 默认站点
      stationCode: null,

      rowdata: {},

      offsetLeft: "0px", //选区距父级元素左边距离
      offsetTop: "0px", //选区距父级元素顶部距离
      width: "0px", //选区宽度
      height: "0px", //选区高度

      value: "",
      clientHeight: "",
      clientWidth: "",
      otherHeight: "",
      maxHeight1: "584px",
      scrollTop: 0,
      scrollLeft: 0,
      clickedRow: "", // 点击的单元格行号
      clickedColum: "", // 点击的单元格列名
      // new0426右键菜单
      menus: [{name: "清除选区", operType: 1}],
      xqArr: [], // 选区 多选单元格的去重后的数组
      // 是否需要(允许)处理鼠标的移动事件,默认不处理
      select: false,

      // 定义移动元素div
      rect: null,
      // 记录鼠标按下时的坐标
      downX: 0,
      downY: 0,
      // 记录鼠标抬起时候的坐标
      mouseX2: this.downX,
      mouseY2: this.downY,
      // 表格dom元素
      TableDom: null,
      tableHeaderHeight: 0,
      selectedData: [], // 鼠标框选选中的数据

      selectedCellTop: 0, // 选中单元格距离el-table顶部的距离
      selectedCellLeft: 0, // 选中单元格距离el-table左侧的距离

      tableRectTop: 0, // el-table距离window顶部的距离
      tableRectLeft: 0, // el-table距离window左侧的距离
      tableScrollTop: 0, // el-table滚动的距离

      count: 0, // 点击跳转到标识按钮按钮次数
      rowIdList: [], // 所有标识过的数据所在行的id
      timer: false,
      startIndex: 0,
    };
  },

  mounted() {
    this.TableDom = this.$refs.multipleTable.$el; // 获取table元素
    const menu = this.$refs.menuRef.$el;
    // 获取table的位置,监听窗口变化,table的距离变化
    this.getTableMarginLeft();
    window.addEventListener("resize", this.getTableMarginLeft);

    this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    this.clientHeight = document.documentElement.clientHeight || document.body.cientHeight;

    // 获取折叠面板的高度
    const preCollapseHeight = this.$refs.myCollapseRef.$el.offsetHeight;
    this.otherHeight = Math.ceil($(".el-row").outerHeight()) + preCollapseHeight;

    // this.maxHeight1 = this.clientHeight - this.otherHeight - 150 + "px";
    window.onresize = () => {
      this.clientHeight = document.documentElement.clientHeight ||
          document.body.clientHeight;
      this.updateMaxHeight(this.clientHeight, this.otherHeight);
    };
    this.updateMaxHeight(this.clientHeight, this.otherHeight);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getTableMarginLeft);
  },
  created() {
    this.getTableHeader();
    this.getTableList();
  },

  computed: {
    // 根据权限条件渲染菜单项
    filteredMenus() {
      let filteredMenus = [];

      if (this.xqArr.length > 0) {
        // 只要选区里有1,2,或T,说明打过标识和审核过了,菜单只显示清除选区
        const isFlaggedAndReviewed = this.xqArr.some((item) => {
          return item.tagStatus === "1" || item.tagStatus === "2" || item.tag === "T";
        });
        // 只要选区里有item是"",菜单要有清除选区,打标识
        const isNotFlagged = this.xqArr.some((item) => {
          return item.tagStatus === "";
        });

        if (isFlaggedAndReviewed) {
          filteredMenus = [{name: "清除选区", operType: 1}];
        } else {
          filteredMenus = [
            {name: "清除选区", operType: 1},
            {name: "选区打标识", operType: 2},
            {name: "取消打标识", operType: 3},
          ];
          if (isNotFlagged) {
            // 如果选区里都是没操作过的数据,菜单显示清除选区和选区打标识
            filteredMenus.splice(2, 1);
          }
        }
      }
      return filteredMenus;
    },
  },
  watch: {
    clientHeight(val) {
      if (!this.timer) {
        this.clientHeight = val;
        this.otherHeight = Math.ceil($(".is-always-shadow").outerHeight()) + Math.ceil($(".is-top").outerHeight());
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.maxHeight1 = that.clientHeight - that.otherHeight - 155 + "px";
          //160是顶部和底部button加table上边距的高度
          that.timer = false;
        }, 100);
      }
    },

    //虚拟滚动reset??, totalCount是数据总数,
    totalCount() {
      this.$refs.virtualScroll?.reset?.(); // 滚动回到初始位置,根据具体场景添加
      this.getHistoryDatas();
    },

    clientHeight(val) {
      this.updateMaxHeight(val, this.otherHeight);
    },
    otherHeight(val) {
      this.updateMaxHeight(this.clientHeight, val);
    },
  },
  methods: {
    // 获取header
    async getTableHeader() {
      await axios.get("https://www.fastmock.site/mock/2a8d1bce05f2ad2b9345ae1928e40a9a/api/header").then((res) => {
        if (res.data.code == 200) {
          this.tableHeader = res.data.data;
        }
      });
    },
    // 获取table的数据
    async getTableList() {
      await axios.get("https://www.fastmock.site/mock/2a8d1bce05f2ad2b9345ae1928e40a9a/api/getTableData").then((res) => {
        if (res.data.code == 200) {
          this.historyDataTables = res.data.rows;
          this.historyDataTables.forEach((data) => {
            data.sampleTime = moment(data.sampleTime).format("yyyy-MM-DD HH:mm:ss"); //去掉日
          });
          // 把表格的标识数据所在行的id存进数组里,为写按钮跳转标识位置使用
          const tableData = this.historyDataTables;
          const columns = this.$refs.multipleTable.columns; // 获取标题行
          // 遍历表格行，查找满足条件的行
          for (let i = 0; i < tableData.length; i++) {
            const row = tableData[i];
            for (let j = 3; j < columns.length; j++) {
              const column = columns[j];
              // 判断是否满足条件
              if (row[column.property + "_tag_status"] === "0" || row[column.property + "_tag_status"] === "1") {
                // 获取对应的行元素
                that.rowIdList.push(row.id);
                break;
              }
            }
          }
          // console.log(that.rowIdList, "--that.rowIdList--");
        }
      });
    },

    updateMaxHeight(clientHeight, otherHeight) {
      if (!this.timer) {
        this.clientHeight = clientHeight;
        this.otherHeight = otherHeight;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.maxHeight1 = that.clientHeight - that.otherHeight - 155 + "px";
          //160是顶部和底部button加table上边距的高度
          that.timer = false;
        }, 100);
      }
    },

    // 虚拟列表的数据
    onChange(renderData, start, end) {
      // console.log("onChange");
      // console.log(start, "--start--");
      this.startIndex = start; // 需要添加startIndex,真实的index = this.startIndex + rowIndex
      this.virtualList = renderData;
    },

    // 监听折叠状态
    handleCollapseChange() {
      // 折叠前的高度
      const preCollapseHeight = this.$refs.myCollapseRef.$el.offsetHeight;

      this.otherHeight = Math.ceil($(".el-row").outerHeight()) + preCollapseHeight;

      this.updateMaxHeight(this.clientHeight, this.otherHeight);

      // 监听过渡动画结束事件
      this.$refs.myCollapseRef.$el.addEventListener("transitionend", this.handleTransitionEnd);
    },

    handleTransitionEnd() {
      // 折叠后的高度
      const postCollapseHeight = this.$refs.myCollapseRef.$el.offsetHeight;

      // 移除过渡动画结束事件的监听器
      this.$refs.myCollapseRef.$el.removeEventListener("transitionend", this.handleTransitionEnd);

      // 在这里可以对折叠前后的高度进行处理
      this.otherHeight = Math.ceil($(".el-row").outerHeight()) + postCollapseHeight;

      this.updateMaxHeight(this.clientHeight, this.otherHeight);
    },

    // 滚动到目标行所在的位置
    scrollToTargetRow() {
      let rowIdList = this.rowIdList;

      if (rowIdList.length === 0) {
        const sendMarkData = this.getDataToLocalStorage(this.localDataName);
        if (sendMarkData && Array.isArray(sendMarkData) && sendMarkData.length > 0) {
          // 如果本地存储有数据,获取数据id并去重
          rowIdList = [...new Set(sendMarkData.map((item) => item.rowId))];
          rowIdList.sort((a, b) => a - b); // 排序
        } else {
          this.$message({
            message: "当前没有标识的数据!",
            type: "warning",
          });
          return;
        }
      }

      if (this.count >= rowIdList.length) {
        this.count = 0;
      }

      // 获取标识数据所在行的id,行数据的id是从1开始的
      const id = rowIdList[this.count];
      const index = id > 1 ? id - 2 : id - 1;

      // 跳转的index是从 0 开始的, 为了直观显示,这里跳转到具体行的上面空一行
      this.$refs.virtualScroll.scrollTo(index);
      this.count++;
    },

    // 获取table距离页面左侧和上方的距离
    getTableMarginLeft() {
      const tableRect = this.TableDom.getBoundingClientRect(); // 获取el-table元素的位置信息
      this.tableRectTop = Math.ceil(tableRect.top);
      this.tableRectLeft = Math.ceil(tableRect.left);
    },

    // table的右键点击当前行事件,右键显示菜单
    rightClick(row, column, event) {
      //阻止元素发生默认的行为
      event.preventDefault();
      // 根据事件选区的最后一个单元格位置，进行定位
      if (this.xqArr.length === 0) {
        menu.style.display = "none";
      } else if (this.xqArr.length > 0) {
        // 计算菜单应该放置的位置
        const menuWidth = 100; // 菜单的宽度
        const menuHeight = this.filteredMenus.length * 35; // 菜单的高度
        const menuX = event.clientX - this.tableRectLeft; // menu在table容器里的位置 = 点击的坐标 - table距离页面左侧的距离
        const menuY = event.clientY - this.tableRectTop;
        const menuRight = menuX + menuWidth;
        const menuBottom = menuY + menuHeight;
        const overflowX = Math.max(menuRight - this.TableDom.clientWidth + 10, 0);
        const overflowY = Math.max(menuBottom - this.TableDom.clientHeight + 10, 0);
        const menuLeft = menuX - overflowX;
        const menuTop = menuY - overflowY;

        // 设置菜单的位置
        menu.style.left = `${menuLeft}px`;
        menu.style.top = `${menuTop}px`;
        // 改变自定义菜单的隐藏与显示;
        menu.style.display = "block";
        menu.style.zIndex = 1000;
      }
    },

    // table的左键点击当前行事件,隐藏菜单
    clickTableRow(row, column, event) {
      menu.style.display = "none";
    },

    // 自定义菜单的点击事件
    infoClick(index, type) {
      if (index === 0) {
        // 0 清除选区
        this.xqArr = []; // 点选+框选的清除掉
        this.selectedData = []; // 框选的清除掉
      }
      menu.style.display = "none";
    },

    // 根据数值超标状态 更改单元格颜色
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      //注意这里是解构
      //利用单元格的 className 的回调方法，给行列索引赋值
      row.index = rowIndex;
      column.index = columnIndex;
    },

    // 点击单元格获取索引
    cellClick(row, column, cell, event) {
      // 获取当前单元格所在位置（列）
      this.clickedColum = column.index;

      const {property} = column;
      const {sampleTime, id} = row;
      let obj = {
        rowId: id,
        column: this.clickedColum,
        factor: property,
        sampleTime: sampleTime,
        tag: row[property + "_tag"] || "",
        tagStatus: row[property + "_tag_status"] || "",
        mark: row[property + "_mark"] || "",
      };

      // 防止多次往数组加入重复元素
      const arrayItem = this.xqArr.find((item) => item.rowId === row.id && item.column === this.clickedColum && item.sampleTime === row.sampleTime);
      // if element not found
      if (!arrayItem && ![0, 1, 2].includes(this.clickedColum)) {
        this.xqArr.push(obj);
      }
    },

    // 单元格样式
    cellStyle({row, column, rowIndex, columnIndex}) {
      // 对xqArr选择选区的单元格加蓝边框
      let matchObj = this.xqArr.find((item) => item.column === columnIndex && item.rowId === row.id && item.sampleTime === row.sampleTime);
      if (matchObj) {
        return {border: "1px solid #5E99FD"};
      }
    },

    down(event) {
      // 鼠标按下时才允许处理鼠标的移动事件
      this.select = true;
      this.rect = document.createElement("div");
      // 框选div 样式
      this.rect.style.cssText =
          "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px solid #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
      this.rect.id = "selectDiv";
      this.getTableMarginLeft(); // 获取更新后的table所在位置的距离

      const container = document.querySelector(".el-table__body-wrapper"); // 获取table容器元素
      this.TableDom.appendChild(this.rect); // 添加到table元素下

      // 取得鼠标按下时的坐标位置
      this.downX = event.x || event.clientX + container.scrollLeft - this.tableRectLeft; // 鼠标按下时的x轴坐标 event.x 兼容火狐浏览器, event.clientX 兼容谷歌浏览器
      this.downY = event.y || event.clientY - this.tableRectTop; // 鼠标按下时的y轴坐标

      this.rect.style.left = this.downX + "px"; // 设置你要画的矩形框的起点位置
      this.rect.style.top = this.downY + "px"; // 设置你要画的矩形框的起点位置
      //设置你要画的矩形框的起点位置
      this.rect.style.left = this.downX; // 因为在火狐浏览器下,上面的代码不起作用,所以在这里再写一遍，为什么火狐浏览器不起作用,因为火狐浏览器下,我们的div是绝对定位的,所以我们要加上px，为什么这里没加px,因为我们下面要加上px,所以这里不用加
      this.rect.style.top = this.downY;
    },

    move(event) {
      /*
      这个部分,根据你鼠标按下的位置,和你拉框时鼠标松开的位置关系,可以把区域分为四个部分,根据四个部分的不同,
      我们可以分别来画框,否则的话,就只能向一个方向画框,也就是点的右下方画框.
      */
      if (this.select) {
        // 取得鼠标移动时的坐标位置
        this.mouseX2 = event.clientX; // 鼠标移动时的x轴坐标
        this.mouseY2 = event.clientY; // 鼠标移动时的y轴坐标
        // 框选元素的显示与隐藏
        if (this.rect.style.display == "none") {
          this.rect.style.display = "";
        }
        // 框选元素的位置处理
        this.rect.style.left = Math.min(this.mouseX2, this.downX) - this.tableRectLeft + "px";

        this.rect.style.top = Math.min(this.mouseY2, this.downY) - this.tableRectTop + "px"; // 取得鼠标拉框时的起点坐标

        this.rect.style.width = Math.abs(this.mouseX2 - this.downX) + "px"; // 取得鼠标拉框时的宽度

        this.rect.style.height = Math.abs(this.mouseY2 - this.downY) + "px"; // 取得鼠标拉框时的高度

        // A part
        if (this.mouseX2 < this.downX && this.mouseY2 < this.downY) {
          this.rect.style.left = this.mouseX2 + this.tableRectLeft;
          this.rect.style.top = this.mouseY2 + this.tableRectTop;
        }

        // B part
        if (this.mouseX2 > this.downX && this.mouseY2 < this.downY) {
          this.rect.style.left = this.downX + this.tableRectLeft;
          this.rect.style.top = this.mouseY2 + this.tableRectTop;
        }

        // C part
        if (this.mouseX2 < this.downX && this.mouseY2 > this.downY) {
          this.rect.style.left = this.mouseX2 + this.tableRectLeft;
          this.rect.style.top = this.downY + this.tableRectTop;
        }

        // D part
        if (this.mouseX2 > this.downX && this.mouseY2 > this.downY) {
          this.rect.style.left = this.downX + this.tableRectLeft;
          this.rect.style.top = this.downY + this.tableRectTop;
        }
      } else {
        return;
      }

      if (event && event.stopPropagation) {
        // 标准浏览器，如Chrome，Firefox等
        event.stopPropagation(); // 阻止事件冒泡
        event.stopImmediatePropagation(); // 阻止事件冒泡并阻止后续事件处理程序的执行
      } else {
        // 兼容IE浏览器
        window.event.cancelBubble = true;
      }
      if (event && event.preventDefault) {
        event.preventDefault(); // 阻止默认事件
      } else {
        window.event.returnValue = false; // 兼容IE浏览器
      }
    },

    // 鼠标抬起事件
    up() {
      if (this.select) {
        const container = document.querySelector(".el-table__body-wrapper"); // 获取table容器元素
        const scrollLeft = container.scrollLeft;

        const columns = this.$refs.multipleTable.columns; // 表格的标题

        const tableBody = document.querySelector(".el-table__body");

        tableBody.children[1].childNodes.forEach((element) => {
          for (let index = 0; index < element.childNodes.length; index++) {
            // 获取当前单元格
            const cell = element.childNodes[index];
            const cellRect = cell.getBoundingClientRect();
            const cellOffsetTop = cellRect.top - this.tableRectTop; // cell到表格距离

            if (
                // 判断选中的单元格是否在鼠标拉框的范围内
                this.rect.offsetLeft + scrollLeft < cell.offsetLeft + cell.offsetWidth &&
                this.rect.offsetLeft + scrollLeft + this.rect.offsetWidth > cell.offsetLeft
                && this.rect.offsetTop < cellOffsetTop + cell.offsetHeight &&
                this.rect.offsetTop + this.rect.offsetHeight > cellOffsetTop &&
                index >= 3 && // 选中的单元格所在列的索引大于等于3
                this.rect.offsetWidth > 3 && // 判断拉框宽度大于3px
                this.rect.offsetHeight > 3 // 判断拉框高度大于3px
            )
              if (cell.className.indexOf("add") == -1) {
                // cell.style.border = "1px solid red";
                // const cellText = cell.innerText;
                // console.log(cellText, "--cellText---");

                const rowId = parseInt(element.childNodes[0].innerText); // 把id转成数字型
                const rowData = this.virtualList.find((item) => item.id === rowId); // 获取当前单元格所在的行数据

                // 获取表格的列名的属性名property
                let columnProperty = undefined;
                // 遍历第一行数据
                // console.log(index, '--index--'); // 框选数据所在列的索引

                for (const item of columns) {
                  if (item.index === index) {
                    columnProperty = item.property;
                    break;
                  }
                }
                // const rowIndex = element.rowIndex; // 将当前单元格所在的行数据加入到该列数据中,虚拟滚动后rowIndex不准,所以下面使用的id
                const columnIndex = index;
                const time = rowData.sampleTime;
                // 选择要添加到选中行数组中的属性
                const selected = {
                  rowId: rowData.id,
                  column: columnIndex,
                  sampleTime: time,
                  factor: columnProperty,
                  tag: rowData[columnProperty + "_tag"] || "",
                  tagStatus: rowData[columnProperty + "_tag_status"] || "",
                  mark: rowData[columnProperty + "_mark"] || "",
                };

                // 将选中数据加入到状态中已有的数据中,如果已有相同的数据，则不加入
                if (!this.selectedData.some((data) => this.isEqual(data, selected))) {
                  this.selectedData.push(selected);
                }
                // 将选中数据加入到 xqArr 中
                this.selectedData.forEach((item) => {
                  // 如果 xqArr 中已有相同数据，则不加入
                  if (!this.xqArr.some((data) => this.isEqual(data, item))) {
                    this.xqArr.push(item);
                  }
                });
                this.selectedData = [];
              }
          }
        });
        //鼠标抬起,就不允许在处理鼠标移动事件
        this.select = false;
        //隐藏图层
        if (this.rect) {
          this.TableDom.removeChild(this.rect);
        }
      } else {
        return;
      }
    },
    // 定义方法 isEqual 来比较两个选中数据对象是否相同
    isEqual(data1, data2) {
      return data1.rowId === data2.rowId && data1.column === data2.column && data1.sampleTime === data2.sampleTime && data1.factor === data2.factor;
    },
  },
};
</script>

<style lang="scss" scoped>
$menuBg: #304156;
$menuText: #bfcbd9;
.div {
  position: absolute;
  border: 1px dashed blue;
  width: 0px;
  height: 0px;
  left: 0px;
  top: 0px;
  overflow: hidden;
}

::v-deep .el-container {
  height: 100%;
}

.el-aside {
  padding: 0;
}

.el-main {
  padding: 5px 15px 10px 10px;
}

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

::v-deep .el-table .cell {
  padding: 0;
  // line-height: 20px;
}

::v-deep .el-tabs__header {
  margin-bottom: 7px;
}

::v-deep .el-table__body-wrapper {
  border-bottom: none;
  // cursor: pointer;
}

::v-deep .el-card__body {
  padding: 0px;
}

.el-button--text {
  color: #1890ff !important;
}

.el-button--mini {
  font-size: 17px;
}

.card {
  padding: 0px;
  border: 4px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0/10%);
}

::v-deep .el-row {
  padding-bottom: 0px !important;
}

.dataAudit_div {
  height: 100%;

  .findBtn {
    margin-left: 16px;
  }

  //列的因子和单位换行
  .el-table .cell {
    white-space: pre-line;
  }
}

// 单击单元格右键菜单样式
.menuDiv {
  display: none;
  position: absolute;

  .menuUl {
    height: auto;
    width: 100px;
    font-size: 14px;
    text-align: left;
    border-radius: 3px;
    border: none;
    background-color: $menuBg;
    color: #fff;
    list-style: none;
    padding: 0 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    li {
      width: 100px;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255, 255, 255, 0.47);

      &:hover {
        color: rgb(54, 138, 175);
      }
    }
  }
}

// 提交按钮
.submit_btn {
  margin-top: 10px;
}

//折叠日历图的宽度
::v-deep .el-collapse-item__header {
  height: 20px;
  margin-left: 8px;
}

// 折叠栏的icon的magin
::v-deep .el-collapse-item__arrow {
  margin: 0 0 0 auto;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 5px;
}

// 站点位置原来是向右侧方向的箭头
// 点击后方向
::v-deep .el-collapse-item__arrow.is-active {
  transform: rotate(180deg);
}
</style>