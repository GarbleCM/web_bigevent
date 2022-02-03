$(function(){
    getUserInfo();
    const layer = layui.layer;
    $('#btnLogOut').on('click', function(e){
        layer.confirm('确认退出登录?', {icon: 3, title:'提示'}, function(index){
            // 清除本地缓存中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭confirm弹出层
            layer.close(index);
        });
    })
    
})
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res){
            if(res.status !== 0){
                return layui.layer.msg(res.message);
            }
            console.log(res);
            renderAvatar(res.data);
        },    
    })
}
/* 渲染用户头像 */
function renderAvatar(user){
    // 1. 获取用户的名称
    var name = user.nickname || user.username;
    // 2. 渲染用户名
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户头像
    if(user.user_pic !== null){
        // 3.1 优先渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.user-avatar').hide();
    }else{
        // 3.2 无图片头像渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.user-avatar').html(first).show()
    }
}


    