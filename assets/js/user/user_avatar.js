$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //绑定上传图片事件
    $('#btnChooseImage').on('click',function(){
        $('#file').click()
        // 为文件选择框绑定change事件
        $('#file').on('change',function(e){
            var fileList = e.target.files
            if(fileList.length === 0){
                layer.msg('请选择图片')
            }

            // 拿到用户选择的文件
            var file = e.target.files[0]
            // 将文件，转化为路径
            var imageURL = URL.createObjectURL(file)
            // 重新 初始化裁剪区域
            $image.cropper('destroy').attr('src',imageURL).cropper(options)
        })
    })

    $('#btnUpload').on('click',function(){
        // 拿到用户裁剪之后的头像
        var dataURL = $image.cropper('getCroppedCanvas',
        {
            width:100,
            height: 100
        }).toDataURL('image/png')

        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更换头像失败')
                }
                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})