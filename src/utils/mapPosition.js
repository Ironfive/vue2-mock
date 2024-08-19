export default {
    init: function() {
        //ak**,百度地图官网申请
        const AK = 'mkPO6JNKHGPvlTrNz28TDUSRL5UZa6en'
        const BMapURL = 'https://api.map.baidu.com/api?v=3.0&ak=' + AK + '&s=1&callback=onBMapCallback'
        return new Promise((resolve, reject) => {
            // 百度地图异步加载回调处理
            window.onBMapCallback = function() {
                resolve(BMap)
            }
            // 插入script脚本
            const scriptNode = document.createElement('script')
            scriptNode.setAttribute('type', 'text/javascript')
            scriptNode.setAttribute('src', BMapURL)
            document.body.appendChild(scriptNode)
        })
    }
}