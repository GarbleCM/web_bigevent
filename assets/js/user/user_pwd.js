$(function(){
    const form = layui.form;
    const layer = layui.layer;

    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value){
            if($('.layui-form [name=oldPwd]').val() === value){
                return '新密码不能与旧密码一致!'
            }
        },
        rePwd: function(value){
            if($('.layui-form [name=newPwd]').val() !== value){
                return '两次密码不一致！'
            }
        }
    })
    updatePwd(layer)
})

function updatePwd(layer){
    $('.layui-form').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功')
                console.log(res);
                // 调用原生DOM的 reset重置表单方法
                $('.layui-form')[0].reset();
                layer.msg('密码重置成功后请重新登录', {
                    icon: 1,
                    time: 1000 //1秒关闭（如果不配置，默认是3秒）
                  }, function(){
                    window.parent.$('#btnLogOut').trigger('click'),
                    localStorage.removeItem('token')
                  })
                // window.parent.getUserInfo();
                
            }
        })
    })
}