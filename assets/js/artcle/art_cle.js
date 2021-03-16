$(function(){
    var layer = layui.layer
    var index = null
    var indexEdit = null
    var form =layui.form

    initArtActList()

    // 获取文章分类列表
    function initArtActList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success: function(res){
               var htmlStr = template('tpl-talbe',res)
               $('tbody').html(htmlStr)
            }
        })
    }
    
    $('#btnAddCate').on('click',function(){
         index = layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加文章分类',
            content:$('#dialog-add').html()
        })

        
    })

    // 通过代理形式 为form绑定submit事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addCates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status != 0){
                    return layer.msg(res.message)
                }

                initArtActList()
                layer.msg('新增分类成功')
                layer.close(index)
            }
        })

    })

    

    // 添加编辑弹出事件
    $('tbody').on('click','.btn-edit',function(){
        // 弹出修改文章的层
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title:'修改文章分类',
            content:$('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // 获取对应的数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
           success:function(res){
               form.val('form-edit',res.data)
           }
        })
    })

    //添加修改分类表单绑定submit
    $('body').on('submit','#form-edit',function(){
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }

                layer.msg(res.message)
                layer.close(indexEdit)
                initArtActList()
            }
        })
    })

    // 通过代理形式来删除
    $('tbody').on('click','.btn-delete',function(){
       var id = $(this).attr('data-id')
       layer.confirm('确认删除',{icon:3,title:'提示'},function(index){
        $.ajax({
            method:'GET',
            url:'/my/article/deletecate/'+ id,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('删除分类成功')
                initArtActList()
            }
        })
        layer.close(index)
    })
    })
    
})