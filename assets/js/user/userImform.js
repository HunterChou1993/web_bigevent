$(function() {
    var form = layui.form
    var layer = layui.layer
    var data = {}

    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称长度必须在1 ~ 6个字符之间'
            }
        }
    })

    initUserInform()

     // 初始化用户的基本信息
    function initUserInform() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success: function(res) {
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败')
                }
                // 调用 form.val 快速赋值
                form.val('formUserInfo',res.data)
                data = res.data
            }
        })
    }


    // 重置表单事件
    $('#btnReset').on('click', function(e){
        // 阻止表单默认重置行为
        e.preventDefault()

        form.val('formUserInfo',data)
    })

   // 监听表单的提交事件
   $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户失败')
                }

                layer.msg(res.message)

                //调用父页面的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
   })
})



