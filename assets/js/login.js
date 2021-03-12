$(function(){
    // 这是点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录链接
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数来自定义
    form.verify({
        //自定义了pwd校验规则
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        //   校验两次密码是否一致的规则
        repwd: function(value){
            //通过形参拿到德是确认密码框中内容
            //还需要拿到密码框中的内容
            //然后进行一次等于的判断
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一样'
            }
        }   
    })

    //添加注册表单提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault()

        var data ={
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val(),
        }

        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:data,
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg('注册成功，请登录')
                //模拟人的点击行为
                $('#link_login').click()
            }
        })
    })

    //添加登录表单提交
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速获取表单数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败')
                }

                layer.msg('登录成功')
                //将登录成功后的token保存到localStorage中
                localStorage.setItem('token',res.token)

                //跳转到主页
                location.href = '/index.html'
            }
        })
    })
})