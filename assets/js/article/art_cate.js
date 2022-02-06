$(function(){
    // 定义要使用的变量
    const layer = layui.layer;
    const form = layui.form;
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用tempalte函数 获取html结构
                var htmlStr = template('tpl-table', res);
                // 渲染html
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    // 为 添加类别 按钮绑定点击事件
    $('#btnAddCate').on('click', function(e){
        // 弹出层
        indexAdd = layer.open({
            type: 1, // 只保留页面层
            area: ['500px', '250px'], // 设置页面层的宽高
            title: '添加文章分类',
            content: $('#dialog-Add').html(),
        });
    })

    // 通过代理的方式 监听 form-add 表单的submit提交事件
    $('body').on('submit','#form-add', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起Ajax请求 新增文章分类
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('新增文章分类失败！');
                }
                console.log('新增文章分类成功！');
                layer.msg('新增文章分类成功！');
                initArtCateList();
                // 分类新增成功后 根据索引来关闭弹出层
                layer.close(indexAdd); 
            }
        })
    })

    // 通过代理的方式 为编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btnEdit', function(e){
        // 弹出层
        indexEdit = layer.open({
            type: 1, // 只保留页面层
            area: ['500px', '250px'], // 设置页面层的宽高
            title: '修改文章分类',
            content: $('#dialog-Edit').html(),
        });
        // console.log($(this).attr('data-id'));
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + $(this).attr('data-id'),
            success: function(res){
                // 高级渲染 利用form.val()
                // console.log(res);
                form.val('form-Edit', res.data)
                
                // 初级渲染
                // $('#form-edit [name=name]').val(res.data.name);
                // $('#form-edit [name=alias]').val(res.data.alias);
            }
        })
    })

    // 通过代理的方式，监听form-edit表单的提交事件
    $('body').on('submit', '#form-edit', function(e){
        // console.log($('#form-edit [name=id]').val());
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新分类信息失败！');
                }
                layer.msg('更新分类信息成功！');
                initArtCateList();
                layer.close(indexEdit);
            }
        })
    })
    
    // 通过代理的方式，监听form-edit表单的删除事件
    $('tbody').on('click', '.btnDel', function(e){
        // 弹出层
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'},function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章分类数据失败！')
                    }
                    layer.msg('删除文章分类数据成功！');
                    initArtCateList()                 
                }
            })
            layer.close(index);
        }); 
        // console.log($(this).attr('data-id'));
        
    })
})