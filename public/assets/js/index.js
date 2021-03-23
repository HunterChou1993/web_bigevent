$(function(){
    getUserInfo()

    var layer = layui.layer

    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登录？',{icon:3, titile:'提示'},
        function(index){
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页
            location.href ='/login.html'
            layer.close(index);
        })
    })
})

// 获取用户信息
function getUserInfo(){
    $.ajax({
       method:'GET',
       url:'/my/userinfo' ,
       success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data);
       }
       //无论成功还是失败都会调用complete
    //    complete:function(res){
    //     // 在 complete回调函数中使用res.responseJSON拿到服务器响应的数据
    //     if(res.responseJSON.status === 1 
    //         && res.responseJSON.message === '身份认证失败！'){
    //             // 强制清空 token
    //             localStorage.removeItem('token')
    //             // 强制跳转到登录页
    //             location.href ='/login.html'
    //     }
    //    }

    })
}

//渲染用户的头像
function renderAvatar(data){
    // 1. 获取用户的名称
    var name = data.nickname || data.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 3. 按需渲染用户的头像
    if(data.user_pic !== null){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',data.user_pic).show()
        $('.text-avatar').hide()
    }else{
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}