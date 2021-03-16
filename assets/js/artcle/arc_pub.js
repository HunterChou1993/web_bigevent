$(function(){
    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()
    initCate()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 定义加载文章分类方法
    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 为选择封面的按钮
    $('#btnChooseImage').on('click',function(){
        $('#coverFile').click()
    })

    // 监听coverFile的 change事件
    $('#coverFile').on('change',function(e){
        var files = e.target.files
        if(files.length === 0){
            return 
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })

    // 文章的状态
    var art_state = '已发布'

    $('#btnSave').on('click',function(){
        art_state = '草稿'
    })

    $('#form-pub').on('submit',function(e){
        e.preventDefault()
        var formData = new FormData($(this)[0])
        formData.append('state',art_state)

        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            formData.append('cover_img',blob)
        })
        // 发起ajax请求
        publishArticle(formData)

    })

    function publishArticle (data) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:data,
            // 注意如果向服务器提交的是formData格式的数据必须添加以下两个配置
            contentType:false,
            processData:false,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }

                layer.msg('发布文章成功')
                location.href = '/article_list.html'
            }
        })
    }
})