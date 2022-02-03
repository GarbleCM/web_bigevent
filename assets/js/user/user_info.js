$(function(){
    /* 自定义校验规则 */
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname : function(value){
            if(value.length > 6){
                return '昵称必须在1~6和字符之间 '
            }
        }    
    })
    // 获取用户信息
    function inituseinfo(){
        $.ajax({
           method: 'GET',
           url: '/my/userinfo',
           success: function(res){
               if(res.status !== 0){
                   layer.msg('获取用户基本信息失败')
               }
               // 渲染用户信息
               form.val('formUserInfo',res.data)
           } 
        })
    }
    inituseinfo();

    // 重置表单
    $('#btnReset').on('click', function(e){
        e.preventDefault();
        inituseinfo();
    })
    
    // 更新用户信息
    $('.layui-form').on('submit', function(e){
        /* var a = $('form').serialize();
        console.log(a); */
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('修改用户信息失败');
                }
                layer.msg('修改用户信息成功')
                // 调用父页面index.js中的getUserInfo方法重新渲染用户名和头像
                window.parent.getUserInfo();
                
            }
        })

    })
})
