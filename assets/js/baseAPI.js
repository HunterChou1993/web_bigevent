$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为由权限的接口设置 headers 请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }
    
    // 全局统一挂载complete函数
    options.complete = function(res) {
        // 在 complete回调函数中使用res.responseJSON拿到服务器响应的数据
        if(res.responseJSON.status === 1 
            && res.responseJSON.message === '身份认证失败！'){
                // 强制清空 token
                localStorage.removeItem('token')
                // 强制跳转到登录页
                location.href ='/login.html'
        }
    }
})