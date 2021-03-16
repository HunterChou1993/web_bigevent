$(function(){
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义过滤器
    template.defaults.imports.dateFormat = function(date){
        const dt = new Date(date)

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义查询参数对象
    var data = {
        pagenum: 1,//页面 默认请求第一页数据
        pagesize: 2,// 每页显示几条数据
        cate_id: '',//文章分类
        state:'' //文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable () {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data: data,
            success: function(res){
                if(res.status !== 0) {
                    return layer.msg('获取文章失败')
                }
                // 使用模板引擎渲染的数据
                var htmlStr = template('tpl-list',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success: function(res){
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败')
                } 
               
               var htmlStr = template('tpl-cate',res)
               $('[name=cate_id]').html(htmlStr)
               form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        data.cate_id = cate_id
        data.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem:'pageBox', // 分页容器的id
            count:total,    //  总数据条数
            limit:data.pagesize, // 每页显示几条数据
            curr:data.pagenum    // 设置默认被选中的分页
        })
    }
})